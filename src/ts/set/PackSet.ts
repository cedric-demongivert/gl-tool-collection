import { StaticCollection } from '../StaticCollection'
import { equals } from '../equals'
import { Pack } from '../pack/Pack'
import { Packs } from '../pack/Packs'

import { Set } from './Set'
import { ReallocableSet } from './ReallocableSet'

export class PackSet<T> implements ReallocableSet<T> {
  /**
  * Return a copy of a given pack set.
  *
  * @param toCopy - A pack set to copy.
  */
  static copy <T> (toCopy : PackSet<T>) : PackSet<T> {
    return new PackSet<T>(Packs.copy(toCopy.elements))
  }

  private _elements: Pack<T>

  /**
  * Create a new set collection based upon a pack instance.
  *
  * @param pack - An empty pack instance to wrap as a set.
  */
  public constructor (elements : Pack<T>) {
    this._elements = elements
  }

  /**
  * @return This set underlying pack instance.
  */
  public get elements () : Pack<T> {
    return this._elements
  }

  /**
  * Change the wrapped pack instance.
  *
  * @param elements - The new pack instance to wrap.
  */
  public set elements (elements : Pack<T>) {
    this._elements = elements
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
    return this._elements.size
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity () : number {
    return this._elements.capacity
  }

  /**
  * @see Collection.has
  */
  public has (element : T) : boolean {
    return this._elements.has(element)
  }

  /**
  * @see Collection.indexOf
  */
  public indexOf (element : T) : number {
    return this._elements.indexOf(element)
  }

  /**
  * @see Set.add
  */
  public add (element : T) : void {
    if (this._elements.indexOf(element) === -1) {
      this._elements.push(element)
    }
  }

  /**
  * @see Set.delete
  */
  public delete (element : T) : void {
    const index : number = this._elements.indexOf(element)

    if (index >= 0) {
      this._elements.warp(index)
    }
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : T {
    return this._elements.get(index)
  }

  /**
  * @see ReallocableCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    this._elements.reallocate(capacity)
  }

  /**
  * @see ReallocableCollection.fit
  */
  public fit () : void {
    this._elements.fit()
  }

  /**
  * @see Set.clear
  */
  public clear () : void {
    this._elements.clear()
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<T> {
    yield * this._elements
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other.isSet) {
      if (other.size !== this._elements.size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index))) return false
      }

      return true
    }

    return false
  }
}
