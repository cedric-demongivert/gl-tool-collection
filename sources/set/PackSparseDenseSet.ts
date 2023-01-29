import { Empty } from '@cedric-demongivert/gl-tool-utils'
import { ForwardCursor } from '../cursor'
import { IsCollection } from '../IsCollection'
import { Pack } from '../sequence'

import { Group } from './Group'
import { OrderedGroup } from './OrderedGroup'
import { SparseDenseSet } from './SparseDenseSet'

/**
 * 
 */
export class PackSparseDenseSet implements SparseDenseSet {
  /**
   * 
   */
  private _sparse: Pack<number>

  /**
   * 
   */
  private _dense: Pack<number>

  /**
   * 
   */
  private readonly _view: OrderedGroup<number>

  /**
   * Create a new empty sparse set based uppon the given pack.
   *
   * @param dense - An empty dense number pack.
   */
  public constructor(dense: Pack<number>) {
    this._sparse = dense.clone()
    this._dense = dense
    this._view = OrderedGroup.view(this)
  }

  /**
   * @see {@link Collection[IsCollection.SYMBOL]}
   */
  public [IsCollection.SYMBOL](): true {
    return true
  }

  /**
   * @see {@link Collection.isSequence}
   */
  public isSequence(): true {
    return true
  }

  /**
   * @see {@link Collection.isPack}
   */
  public isPack(): false {
    return false
  }

  /**
   * @see {@link Collection.isList}
   */
  public isList(): false {
    return false
  }

  /**
   * @see {@link Collection.isGroup}
   */
  public isGroup(): true {
    return true
  }

  /**
   * @see {@link Collection.isSet}
   */
  public isSet(): true {
    return true
  }

  /**
   * @see {@link Collection.size}
   */
  public get size(): number {
    return this._dense.size
  }

  /**
   * @see {@link StaticCollection.capacity}
   */
  public get capacity(): number {
    return this._dense.capacity
  }

  /**
   * @see {@link Collection.has}
   */
  public has(element: number): boolean {
    const index: number = this._sparse.get(element)!
    return index < this._dense.size && this._dense.get(index) === element
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: number): number {
    const index: number = this._sparse.get(element)!

    if (index < this._dense.size && this._dense.get(index) === element) {
      return index
    }

    return -1
  }

  /**
   * @see {@link Sequence.hasInSubsequence}
   */
  public hasInSubsequence(element: number, offset: number, size: number): boolean {
    const index: number = this.indexOf(element)
    return index >= offset && index < offset + size
  }

  /**
   * @see {@link Sequence.indexOfInSubsequence}
   */
  public indexOfInSubsequence(element: number, offset: number, size: number): number {
    const index: number = this.indexOf(element)
    return index >= offset && index < offset + size ? index : -1
  }

  /**
   * @see {@link Set.add}
   */
  public add(element: number): void {
    const index: number = this._sparse.get(element)!

    if (index >= this._dense.size || this._dense.get(index) !== element) {
      this._sparse.set(element, this._dense.size)
      this._dense.push(element)
    }
  }

  /**
   * @see {@link Set.delete}
   */
  public delete(element: number): void {
    const index: number = this._sparse.get(element)!

    if (index < this._dense.size && this._dense.get(index) === element) {
      const last: number = this._dense.get(this._dense.size - 1)!
      this._dense.warp(index)
      this._sparse.set(last, index)
    }
  }

  /**
   * @see {@link Sequence.get}
   */
  public get(index: number): number {
    return this._dense.get(index)
  }

  /**
   * @see {@link Set.copy}
   */
  public copy(toCopy: Group<number>): void {
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
   * @see {@link Clonable.clone}
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
   * @see {@link ReallocableCollection.reallocate}
   */
  public reallocate(capacity: number): void {
    const oldDense: Pack<number> = this._dense

    this._dense = this._dense.allocate(capacity)
    this._sparse = this._sparse.allocate(capacity)

    for (let index = 0, size = oldDense.size; index < size; ++index) {
      if (oldDense.get(index)! < capacity) {
        this._sparse.set(oldDense.get(index)!, this._dense.size)
        this._dense.push(oldDense.get(index)!)
      }
    }
  }

  /**
   * @see {@link ReallocableCollection.fit}
   */
  public fit(): void {
    const max: number = this.max()
    this._dense.reallocate(max + 1)
    this._sparse.reallocate(max + 1)
  }

  /**
   * Return the maximum element of this set.
   *
   * @returns The maximum element of this set.
   */
  public max(): number {
    if (this._dense.size <= 0) return 0

    let result: number = this._dense.get(0)!

    for (let index = 1, length = this._dense.size; index < length; ++index) {
      const cell = this._dense.get(index)!
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
    if (this._dense.size <= 0) return 0

    let result: number = this._dense.get(0)!

    for (let index = 1, length = this._dense.size; index < length; ++index) {
      const cell = this._dense.get(index)!
      result = cell < result ? cell : result
    }

    return result
  }

  /**
   * @see {@link Clearable.clear}
   */
  public clear(): void {
    this._dense.clear()
  }

  /**
   * @see {@link Sequence.first}
   */
  public get first(): number {
    return this._dense.first
  }

  /**
   * @see {@link Sequence.last}
   */
  public get last(): number {
    return this._dense.last
  }

  /**
   * @see {@link Collection.view}
   */
  public view(): OrderedGroup<number> {
    return this._view
  }

  /**
   * @see {@link Collection.forward}
   */
  public forward(): ForwardCursor<number> {
    return this._dense.forward()
  }

  /**
   * @see {@link Collection.values}
   */
  public values(): IterableIterator<number> {
    return this._dense.values()
  }

  /**
   * @see {@link Collection[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<number> {
    return this._dense.values()
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof PackSparseDenseSet) {
      if (other.size !== this._dense.size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index)!)) return false
      }

      return true
    }

    return false
  }

  /**
   * @see {@link Object.toString}
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._dense.constructor.name + ') ' + Group.stringify(this)
  }
}

/**
 * 
 */
export namespace PackSparseDenseSet {
  /**
   * Instantiate a uint32 sparse-dense set.
   *
   * @param capacity - Capacity of the sparse-dense set to instantiate.
   *
   * @returns A new sparse-dense set of the given capacity.
   */
  export function uint32(capacity: number): PackSparseDenseSet {
    return new PackSparseDenseSet(Pack.uint32(capacity))
  }

  /**
   * Instantiate a uint16 sparse-dense set.
   *
   * @param capacity - Capacity of the sparse-dense set to instantiate.
   *
   * @returns A new sparse-dense set of the given capacity.
   */
  export function uint16(capacity: number): PackSparseDenseSet {
    return new PackSparseDenseSet(Pack.uint16(capacity))
  }

  /**
   * Instantiate a uint8 sparse-dense set.
   *
   * @param capacity - Capacity of the sparse-dense set to instantiate.
   *
   * @returns A new sparse-dense set of the given capacity.
   */
  export function uint8(capacity: number): PackSparseDenseSet {
    return new PackSparseDenseSet(Pack.uint8(capacity))
  }

  /**
   * Instantiate an array sparse-dense set.
   *
   * @param capacity - Capacity of the sparse-dense set to instantiate.
   *
   * @returns A new sparse-dense set of the given capacity.
   */
  export function any(capacity: number): PackSparseDenseSet {
    return new PackSparseDenseSet(Pack.any(capacity, Empty.number))
  }

  /**
   * Instantiate a sparse-dense set that can store numbers up to the given value.
   *
   * @param capacity - Maximum number to be able to store into the resulting sparse-dense set.
   *
   * @returns A new sparse-dense set that can store numbers up to the given value.
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
