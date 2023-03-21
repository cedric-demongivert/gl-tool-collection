import { Comparator, Empty } from '@cedric-demongivert/gl-tool-utils'

import { ForwardCursor } from '../cursor/ForwardCursor'

import { Pack } from '../pack/Pack'
import { createArrayPack } from '../pack/ArrayPack'
import { createUint16Pack, createUint32Pack, createUint8Pack, createUintPackUpTo } from '../pack/BufferPack'

import { Group } from '../group/Group'
import { OrderedGroup } from '../group/OrderedGroup'
import { createOrderedGroupView } from '../group/OrderedGroupView'

import { join } from '../algorithm/join'

import { SparseDenseSet } from './SparseDenseSet'
import { IllegalArgumentsError } from '../error/IllegalArgumentsError'
import { IllegalSubsequenceError } from '../sequence/error/IllegalSubsequenceError'

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
  private _allocator: Pack.Allocator<number>

  /**
   * Create a new empty sparse set based uppon the given pack.
   *
   * @param dense - An empty dense number pack.
   */
  public constructor(allocator: Pack.Allocator<number>, capacity: number) {
    this._sparse = allocator(capacity)
    this._dense = allocator(capacity)
    this._allocator = allocator

    this._sparse.size = capacity
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
   * @see {@link OrderedSet.has}
   */
  public has(element: number, startOrEnd: number = 0, endOrStart: number = this.size): boolean {
    return this.indexOf(element, startOrEnd, endOrStart) > -1
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: number, startOrEnd: number = 0, endOrStart: number = this.size): number {
    const size = this.size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }
    
    const index: number = this._sparse.get(element)

    if (index < end && index >= start && this._dense.get(index) === element) {
      return index
    }

    return -1
  }

  /**
   * 
   */
  public search<Key>(key: Key, comparator: Comparator<Key, number>, startOrEnd: number = 0, endOrStart: number = this.size): number {
    return this._dense.search(key, comparator, startOrEnd, endOrStart)
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
      max = value < max ? max : value
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
    const copy: PackSparseDenseSet = new PackSparseDenseSet(this._allocator, this.capacity)

    copy._dense.copy(this._dense)
    copy._sparse.copy(this._sparse)

    return copy
  }

  /**
   * @see {@link ReallocableCollection.reallocate}
   */
  public reallocate(capacity: number): void {
    const oldDense = this._dense
    const newDense = this._dense.allocate(capacity)
    const newSparse = this._sparse.allocate(capacity)

    this._dense = newDense
    this._sparse = newSparse

    newSparse.size = capacity

    for (let index = 0, size = oldDense.size; index < size; ++index) {
      if (oldDense.get(index)! < capacity) {
        newSparse.set(oldDense.get(index), newDense.size)
        newDense.push(oldDense.get(index))
      }
    }
  }

  /**
   * @see {@link ReallocableCollection.fit}
   */
  public fit(): void {
    const nextCapacity = this.max() + 1
    
    this._dense.reallocate(nextCapacity)
    this._sparse.reallocate(nextCapacity)
    this._sparse.size = nextCapacity
  }

  /**
   * Return the maximum element of this set.
   *
   * @returns The maximum element of this set.
   */
  public max(): number {
    if (this._dense.size <= 0) return 0

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
   * @returns The minimum element of this set.
   */
  public min(): number {
    if (this._dense.size <= 0) return 0

    let result: number = this._dense.get(0)

    for (let index = 1, length = this._dense.size; index < length; ++index) {
      const cell = this._dense.get(index)
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
    return createOrderedGroupView(this)
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
    return '{' + join(this) + '}' 
  }

  /**
   * @see {@link Object.toString}
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._dense.constructor.name + ') ' + this.stringify()
  }
}

/**
 * Instantiate a uint32 sparse-dense set.
 *
 * @param capacity - Capacity of the sparse-dense set to instantiate.
 *
 * @returns A new sparse-dense set of the given capacity.
 */
export function createUint32PackSparseDenseSet(capacity: number): PackSparseDenseSet {
  return new PackSparseDenseSet(createUint32Pack, capacity)
}

/**
 * Instantiate a uint16 sparse-dense set.
 *
 * @param capacity - Capacity of the sparse-dense set to instantiate.
 *
 * @returns A new sparse-dense set of the given capacity.
 */
export function createUint16PackSparseDenseSet(capacity: number): PackSparseDenseSet {
  return new PackSparseDenseSet(createUint16Pack, capacity)
}

/**
 * Instantiate a uint8 sparse-dense set.
 *
 * @param capacity - Capacity of the sparse-dense set to instantiate.
 *
 * @returns A new sparse-dense set of the given capacity.
 */
export function createUint8PackSparseDenseSet(capacity: number): PackSparseDenseSet {
  return new PackSparseDenseSet(createUint8Pack, capacity)
}

function createAnyNumberPack(capacity: number): Pack<number> {
  return createArrayPack(Empty.number, capacity)
}

/**
 * Instantiate an array sparse-dense set.
 *
 * @param capacity - Capacity of the sparse-dense set to instantiate.
 *
 * @returns A new sparse-dense set of the given capacity.
 */
export function createAnyPackSparseDenseSet(capacity: number): PackSparseDenseSet {
  return new PackSparseDenseSet(createAnyNumberPack, capacity)
}

function createPackUpTo(capacity: number): Pack<number> {
  return createUintPackUpTo(capacity, capacity)
}

/**
 * Instantiate a sparse-dense set that can store numbers up to the given value.
 *
 * @param capacity - Maximum number to be able to store into the resulting sparse-dense set.
 *
 * @returns A new sparse-dense set that can store numbers up to the given value.
 */
export function createPackSparseDenseSetUpTo(capacity: number): PackSparseDenseSet {
  return new PackSparseDenseSet(createPackUpTo, capacity)
}
