import { SequenceCursor } from '../sequence/SequenceCursor'
import { createUintArrayUpTo, UintArray } from '../native/TypedArray'
import { ForwardCursor } from '../cursor'

import { Group } from '../group/Group'
import { OrderedGroup } from '../group/OrderedGroup'
import { createOrderedGroupView } from '../group/OrderedGroupView'

import { OrderedSet } from './OrderedSet'
import { join } from '../algorithm'
import { Comparator } from '@cedric-demongivert/gl-tool-utils'
import { IllegalArgumentsError } from '../error/IllegalArgumentsError'
import { IllegalSubsequenceError } from '../sequence/error/IllegalSubsequenceError'

/**
 * 
 */
export class IdentifierSet implements OrderedSet<number> {
  /**
   * 
   */
  private _sparse: UintArray

  /**
   * 
   */
  private _dense: UintArray

  /**
   * 
   */
  private _size: number

  /**
   * 
   */
  private readonly _view: OrderedGroup<number>

  /**
   * Create a new empty identifier set.
   *
   * @param capacity - Number of identifier to allocate.
   */
  public constructor(capacity: number) {
    this._sparse = createUintArrayUpTo(capacity - 1, capacity)
    this._dense = createUintArrayUpTo(capacity - 1, capacity)
    this._size = 0

    for (let index = 0; index < capacity; ++index) {
      this._sparse[index] = index
      this._dense[index] = index
    }

    this._view = createOrderedGroupView(this)
  }

  /**
   * @see {@link Collection.size}
   */
  public get size(): number {
    return this._size
  }

  /**
   * @see {@link StaticCollection.capacity}
   */
  public get capacity(): number {
    return this._dense.length
  }

  /**
   * @see {@link Collection.has}
   */
  public has(element: number, startOrEnd: number = 0, endOrStart: number = this.size): boolean {
    return this.indexOf(element, startOrEnd, endOrStart) >= 0
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: number, startOrEnd: number = 0, endOrStart: number = this.size): number {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const result = this._sparse[element]

    return result >= start && result < end && this._dense[result] === element ? result : - 1
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

    const elements = this._dense
    
    for (let index = 0, size = this._size; index < size; ++index) {
      if (comparator(key, elements[index]) === 0) {
        return index
      }
    }

    return -1
  }

  /**
   * @see {@link Set.add}
   */
  public add(element: number): void {
    const index: number = this._sparse[element]

    if (index >= this._size) {
      const swap: number = this._dense[this._size]
      this._sparse[swap] = index
      this._sparse[element] = this._size
      this._dense[this._size] = element
      this._dense[index] = swap
      this._size += 1
    }
  }

  /**
   * 
   */
  public next(): number {
    this._size += 1
    return this._dense[this._size - 1]
  }

  /**
   * @see {@link Set.delete}
   */
  public delete(element: number): void {
    const index: number = this._sparse[element]

    if (index < this._size) {
      this._size -= 1

      const last: number = this._dense[this._size]

      this._dense[this._size] = element
      this._dense[index] = last
      this._sparse[element] = this._size
      this._sparse[last] = index
    }
  }

  /**
   * @see {@link Sequence.get}
   */
  public get(index: number): number {
    return this._dense[index]
  }

  /**
   * @see {@link StaticCollection.reallocate}
   */
  public reallocate(capacity: number): void {
    const oldDense: UintArray = this._dense
    const oldSize: number = this._size

    const newDense: UintArray = createUintArrayUpTo(capacity - 1, capacity)
    const newSparse: UintArray = createUintArrayUpTo(capacity - 1, capacity)

    this._dense = newDense
    this._sparse = newSparse
    let size: number = 0

    for (let index = 0; index < capacity; ++index) {
      newDense[index] = index
      newSparse[index] = index
    }

    for (let index = 0; index < oldSize; ++index) {
      const element: number = oldDense[index]

      if (element < capacity) {
        const swap: number = newDense[size]
        const swapIndex: number = newSparse[element]

        newSparse[swap] = swapIndex
        newSparse[element] = size
        newDense[size] = element
        newDense[swapIndex] = swap
        size += 1
      }
    }

    this._size = size
  }

  /**
   * @see {@link StaticCollection.fit}
   */
  public fit(): void {
    const max: number = this.max()
    this.reallocate(max)
  }

  /**
   * Return the maximum element of this set.
   *
   * @returns The maximum element of this set.
   */
  public max(): number {
    if (this._size <= 0) return 0

    let result: number = this._dense[0]

    for (let index = 1, length = this._size; index < length; ++index) {
      const cell: number = this._dense[index]
      result = cell > result ? cell : result
    }

    return result
  }

  /**
   * Return the minimum element of this set.
   *
   * @returns The minimum element of this set.
   */
  public min(): number {
    if (this._size <= 0) return 0

    let result: number = this._dense[0]

    for (let index = 1, length = this._size; index < length; ++index) {
      const cell: number = this._dense[index]
      result = cell < result ? cell : result
    }

    return result
  }

  /**
   * @see {@link Clearable.clear}
   */
  public clear(): void {
    this._size = 0
  }

  /**
   * @see {@link Sequence.first}
   */
  public get first(): number {
    return this._dense[0]
  }

  /**
   * @see {@link Sequence.last}
   */
  public get last(): number {
    return this._dense[this._size - 1]
  }

  /**
   * @see {@link Collection.forward}
   */
  public forward(): ForwardCursor<number> {
    return new SequenceCursor(this, 0)
  }

  /**
   * @see {@link Set.copy}
   */
  public copy(toCopy: Group<number>): void {
    this.clear()

    for (const element of toCopy) {
      this.add(element)
    }
  }

  /**
   * @see {@link Collection.view}
   */
  public view(): OrderedGroup<number> {
    return this._view
  }

  /**
   * @see {@link Clonable.clone}
   */
  public clone(): IdentifierSet {
    const result: IdentifierSet = createIdentifierSet(this._dense.length)

    result.copy(this)

    return result
  }

  /**
   * @see {@link Collection.values}
   */
  public * values(): IterableIterator<number> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._dense[index]
    }
  }

  /**
   * @see {@link Collection[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof IdentifierSet) {
      if (other.size !== this._size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index))) return false
      }

      return true
    }

    return false
  }

  /**
   * 
   */
  public stringify(): string {
    return '{' + join(this, ', ') + '}'
  }

  /**
   * @see {@link Object.toString}
   */
  public toString(): string {
    return this.constructor.name + ' ' + this.stringify()
  }
}

/**
 * 
 */
export function createIdentifierSet(capacity: number): IdentifierSet {
  return new IdentifierSet(capacity)
}