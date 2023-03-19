import { Pack } from '../pack/Pack'
import { createUint32Pack } from '../pack/BufferPack'
import { SequenceCursor } from '../sequence/SequenceCursor'

import { Group } from '../group/Group'
import { OrderedGroup } from '../group/OrderedGroup'

import { RandomAccessCursor } from '../cursor/RandomAccessCursor'

import { OrderedSet } from './OrderedSet'
import { createOrderedGroupView } from '../group/OrderedGroupView'
import { IllegalArgumentsError } from '../error/IllegalArgumentsError'
import { IllegalSubsequenceError } from '../sequence/error/IllegalSubsequenceError'
import { Comparator } from '@cedric-demongivert/gl-tool-utils'
import { join } from '../algorithm'

// SWAR Algorithm [SIMD Within A Register]
function countBits(bits: number): number {
  bits = (bits | 0) - ((bits >> 1) & 0x55555555)
  bits = (bits & 0x33333333) + ((bits >> 2) & 0x33333333)
  return (((bits + (bits >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24
}

/**
 *
 */
const BITSUMS: Pack<number> = createUint32Pack(32)

for (let index = 0; index < 32; ++index) {
  BITSUMS.set(index, ~(0xFFFFFFFF << index))
}

/**
 * 
 */
export class BitSet implements OrderedSet<number>
{
  /**
   *
   */
  private _size: number

  /**
   *
   */
  private readonly _elements: Pack<number>

  /**
   *
   */
  public constructor(capacity: number = 32) {
    this._elements = createUint32Pack(capacity >> 5 + (capacity % 32 === 0 ? 0 : 1))
    this._size = 0
  }

  /**
   * @see {@link OrderedSet.size}
   */
  public get size(): number {
    return this._size
  }

  /**
   * 
   */
  public get capacity(): number {
    return this._elements.capacity * 32
  }

  /**
   * @see {@link OrderedSet.has}
   */
  public has(element: number, startOrEnd: number = 0, endOrStart = this.size): boolean {
    if (startOrEnd === 0 && endOrStart === this.size || endOrStart === 0 && startOrEnd === this.size) {
      const elements: Pack<number> = this._elements
      const cell: number = element >> 5
      const mask: number = 0b1 << (element % 32)

      return cell < elements.size && (elements.get(cell) & mask) > 0
    } else {
      return this.indexOf(element, startOrEnd, endOrStart) > -1
    }    
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: number, startOrEnd: number = 0, endOrStart = this.size): number {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements: Pack<number> = this._elements
    const cell: number = element >> 5
    const mask: number = 0b1 << (element % 32)

    if (cell < elements.size && (elements.get(cell) & mask) > 0) {
      let offset: number = 0

      for (let index = 0; index < cell; ++index) {
        offset += countBits(elements.get(index))
      }

      const result = offset + countBits(elements.get(cell) & ~(0xFFFFFFFF << element % 32)) - 1

      return result >= start && result < end ? result : -1
    } else {
      return -1
    }
  }

  /**
   * 
   */
  public search<Key>(key: Key, comparator: Comparator<Key, number>, startOrEnd: number = 0, endOrStart: number = this.size): number {
    const size = this.size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements: Pack<number> = this._elements
    let skipped: number = 0

    for (let cell = 0; cell < elements.size; ++cell) {
      const base: number = cell * 32

      for (let index = 0; index < 32; ++index) {
        if ((elements.get(cell) & (0b1 << index)) > 0) {
          if (skipped >= start) {
            if (skipped < end) {
              if (comparator(key, base + index) === 0) return skipped
            } else {
              return -1
            }
          }

          skipped += 1
        }
      }
    }

    return -1
  }
  

  /**
  * @see {@link Set.add}
  */
  public add(element: number): void {
    const elements: Pack<number> = this._elements
    const cell: number = element >> 5
    const mask: number = 0b1 << (element % 32)

    if (cell >= elements.size || (elements.get(cell) & mask) === 0) {
      this._size += 1

      if (elements.capacity < cell) {
        elements.reallocate(cell)
      }

      if (elements.size < cell) {
        elements.set(cell, mask)
      } else {
        elements.set(cell, elements.get(cell) | mask)
      }
    }
  }

  /**
  * @see {@link Set.delete}
  */
  public delete(element: number): void {
    const elements: Pack<number> = this._elements
    const cell: number = element >> 5
    const mask: number = 0b1 << (element % 32)

    if (cell < elements.size && (elements.get(cell) & mask) > 0) {
      this._size -= 1
      const nextBits: number = elements.get(cell) & ~mask

      if (nextBits === 0) {
        do {
          elements.size -= 1
        } while (elements.last === 0)
      } else {
        elements.set(cell, nextBits)
      }
    }
  }

  /**
  * @see {@link Sequence.get}
  */
  public get(index: number): number {
    if (index > this._size) return 0

    const elements: Pack<number> = this._elements
    let skipped: number = 0
    let cell: number = 0
    let cellElements: number = countBits(elements.get(cell))

    while (skipped + cellElements < index) {
      cell += 1
      skipped += cellElements
      cellElements = countBits(elements.get(cell))
    }

    const bits: number = elements.get(cell)
    const rest: number = index - skipped // + 1?

    /** generated **/
    if (countBits(bits & 0xffff) < rest) {
      if (countBits(bits & 0xffffff) < rest) {
        if (countBits(bits & 0xfffffff) < rest) {
          if (countBits(bits & 0x3fffffff) < rest) {
            return countBits(bits & 0x7fffffff) < rest ? cell * 32 + 31 : cell * 32 + 30
          } else {
            return countBits(bits & 0x1fffffff) < rest ? cell * 32 + 29 : cell * 32 + 28
          }
        } else {
          if (countBits(bits & 0x3ffffff) < rest) {
            return countBits(bits & 0x7ffffff) < rest ? cell * 32 + 27 : cell * 32 + 26
          } else {
            return countBits(bits & 0x1ffffff) < rest ? cell * 32 + 25 : cell * 32 + 24
          }
        }
      } else {
        if (countBits(bits & 0xfffff) < rest) {
          if (countBits(bits & 0x3fffff) < rest) {
            return countBits(bits & 0x7fffff) < rest ? cell * 32 + 23 : cell * 32 + 22
          } else {
            return countBits(bits & 0x1fffff) < rest ? cell * 32 + 21 : cell * 32 + 20
          }
        } else {
          if (countBits(bits & 0x3ffff) < rest) {
            return countBits(bits & 0x7ffff) < rest ? cell * 32 + 19 : cell * 32 + 18
          } else {
            return countBits(bits & 0x1ffff) < rest ? cell * 32 + 17 : cell * 32 + 16
          }
        }
      }
    } else {
      if (countBits(bits & 0xff) < rest) {
        if (countBits(bits & 0xfff) < rest) {
          if (countBits(bits & 0x3fff) < rest) {
            return countBits(bits & 0x7fff) < rest ? cell * 32 + 15 : cell * 32 + 14
          } else {
            return countBits(bits & 0x1fff) < rest ? cell * 32 + 13 : cell * 32 + 12
          }
        } else {
          if (countBits(bits & 0x3ff) < rest) {
            return countBits(bits & 0x7ff) < rest ? cell * 32 + 11 : cell * 32 + 10
          } else {
            return countBits(bits & 0x1ff) < rest ? cell * 32 + 9 : cell * 32 + 8
          }
        }
      } else {
        if (countBits(bits & 0xf) < rest) {
          if (countBits(bits & 0x3f) < rest) {
            return countBits(bits & 0x7f) < rest ? cell * 32 + 7 : cell * 32 + 6
          } else {
            return countBits(bits & 0x1f) < rest ? cell * 32 + 5 : cell * 32 + 4
          }
        } else {
          if (countBits(bits & 0x3) < rest) {
            return countBits(bits & 0x7) < rest ? cell * 32 + 3 : cell * 32 + 2
          } else {
            return countBits(bits & 0x1) < rest ? cell * 32 + 1 : cell * 32 + 0
          }
        }
      }
    }
  }

  /**
  * 
  */
  public reallocate(capacity: number): void {
    this._elements.reallocate(capacity)
  }

  /**
  * 
  */
  public fit(): void {
    this._elements.fit()
  }

  /**
  * @see {@link OrderedSet.copy}
  */
  public copy(toCopy: Group<number>): void {
    this.clear()

    for (const element of toCopy) {
      this.add(element)
    }
  }

  /**
  * @see {@link OrderedSet.clone}
  */
  public clone(): BitSet {
    const result: BitSet = new BitSet(this.capacity)
    result.copy(this)
    return result
  }

  /**
  * @see {@link OrderedSet.clear}
  */
  public clear(): void {
    this._elements.clear()
    this._size = 0
  }

  /**
  * @see {@link OrderedSet.first}
  */
  public get first(): number {
    return this.get(0)
  }

  /**
  * @see {@link OrderedSet.last}
  */
  public get last(): number {
    // optimizable
    return this.get(this._size - 1)
  }

  /**
  * @see {@link OrderedSet.view}
  */
  public view(): OrderedGroup<number> {
    return createOrderedGroupView(this)
  }

  /**
  * @see {@link OrderedSet.forward}
  */
  public forward(): RandomAccessCursor<number> {
    return new SequenceCursor(this, 0)
  }

  /**
  * @see {@link OrderedSet.values}
  */
  public * values(): IterableIterator<number> {
    const elements: Pack<number> = this._elements

    for (let cell = 0; cell < elements.size; ++cell) {
      const base: number = cell * 32

      for (let index = 0; index < 32; ++index) {
        if ((elements.get(cell) & (0b1 << index)) > 0) {
          yield base + index
        }
      }
    }
  }

  /**
  * @see {@link OrderedSet[Symbol.iterator]}
  */
  public [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  /**
  * @see {@link OrderedSet.equals}
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof BitSet) {
      if (other.size !== this._elements.size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index))) return false
      }

      return true
    }

    return false
  }

  /**
   * @see {@link OrderedSet.stringify}
   */
  public stringify(): string {
    return '{' + join(this, ', ') + '}'
  }

  /**
   * @see {@link OrderedSet.toString}
   */
  public toString(): string {
    return this.constructor.name + ' ' + this.stringify()
  }
}

/**
 *
 */
export function createBitSet(capacity: number): BitSet {
  return new BitSet(capacity)
}
