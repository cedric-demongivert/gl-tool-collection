import { ReallocableCollection } from '../ReallocableCollection'
import { SequenceView } from '../view/SequenceView'
import { Sequence } from '../Sequence'

import { UnsignedIntegerBuffer } from '../native/UnsignedIntegerBuffer'

import { Set } from './Set'
import { MutableSet } from './MutableSet'
import { IdentifierSetIterator } from './IdentifierSetIterator'

/**
 * 
 */
export class IdentifierSet implements MutableSet<number>, Sequence<number>, ReallocableCollection {
  /**
   * 
   */
  private _sparse: UnsignedIntegerBuffer

  /**
   * 
   */
  private _dense: UnsignedIntegerBuffer

  /**
   * 
   */
  private _size: number

  /**
  * Create a new empty identifier set.
  *
  * @param capacity - Number of identifier to allocate.
  */
  public constructor(capacity: number) {
    this._sparse = UnsignedIntegerBuffer.upTo(capacity - 1, capacity)
    this._dense = UnsignedIntegerBuffer.upTo(capacity - 1, capacity)
    this._size = 0

    for (let index = 0; index < capacity; ++index) {
      this._sparse[index] = index
      this._dense[index] = index
    }
  }

  /**
  * @see Collection.size
  */
  public get size(): number {
    return this._size
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity(): number {
    return this._dense.length
  }

  /**
  * @see Collection.has
  */
  public has(element: number): boolean {
    return this._sparse[element] < this._size
  }

  /**
  * @see Sequence.indexOf
  */
  public indexOf(element: number): number {
    const index: number = this._sparse[element]
    return index < this._size ? index : -1
  }

  /**
  * @see Sequence.hasInSubsequence
  */
  public hasInSubsequence(element: number, offset: number, size: number): boolean {
    const index: number = this.indexOf(element)
    return index >= offset && index < offset + size
  }

  /**
  * @see Sequence.indexOfInSubsequence
  */
  public indexOfInSubsequence(element: number, offset: number, size: number): number {
    const index: number = this.indexOf(element)
    return index >= offset && index < offset + size ? index : -1
  }

  /**
  * @see MutableSet.add
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

  public next(): number {
    this._size += 1
    return this._dense[this._size - 1]
  }

  /**
  * @see MutableSet.delete
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
  * @see Sequence.get
  */
  public get(index: number): number {
    return this._dense[index]
  }

  /**
  * @see StaticCollection.reallocate
  */
  public reallocate(capacity: number): void {
    const oldDense: UnsignedIntegerBuffer = this._dense
    const oldSize: number = this._size

    const newDense: UnsignedIntegerBuffer = UnsignedIntegerBuffer.upTo(capacity - 1, capacity)
    const newSparse: UnsignedIntegerBuffer = UnsignedIntegerBuffer.upTo(capacity - 1, capacity)

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
  * @see StaticCollection.fit
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
    if (this._size <= 0) return undefined

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
    if (this._size <= 0) return undefined

    let result: number = this._dense[0]

    for (let index = 1, length = this._size; index < length; ++index) {
      const cell: number = this._dense[index]
      result = cell < result ? cell : result
    }

    return result
  }

  /**
  * @see MutableSet.clear
  */
  public clear(): void {
    this._size = 0
  }

  /**
  * @see Sequence.first
  */
  public get first(): number {
    return this._dense[0]
  }

  /**
  * @see Sequence.firstIndex
  */
  public get firstIndex(): number {
    return 0
  }

  /**
  * @see Sequence.last
  */
  public get last(): number {
    return this._dense[this._size - 1]
  }

  /**
  * @see Sequence.lastIndex
  */
  public get lastIndex(): number {
    return this._size - 1
  }

  /**
  * @see Collection.iterator
  */
  public iterator(): IdentifierSetIterator {
    const iterator: IdentifierSetIterator = new IdentifierSetIterator()

    iterator.identifierSet = this
    iterator.index = 0

    return iterator
  }

  /**
  * @see Set.copy
  */
  public copy(toCopy: Set<number>): void {
    this.clear()

    for (const element of toCopy) {
      this.add(element)
    }
  }

  /**
  * @see Collection.view
  */
  public view(): Sequence<number> {
    return SequenceView.wrap(this)
  }

  /**
  * @see Collection.clone
  */
  public clone(): IdentifierSet {
    const result: IdentifierSet = IdentifierSet.allocate(this._dense.length)

    result.copy(this)

    return result
  }

  /**
  * @see Collection.iterator
  */
  public *[Symbol.iterator](): Iterator<number> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._dense[index]
    }
  }

  /**
  * @see Collection.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other.isSet) {
      if (other.size !== this._size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index))) return false
      }

      return true
    }

    return false
  }
}

export namespace IdentifierSet {
  export function copy(toCopy: IdentifierSet): IdentifierSet {
    return toCopy == null ? null : toCopy.clone()
  }

  export function allocate(capacity: number): IdentifierSet {
    return new IdentifierSet(capacity)
  }
}
