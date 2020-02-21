import { ReallocableCollection } from '@library/ReallocableCollection'
import { Pack } from '@library/pack/Pack'
import { Comparator } from '@library/Comparator'
import { Heap } from '@library/heap/Heap'
import { BidirectionalIterator } from '@library/iterator/BidirectionalIterator'
import { SequenceView } from '@library/view/SequenceView'
import { Sequence } from '@library/Sequence'

/**
* A heap based uppon a pack collection.
*/
export class PackHeap<Element> implements ReallocableCollection, Heap<Element>, Sequence<Element>
{
  private _elements : Pack<Element>
  private _comparator : Comparator<Element, Element>

  /**
  * Instantiate a new empty heap.
  *
  * @param elements - Pack to use for storing the heap.
  * @param comparator - A comparator to use for sorting the heap.
  */
  public constructor (
    elements : Pack<Element>,
    comparator : Comparator<Element, Element>
  ) {
    this._comparator = comparator
    this._elements = elements
  }

  /**
  * @see Heap#next
  */
  public next () : Element {
    const result : Element = this._elements.get(0)
    this.delete(0)
    return result
  }

  /**
  * @see Heap#add
  */
  public push (value : Element) : void {
    this._elements.push(value)
    this.upliftAsPossible(this._elements.size - 1)
  }

  /**
  * Moves the value at the given index up to the root of the tree while the
  * value violate the order of the heap.
  *
  * @param index - Index of the value to move up.
  *
  * @return The new index of the given value.
  */
  private upliftAsPossible (index : number) : number {
    let cell : number = index
    let parent : number = (cell - 1) >> 1

    while (cell > 0 && this.compare(cell, parent) > 0) {
      this._elements.swap(cell, parent)
      cell = parent
      parent = (cell - 1) >> 1
    }

    return cell
  }

  /**
  * Moves the value at the given index down to the leafs of the tree while the
  * value violate the order of the heap.
  *
  * @param index - Index of the value to move down.
  *
  * @return The new index of the given value.
  */
  private diveAsPossible (index : number) : number {
    const size : number = this._elements.size
    let cell : number = index
    let next : number = (cell << 1) + 1

    while (next < size) {
      if (next + 1 < size && this.compare(cell, next + 1) < 0) {
        if (this.compare(next, next + 1) < 0) {
          this._elements.swap(cell, next + 1)
          cell = next + 1
        } else {
          this._elements.swap(cell, next)
          cell = next
        }
      } else if (this.compare(cell, next) < 0) {
        this._elements.swap(cell, next)
        cell = next
      } else {
        break
      }

      next = (cell << 1) + 1
    }

    return cell
  }

  /**
  * @see Heap#delete
  */
  public delete (index : number) : void {
    const size : number = this._elements.size

    this._elements.warp(index)

    if (index < size) {
      this.diveAsPossible(this.upliftAsPossible(index))
    }
  }

  /**
  * @see Heap#compare
  */
  public compare (left : number, right : number) : number {
    return this._comparator(this._elements.get(left), this._elements.get(right))
  }

  /**
  * @see Sequence#get
  */
  public get (index : number) : Element {
    return this._elements.get(index)
  }

  /**
  * @see Sequence#indexOf
  */
  public indexOf (value : Element) : number {
    return this._elements.indexOf(value)
  }

  /**
  * @see Collection#has
  */
  public has (value : Element) : boolean {
    return this._elements.has(value)
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
  * @see Collection.iterator
  */
  public iterator () : BidirectionalIterator<Element> {
    return this._elements.iterator()
  }

  /**
  * @see Collection#get size
  */
  public get size () : number {
    return this._elements.size
  }

  /**
  * @see Heap#get comparator
  */
  public get comparator () : Comparator<Element, Element> {
    return this._comparator
  }

  /**
  * @see StaticCollection#get capacity
  */
  public get capacity () : number {
    return this._elements.capacity
  }

  /**
  * @see ReallocableCollection#reallocate
  */
  public reallocate (capacity : number) : void {
    this._elements.reallocate(capacity)
  }

  /**
  * @see ReallocableCollection#fit
  */
  public fit () : void {
    this._elements.fit()
  }

  /**
  * @see Heap#clear
  */
  public clear () : void {
    this._elements.clear()
  }

  /**
  * @see Collection#clone
  */
  public clone () : PackHeap<Element> {
    return new PackHeap<Element>(
      Pack.copy(this._elements),
      this._comparator
    )
  }

  /**
  * @see Collection.view
  */
  public view () : Sequence<Element> {
    return SequenceView.wrap(this)
  }

  /**
  * @see Collection#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other.isHeap) {
      if (this.size !== other.size) return false

      for (let index = 0, size = this.size; index < size; ++index) {
        if (this.get(index) !== other.get(index)) {
          return false
        }
      }

      return true
    }

    return false
  }

  /**
  * @see ReallocableCollection#iterator
  */
  public * [Symbol.iterator] () {
    yield * this._elements
  }
}

export namespace PackHeap {
  /**
  * Copy an existing heap instance.
  *
  * @param toCopy - An heap instance to copy.
  *
  * @return A copy of the given heap instance.
  */
  export function copy <Element> (toCopy : PackHeap<Element>) : PackHeap<Element> {
    return toCopy == null ? null : toCopy.clone()
  }
}
