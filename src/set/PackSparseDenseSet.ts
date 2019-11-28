import { Pack } from '../pack/Pack'
import { Packs } from '../pack/Packs'
import { RandomAccessIterator } from '../iterator/RandomAccessIterator'
import { SparseDenseSet } from './SparseDenseSet'
import { ReallocableSet } from './ReallocableSet'

export class PackSparseDenseSet
  implements SparseDenseSet,
             ReallocableSet<number>
{
  /**
  * Return a copy of a given sparse set.
  *
  * @param toCopy - A sparse set to copy.
  */
  static copy (toCopy : PackSparseDenseSet) : PackSparseDenseSet {
    const copy = new PackSparseDenseSet(
      Packs.like(toCopy._dense, toCopy.capacity)
    )

    for (let index = 0, size = toCopy.size; index < size; ++index) {
      copy.add(toCopy.get(index))
    }

    return copy
  }

  private _sparse: Pack<number>
  private _dense: Pack<number>

  /**
  * Create a new empty sparse set based uppon the given pack.
  *
  * @param dense - An empty dense number pack.
  */
  public constructor (dense : Pack<number>) {
    this._sparse = Packs.like(dense, dense.capacity)
    this._dense = dense
  }

  /**
  * @see Collection.isRandomlyAccessible
  */
  public get isRandomlyAccessible () : boolean {
    return true
  }

  /**
  * @see Collection.isSequentiallyAccessible
  */
  public get isSequentiallyAccessible () : boolean {
    return false
  }

  /**
  * @see Collection.isSet
  */
  public get isSet () : boolean {
    return true
  }

  /**
  * @see Collection.isStatic
  */
  public get isStatic () : boolean {
    return true
  }

  /**
  * @see Collection.isReallocable
  */
  public get isReallocable () : boolean {
    return true
  }

  /**
  * @see Collection.isSequence
  */
  public get isSequence () : boolean {
    return false
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._dense.size
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity () : number {
    return this._dense.capacity
  }

  /**
  * @see Collection.has
  */
  public has (element : number) : boolean {
    const index : number = this._sparse.get(element)
    return index < this._dense.size && this._dense.get(index) === element
  }

  /**
  * @see Collection.indexOf
  */
  public indexOf (element : number) : number {
    const index : number = this._sparse.get(element)

    if (index < this._dense.size && this._dense.get(index) === element) {
      return index
    }

    return -1
  }

  /**
  * @see MutableCollection.add
  */
  public add (element : number) : void {
    const index : number = this._sparse.get(element)

    if (index >= this._dense.size || this._dense.get(index) !== element) {
      this._sparse.set(element, this._dense.size)
      this._dense.push(element)
    }
  }

  /**
  * @see MutableCollection.delete
  */
  public delete (element : number) : void {
    const index : number = this._sparse.get(element)

    if (index < this._dense.size && this._dense.get(index) === element) {
      const last : number = this._dense.get(this._dense.size - 1)
      this._dense.warp(index)
      this._sparse.set(last, index)
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
    if (this._dense.size <= 0) return undefined

    let result : number = this._dense.get(0)

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
  public min () : number {
    if (this._dense.size <= 0) return undefined

    let result : number = this._dense.get(0)

    for (let index = 1, length = this._dense.size; index < length; ++index) {
      const cell = this._dense.get(index)
      result = cell < result ? cell : result
    }

    return result
  }

  /**
  * @see MutableCollection.clear
  */
  public clear () : void {
    this._dense.clear()
  }

  /**
  * @see Collection.first
  */
  public first () : number {
    return this._dense.first()
  }

  /**
  * @see Collection.last
  */
  public last () : number {
    return this._dense.last()
  }

  /**
  * @see Collection.iterator
  */
  public iterator () : RandomAccessIterator<number> {
    return this._dense.iterator()
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<number> {
    for (let index = 0, length = this._dense.size; index < length; ++index) {
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
      if (other.size !== this._dense.size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index))) return false
      }

      return true
    }

    return false
  }
}
