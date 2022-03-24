import { Sequence } from '../Sequence'

import { Pack } from '../pack/Pack'
import { BidirectionalIterator } from '../iterator/BidirectionalIterator'
import { SequenceView } from '../view/SequenceView'

import { SparseDenseSet } from './SparseDenseSet'
import { Set } from './Set'

export class PackSparseDenseSet implements SparseDenseSet, Sequence<number>
{
  private _sparse: Pack<number>
  private _dense: Pack<number>

  /**
  * Create a new empty sparse set based uppon the given pack.
  *
  * @param dense - An empty dense number pack.
  */
  public constructor(dense: Pack<number>) {
    this._sparse = dense.clone()
    this._dense = dense
  }

  /**
  * @see Collection.size
  */
  public get size(): number {
    return this._dense.size
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity(): number {
    return this._dense.capacity
  }

  /**
  * @see Collection.has
  */
  public has(element: number): boolean {
    const index: number = this._sparse.get(element)
    return index < this._dense.size && this._dense.get(index) === element
  }

  /**
  * @see Sequence.indexOf
  */
  public indexOf(element: number): number {
    const index: number = this._sparse.get(element)

    if (index < this._dense.size && this._dense.get(index) === element) {
      return index
    }

    return -1
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
    const index: number = this._sparse.get(element)

    if (index >= this._dense.size || this._dense.get(index) !== element) {
      this._sparse.set(element, this._dense.size)
      this._dense.push(element)
    }
  }

  /**
  * @see MutableSet.delete
  */
  public delete(element: number): void {
    const index: number = this._sparse.get(element)

    if (index < this._dense.size && this._dense.get(index) === element) {
      const last: number = this._dense.get(this._dense.size - 1)
      this._dense.warp(index)
      this._sparse.set(last, index)
    }
  }

  /**
  * @see Sequence.get
  */
  public get(index: number): number {
    return this._dense.get(index)
  }

  /**
  * @see MutableSet.copy
  */
  public copy(toCopy: Set<number>): void {
    let max: number = 0

    for (let value of toCopy) {
      max = Math.max(value, max)
    }

    if (max > this.capacity) {
      this.reallocate(max + 1)
    }

    this.clear()

    for (let value of toCopy) {
      this.add(value)
    }
  }

  /**
  * @see Collection.clone
  */
  public clone(): PackSparseDenseSet {
    const copy: PackSparseDenseSet = new PackSparseDenseSet(
      this._dense.clone()
    )

    copy._dense.copy(this._dense)
    copy._sparse.copy(this._sparse)

    return copy
  }

  /**
  * @see ReallocableCollection.reallocate
  */
  public reallocate(capacity: number): void {
    const oldDense: Pack<number> = this._dense

    this._dense = this._dense.allocate(capacity)
    this._sparse = this._sparse.allocate(capacity)

    for (let index = 0, size = oldDense.size; index < size; ++index) {
      if (oldDense.get(index) < capacity) {
        this._sparse.set(oldDense.get(index), this._dense.size)
        this._dense.push(oldDense.get(index))
      }
    }
  }

  /**
  * @see ReallocableCollection.fit
  */
  public fit(): void {
    const max: number = this.max()
    this._dense.reallocate(max + 1)
    this._sparse.reallocate(max + 1)
  }

  /**
  * Return the maximum element of this set.
  *
  * @return The maximum element of this set.
  */
  public max(): number {
    if (this._dense.size <= 0) return undefined

    let result: number = this._dense.get(0)

    for (let index = 1, length = this._dense.size; index < length; ++index) {
      const cell = this._dense.get(index)
      result = cell > result ? cell : result
    }

    return result
  }

  /**
  * Return the minimum element of this set.
  *
  * @return The minimum element of this set.
  */
  public min(): number {
    if (this._dense.size <= 0) return undefined

    let result: number = this._dense.get(0)

    for (let index = 1, length = this._dense.size; index < length; ++index) {
      const cell = this._dense.get(index)
      result = cell < result ? cell : result
    }

    return result
  }

  /**
  * @see MutableSet.clear
  */
  public clear(): void {
    this._dense.clear()
  }

  /**
  * @see Sequence.first
  */
  public get first(): number {
    return this._dense.first
  }

  /**
  * @see Sequence.firstIndex
  */
  public get firstIndex(): number {
    return this._dense.firstIndex
  }

  /**
  * @see Sequence.last
  */
  public get last(): number {
    return this._dense.last
  }

  /**
  * @see Sequence.first
  */
  public get lastIndex(): number {
    return this._dense.lastIndex
  }

  /**
  * @see Collection.view
  */
  public view(): Sequence<number> {
    return SequenceView.wrap(this)
  }

  /**
  * @see Collection.iterator
  */
  public iterator(): BidirectionalIterator<number> {
    return this._dense.iterator()
  }

  /**
  * @see Collection.iterator
  */
  public *[Symbol.iterator](): Iterator<number> {
    for (let index = 0, length = this._dense.size; index < length; ++index) {
      yield this._dense.get(index)
    }
  }

  /**
  * @see Collection.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof PackSparseDenseSet) {
      if (other.size !== this._dense.size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index))) return false
      }

      return true
    }

    return false
  }
}

export namespace PackSparseDenseSet {
  /**
  * Return a copy of a given sparse set.
  *
  * @param toCopy - A sparse set to copy.
  */
  export function copy(toCopy: PackSparseDenseSet): PackSparseDenseSet {
    return toCopy == null ? null : toCopy.clone()
  }

  /**
  * Instantiate a uint32 sparse-dense set.
  *
  * @param capacity - Capacity of the sparse-dense set to instantiate.
  *
  * @return A new sparse-dense set of the given capacity.
  */
  export function uint32(capacity: number): PackSparseDenseSet {
    return new PackSparseDenseSet(Pack.uint32(capacity))
  }

  /**
  * Instantiate a uint16 sparse-dense set.
  *
  * @param capacity - Capacity of the sparse-dense set to instantiate.
  *
  * @return A new sparse-dense set of the given capacity.
  */
  export function uint16(capacity: number): PackSparseDenseSet {
    return new PackSparseDenseSet(Pack.uint16(capacity))
  }

  /**
  * Instantiate a uint8 sparse-dense set.
  *
  * @param capacity - Capacity of the sparse-dense set to instantiate.
  *
  * @return A new sparse-dense set of the given capacity.
  */
  export function uint8(capacity: number): PackSparseDenseSet {
    return new PackSparseDenseSet(Pack.uint8(capacity))
  }

  /**
  * Instantiate an array sparse-dense set.
  *
  * @param capacity - Capacity of the sparse-dense set to instantiate.
  *
  * @return A new sparse-dense set of the given capacity.
  */
  export function any(capacity: number): PackSparseDenseSet {
    return new PackSparseDenseSet(Pack.any(capacity))
  }

  /**
  * Instantiate a sparse-dense set that can store numbers up to the given value.
  *
  * @param capacity - Maximum number to be able to store into the resulting sparse-dense set.
  *
  * @return A new sparse-dense set that can store numbers up to the given value.
  */
  export function upTo(capacity: number): PackSparseDenseSet {
    if (capacity <= 0xff) {
      return new PackSparseDenseSet(Pack.uint8(capacity))
    } else if (capacity <= 0xffff) {
      return new PackSparseDenseSet(Pack.uint16(capacity))
    } else {
      return new PackSparseDenseSet(Pack.uint32(capacity))
    }
  }
}
