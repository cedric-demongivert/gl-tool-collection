import { ReallocableCollection } from '../ReallocableCollection'
import { Sequence } from '../Sequence'
import { BidirectionalIterator } from '../iterator/BidirectionalIterator'
import { Pack } from '../pack/Pack'
import { SequenceView } from '../view/SequenceView'

import { MutableSet } from './MutableSet'
import { Set } from './Set'

export class PackSet<Element>
  implements ReallocableCollection, MutableSet<Element>, Sequence<Element>
{
  private _elements: Pack<Element>

  /**
  * Create a new set collection based upon a pack instance.
  *
  * @param pack - An empty pack instance to wrap as a set.
  */
  public constructor (elements : Pack<Element>) {
    this._elements = elements
  }

  /**
  * @return Elementhis set underlying pack instance.
  */
  public get elements () : Pack<Element> {
    return this._elements
  }

  /**
  * Change the wrapped pack instance.
  *
  * @param elements - Elementhe new pack instance to wrap.
  */
  public set elements (elements : Pack<Element>) {
    this._elements = elements
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
  public has (element : Element) : boolean {
    return this._elements.has(element)
  }

  /**
  * @see Sequence.indexOf
  */
  public indexOf (element : Element) : number {
    return this._elements.indexOf(element)
  }

  /**
  * @see Sequence.hasInSubsequence
  */
  public hasInSubsequence (element : Element, offset : number, size : number) : boolean {
    return this._elements.hasInSubsequence(element, offset, size)
  }

  /**
  * @see Sequence.indexOfInSubsequence
  */
  public indexOfInSubsequence (element : Element, offset : number, size : number) : number {
    return this._elements.indexOfInSubsequence(element, offset, size)
  }

  /**
  * @see Set.add
  */
  public add (element : Element) : void {
    if (this._elements.indexOf(element) === -1) {
      this._elements.push(element)
    }
  }

  /**
  * @see Set.delete
  */
  public delete (element : Element) : void {
    const index : number = this._elements.indexOf(element)

    if (index >= 0) {
      this._elements.warp(index)
    }
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : Element {
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
  * @see Set.copy
  */
  public copy (toCopy : Set<Element>) : void {
    this.clear()

    for (const element of toCopy) {
      this.add(element)
    }
  }

  /**
  * @see Collection.clone
  */
  public clone () : PackSet<Element> {
    return new PackSet<Element>(this._elements.clone())
  }

  /**
  * @see Set.clear
  */
  public clear () : void {
    this._elements.clear()
  }

  /**
  * @see Sequence.first
  */
  public get first () : Element {
    return this._elements.first
  }

  /**
  * @see Sequence.firstIndex
  */
  public get firstIndex () : number {
    return this._elements.firstIndex
  }

  /**
  * @see Sequence.last
  */
  public get last () : Element {
    return this._elements.last
  }

  /**
  * @see Sequence.lastIndex
  */
  public get lastIndex () : number {
    return this._elements.lastIndex
  }

  /**
  * @see Collection.view
  */
  public view () : Sequence<Element> {
    return SequenceView.wrap(this)
  }

  /**
  * @see Collection.iterator
  */
  public iterator () : BidirectionalIterator<Element> {
    return this._elements.iterator()
  }

  /**
  * @see Set.iterator
  */
  public * [Symbol.iterator] () : Iterator<Element> {
    yield * this._elements
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof PackSet) {
      if (other.size !== this._elements.size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index))) return false
      }

      return true
    }

    return false
  }
}

export namespace PackSet {
  /**
  * Return a copy of a given pack set.
  *
  * @param toCopy - A pack set to copy.
  */
  export function copy <Element> (toCopy : PackSet<Element>) : PackSet<Element> {
    return new PackSet<Element>(Pack.copy(toCopy.elements))
  }

  /**
  * Instantiate a new set that wrap a pack of the given type of instance.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @return A new set that wrap a pack of the given type of instance.
  */
  export function any <T> (capacity : number) : PackSet<T> {
    return new PackSet<T>(Pack.any(capacity))
  }

  /**
  * Instantiate a new set that wrap a unsigned byte pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @return A new set that wrap a unsigned byte pack of the given capacity.
  */
  export function uint8 (capacity : number) : PackSet<number> {
    return new PackSet<number>(Pack.uint8(capacity))
  }

  /**
  * Instantiate a new set that wrap a unsigned short pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @return A new set that wrap a unsigned short pack of the given capacity.
  */
  export function uint16 (capacity : number) : PackSet<number> {
    return new PackSet<number>(Pack.uint16(capacity))
  }

  /**
  * Instantiate a new set that wrap a unsigned integer pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @return A new set that wrap a unsigned integer pack of the given capacity.
  */
  export function uint32 (capacity : number) : PackSet<number> {
    return new PackSet<number>(Pack.uint32(capacity))
  }

  /**
  * Instantiate a new set that wrap a byte pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @return A new set that wrap a byte pack of the given capacity.
  */
  export function int8 (capacity : number) : PackSet<number> {
    return new PackSet<number>(Pack.int8(capacity))
  }

  /**
  * Instantiate a new set that wrap a short pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @return A new set that wrap a short pack of the given capacity.
  */
  export function int16 (capacity : number) : PackSet<number> {
    return new PackSet<number>(Pack.int16(capacity))
  }

  /**
  * Instantiate a new set that wrap a integer pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @return A new set that wrap a integer pack of the given capacity.
  */
  export function int32 (capacity : number) : PackSet<number> {
    return new PackSet<number>(Pack.int32(capacity))
  }

  /**
  * Instantiate a new set that wrap a float pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @return A new set that wrap a float pack of the given capacity.
  */
  export function float32 (capacity : number) : PackSet<number> {
    return new PackSet<number>(Pack.float32(capacity))
  }

  /**
  * Instantiate a new set that wrap a double pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @return A new set that wrap a double pack of the given capacity.
  */
  export function float64 (capacity : number) : PackSet<number> {
    return new PackSet<number>(Pack.float64(capacity))
  }

  /**
  * Instantiate a new set that wrap a unsigned integer pack that can store
  * values in range [0, maximum] and that is of the given capacity.
  *
  * @param maximum - Maximum value that can be stored.
  * @param capacity - Capacity of the set to allocate.
  *
  * @return A new set that wrap a unsigned integer pack that can store values
  *         in range [0, maximum] and that is of the given capacity.
  */
  export function unsignedUpTo (maximum : number, capacity : number) : PackSet<number> {
    return new PackSet<number>(Pack.unsignedUpTo(maximum, capacity))
  }

  /**
  * Instantiate a new set that wrap a signed integer pack that can store
  * values in range [-maximum, maximum] and that is of the given capacity.
  *
  * @param maximum - Maximum value that can be stored.
  * @param capacity - Capacity of the set to allocate.
  *
  * @return A new set that wrap a signed integer pack that can store values
  *         in range [-maximum, maximum] and that is of the given capacity.
  */
  export function signedUpTo (maximum : number, capacity : number) : PackSet<number> {
    return new PackSet<number>(Pack.signedUpTo(maximum, capacity))
  }
}
