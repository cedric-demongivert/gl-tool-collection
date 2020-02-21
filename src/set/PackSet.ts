import { ReallocableCollection } from '@library/ReallocableCollection'
import { MutableSet } from '@library/set/MutableSet'
import { Set } from '@library/set/Set'
import { Sequence } from '@library/Sequence'
import { BidirectionalIterator } from '@library/iterator/BidirectionalIterator'
import { Pack } from '@library/pack/Pack'
import { SequenceView } from '@library/view/SequenceView'

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
}
