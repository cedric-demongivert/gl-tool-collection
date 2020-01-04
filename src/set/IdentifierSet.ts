import { UintArray } from '../native/UintArray'
import * as UintArrays from '../native/UintArrays'
import { RandomAccessIterator } from '../iterator/RandomAccessIterator'
import { ReallocableSet } from './ReallocableSet'

export class IdentifierSet
  implements ReallocableSet<number>
{
  /**
  * Return a copy of a given sparse set.
  *
  * @param toCopy - A sparse set to copy.
  */
  static copy (toCopy : IdentifierSet) : IdentifierSet {
    const copy = new IdentifierSet(toCopy.capacity)

    for (let index = 0, size = toCopy.size; index < size; ++index) {
      copy.add(toCopy.get(index))
    }

    return copy
  }

  private _sparse : UintArray
  private _dense : UintArray
  private _size : number

  /**
  * Create a new empty identifier set.
  *
  * @param capacity - Number of identifier to allocate.
  */
  public constructor (capacity : number) {
    this._sparse = UintArrays.upTo(capacity - 1, capacity)
    this._dense = UintArrays.upTo(capacity - 1, capacity)
    this._size = 0

    for (let index = 0; index < capacity; ++index) {
      this._sparse[index] = index
      this._dense[index] = index
    }
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
    return this._size
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity () : number {
    return this._dense.length
  }

  /**
  * @see Collection.has
  */
  public has (element : number) : boolean {
    return this._sparse[element] < this._size
  }

  /**
  * @see Collection.indexOf
  */
  public indexOf (element : number) : number {
    const index : number = this._sparse[element]
    return index < this._size ? index : -1
  }

  /**
  * @see MutableCollection.add
  */
  public add (element : number) : void {
    const index : number = this._sparse[element]

    if (index >= this._size) {
      const swap : number = this._dense[this._size]
      this._sparse[swap] = index
      this._sparse[element] = this._size
      this._dense[this._size] = element
      this._dense[index] = swap
      this._size += 1
    }
  }

  public next () : number {
    this._size += 1
    return this._dense[this._size - 1]
  }

  /**
  * @see MutableCollection.delete
  */
  public delete (element : number) : void {
    const index : number = this._sparse[element]

    if (index < this._size) {
      this._size -= 1

      const last : number = this._dense[this._size]

      this._dense[this._size] = element
      this._dense[index] = last
      this._sparse[element] = this._size
      this._sparse[last] = index
    }
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : number {
    return this._dense[index]
  }

  /**
  * @see StaticCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    const oldDense : UintArray = this._dense
    const oldSize : number = this._size

    this._dense = UintArrays.upTo(capacity - 1, capacity)
    this._sparse = UintArrays.upTo(capacity - 1, capacity)
    this._size = 0

    for (let index = 0; index < capacity; ++index) {
      this._dense[index] = index
      this._sparse[index] = index
    }

    for (let index = 0; index < oldSize; ++index) {
      const element : number = oldDense[index]

      if (element < capacity) {
        const swap : number = this._dense[this._size]

        this._sparse[swap] = index
        this._sparse[element] = this._size
        this._dense[this._size] = element
        this._dense[index] = swap
        this._size += 1
      }
    }
  }

  /**
  * @see StaticCollection.fit
  */
  public fit () : void {
    const max : number = this.max()
    this.reallocate(max)
  }

  /**
  * Return the maximum element of this set.
  *
  * @return The maximum element of this set.
  */
  public max () : number {
    if (this._size <= 0) return undefined

    let result : number = this._dense[0]

    for (let index = 1, length = this._size; index < length; ++index) {
      const cell : number = this._dense[index]
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

    let result : number = this._dense[0]

    for (let index = 1, length = this._size; index < length; ++index) {
      const cell : number = this._dense[index]
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
  * @see Collection.first
  */
  public first () : number {
    return this._dense[0]
  }

  /**
  * @see Collection.last
  */
  public last () : number {
    return this._dense[this._size - 1]
  }

  /**
  * @see Collection.iterator
  */
  public iterator () : RandomAccessIterator<number> {
    const iterator : RandomAccessIterator<number> =  new RandomAccessIterator()
    iterator.reset(this)

    return iterator
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<number> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._dense[index]
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
