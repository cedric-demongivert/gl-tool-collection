import { Packs } from '../pack/Packs'
import { Pack } from '../pack/Pack'

import { SparseDenseSet } from './SparseDenseSet'

export class PackSparseDenseSet implements SparseDenseSet {
  /**
  * Return a copy of a given sparse set.
  *
  * @param toCopy - A sparse set to copy.
  */
  static copy (toCopy : PackSparseDenseSet) : PackSparseDenseSet {
    return new PackSparseDenseSet(
      toCopy._dense, toCopy.capacity
    )
  }

  private _sparse: Pack<number>
  private _dense: Pack<number>
  private _size: number

  /**
  * Create a new empty sparse set with an initial capacity.
  *
  * @param pack - Kind of pack to use for storing this set state.
  * @param capacity - Initial storing capacity of the sparse set.
  */
  public constructor (dense : Pack<number>, capacity : number) {
    this._sparse = Packs.create(dense, capacity)
    this._dense = Packs.create(dense, capacity)

    for (let index = 0, size = dense.size; index < size; ++index) {
      this.add(dense.get(index))
    }

    this._size = 0
  }

  /**
  * @see Collection.isCollection
  */
  public get isCollection () : boolean {
    return true
  }

  /**
  * @see Set.isSet
  */
  public get isSet () : boolean {
    return true
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._size
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity () : number {
    return this._dense.size
  }

  /**
  * @see Collection.has
  */
  public has (element : number) : boolean {
    const index : number = this._sparse.get(element)
    return index < this._size && this._dense.get(index) === element
  }

  /**
  * @see Collection.indexOf
  */
  public indexOf (element : number) : number {
    const index : number = this._sparse.get(element)

    if (index < this._size && this._dense.get(index) === element) {
      return index
    } else {
      return -1
    }
  }

  /**
  * @see MutableCollection.add
  */
  public add (element : number) : void {
    const index : number = this._sparse.get(element)

    if (index >= this._size || this._dense.get(index) !== element) {
      this._sparse.set(element, this._size)
      this._dense.set(this._size, element)
      this._size += 1
    }
  }

  /**
  * @see MutableCollection.delete
  */
  public delete (element : number) : void {
    const index : number = this._sparse.get(element)

    if (index < this._size && this._dense.get(index) === element) {
      const last : number = this._dense.get(this._size - 1)
      this._dense.set(index, last)
      this._sparse.set(last, index)
      this._size -= 1
    }
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : number {
    return this._dense.get(index)
  }

  /**
  * @see StaticCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    const oldDense : Pack<number> = this._dense
    const oldSparse : Pack<number> = this._sparse
    const oldSize : number = this._size

    this._dense = Packs.create(oldDense, capacity)
    this._sparse = Packs.create(oldSparse, capacity)
    this._size = 0

    for (let index = 0; index < oldSize; ++index) {
      if (oldDense.get(index) < capacity) {
        this._sparse.set(oldDense.get(index), this._size)
        this._dense.set(this._size, oldDense.get(index))
        this._size += 1
      }
    }
  }

  /**
  * @see StaticCollection.fit
  */
  public fit () : void {
    const max : number = this.max()
    this._dense.reallocate(max + 1)
    this._sparse.reallocate(max + 1)
  }

  /**
  * Return the maximum element of this set.
  *
  * @return The maximum element of this set.
  */
  public max () : number {
    if (this._size <= 0) return undefined

    let result : number = this._dense.get(0)

    for (let index = 1, length = this._size; index < length; ++index) {
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
  public min () : number {
    if (this._size <= 0) return undefined

    let result : number = this._dense.get(0)

    for (let index = 1, length = this._size; index < length; ++index) {
      const cell = this._dense.get(index)
      result = cell < result ? cell : result
    }

    return result
  }

  /**
  * @see MutableCollection.clear
  */
  public clear () : void {
    this._size = 0
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<number> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._dense.get(index)
    }
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
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
