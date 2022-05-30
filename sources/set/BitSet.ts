import { Pack, Sequence, SequenceCursor } from '../sequence'

import { ReallocableCollection } from '../ReallocableCollection'

import { Group } from './Group'
import { OrderedSet } from './OrderedSet'
import { OrderedGroup } from './OrderedGroup'
import { RandomAccessCursor } from '../cursor'
import { Collection } from '../Collection'

// SWAR Algorithm [SIMD Within A Register]
function countBits(bits: number): number {
  bits = (bits | 0) - ((bits >> 1) & 0x55555555)
  bits = (bits & 0x33333333) + ((bits >> 2) & 0x33333333)
  return (((bits + (bits >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24
}

/**
 *
 */
const BITSUMS: Pack<number> = Pack.uint32(32)

for (let index = 0; index < 32; ++index) {
  BITSUMS.set(index, ~(0xFFFFFFFF << index))
}

/**
 * 
 */
export class BitSet implements ReallocableCollection, OrderedSet<number>
{
  /**
  *
  */
  private _size: number

  /**
  *
  */
  private _elements: Pack<number>

  /**
   * 
   */
  private readonly _view: OrderedGroup<number>

  /**
  *
  */
  public constructor(capacity: number = 32) {
    this._elements = Pack.uint32(capacity >> 5 + (capacity % 32 === 0 ? 0 : 1))
    this._size = 0
    this._view = OrderedGroup.view(this)
  }

  /**
   * @see Collection.prototype[Collection.IS]
   */
  public [Collection.IS](): true {
    return true
  }

  /**
   * @see Collection.prototype.isSequence
   */
  public isSequence(): true {
    return true
  }

  /**
   * @see Collection.prototype.isPack
   */
  public isPack(): false {
    return false
  }

  /**
   * @see Collection.prototype.isList
   */
  public isList(): false {
    return false
  }

  /**
   * @see Collection.prototype.isGroup
   */
  public isGroup(): true {
    return true
  }

  /**
   * @see Collection.prototype.isSet
   */
  public isSet(): true {
    return true
  }

  /**
  * @see Collection.prototype.size
  */
  public get size(): number {
    return this._size
  }

  /**
  * @see StaticCollection.prototype.capacity
  */
  public get capacity(): number {
    return this._elements.capacity * 32
  }

  /**
  * @see Collection.prototype.has
  */
  public has(element: number): boolean {
    const elements: Pack<number> = this._elements
    const cell: number = element >> 5
    const mask: number = 0b1 << (element % 32)

    return cell < elements.size && (elements.get(cell)! & mask) > 0
  }

  /**
  * @see Sequence.prototype.indexOf
  */
  public indexOf(element: number): number {
    const elements: Pack<number> = this._elements
    const cell: number = element >> 5
    const mask: number = 0b1 << (element % 32)

    if (cell < elements.size && (elements.get(cell)! & mask) > 0) {
      let offset: number = 0

      for (let index = 0; index < cell; ++index) {
        offset += countBits(elements.get(index)!)
      }

      return offset + countBits(elements.get(cell)! & ~(0xFFFFFFFF << element % 32)) - 1
    } else {
      return -1
    }
  }

  /**
  * @see Sequence.prototype.hasInSubsequence
  */
  public hasInSubsequence(element: number, offset: number, size: number): boolean {
    const index: number = this.indexOf(element)
    return index >= offset && index < offset + size
  }

  /**
  * @see Sequence.prototype.indexOfInSubsequence
  */
  public indexOfInSubsequence(element: number, offset: number, size: number): number {
    const index: number = this.indexOf(element)

    if (index < size) {
      return Math.max(index - offset, -1)
    } else {
      return -1
    }
  }

  /**
  * @see Set.prototype.add
  */
  public add(element: number): void {
    const elements: Pack<number> = this._elements
    const cell: number = element >> 5
    const mask: number = 0b1 << (element % 32)

    if (cell >= elements.size || (elements.get(cell)! & mask) === 0) {
      this._size += 1

      if (elements.capacity < cell) {
        elements.reallocate(cell)
      }

      if (elements.size < cell) {
        elements.set(cell, mask)
      } else {
        elements.set(cell, elements.get(cell)! | mask)
      }
    }
  }

  /**
  * @see Set.prototype.delete
  */
  public delete(element: number): void {
    const elements: Pack<number> = this._elements
    const cell: number = element >> 5
    const mask: number = 0b1 << (element % 32)

    if (cell < elements.size && (elements.get(cell)! & mask) > 0) {
      this._size -= 1
      const nextBits: number = elements.get(cell)! & ~mask

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
  * @see Sequence.prototype.get
  */
  public get(index: number): number {
    if (index > this._size) return 0

    const elements: Pack<number> = this._elements
    let skipped: number = 0
    let cell: number = 0
    let cellElements: number = countBits(elements.get(cell)!)

    while (skipped + cellElements < index) {
      cell += 1
      skipped += cellElements
      cellElements = countBits(elements.get(cell)!)
    }

    const bits: number = elements.get(cell)!
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
  * @see ReallocableCollection.prototype.reallocate
  */
  public reallocate(capacity: number): void {
    this._elements.reallocate(capacity)
  }

  /**
  * @see ReallocableCollection.prototype.fit
  */
  public fit(): void {
    this._elements.fit()
  }

  /**
  * @see Set.prototype.copy
  */
  public copy(toCopy: Group<number>): void {
    this.clear()

    for (const element of toCopy) {
      this.add(element)
    }
  }

  /**
  * @see Collection.prototype.clone
  */
  public clone(): BitSet {
    const result: BitSet = new BitSet(this.capacity)
    result.copy(this)
    return result
  }

  /**
  * @see Clearable.prototype.clear
  */
  public clear(): void {
    this._elements.clear()
    this._size = 0
  }

  /**
  * @see Sequence.prototype.first
  */
  public get first(): number {
    return this.get(0)
  }

  /**
  * @see Sequence.prototype.last
  */
  public get last(): number {
    // optimizable
    return this.get(this._size - 1)
  }

  /**
  * @see Collection.prototype.view
  */
  public view(): OrderedGroup<number> {
    return this._view
  }

  /**
  * @see Collection.prototype.forward
  */
  public forward(): RandomAccessCursor<number> {
    return new SequenceCursor(this, 0)
  }

  /**
  * @see Collection.prototype.values
  */
  public * values(): IterableIterator<number> {
    const elements: Pack<number> = this._elements

    for (let cell = 0; cell < elements.size; ++cell) {
      const base: number = cell * 32

      for (let index = 0; index < 32; ++index) {
        if ((elements.get(cell)! & (0b1 << index)) > 0) {
          yield base + index
        }
      }
    }
  }

  /**
  * @see Collection.prototype[Symbol.iterator]
  */
  public [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  /**
  * @see Collection.equals
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
   * @see Object.prototype.toString
   */
  public toString(): string {
    return this.constructor.name + ' ' + Group.stringify(this)
  }
}

export namespace BitSet {
  /**
  * Return a copy of a given pack set.
  *
  * @param toCopy - A pack set to copy.
  */
  export function copy(toCopy: BitSet): BitSet {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  /**
  *
  */
  export function allocate(capacity: number): BitSet {
    return new BitSet(capacity)
  }
}
