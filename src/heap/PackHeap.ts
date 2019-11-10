import { RandomlyAccessibleCollection } from '../RandomlyAccessibleCollection'
import { Pack } from '../pack/Pack'
import { Packs } from '../pack/Packs'
import { Comparator } from '../Comparator'
import { ReallocableHeap } from './ReallocableHeap'

/**
* A heap based uppon a pack collection.
*/
export class PackHeap<Element>
  implements ReallocableHeap<Element>,
             RandomlyAccessibleCollection<Element>
{
  /**
  * Copy an existing heap instance.
  *
  * @param toCopy - An heap instance to copy.
  *
  * @return A copy of the given heap instance.
  */
  public static copy <Element> (
    toCopy : PackHeap<Element>
  ) : PackHeap<Element> {
    return new PackHeap<Element>(
      Packs.copy(toCopy._elements),
      toCopy._comparator
    )
  }

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
    return false
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
    return true
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
  * @see Collection#get
  */
  public get (index : number) : Element {
    return this._elements.get(index)
  }

  /**
  * @see Collection#indexOf
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
  * @see Collection#get isCollection
  */
  public get isCollection () : boolean {
    return true
  }

  /**
  * @see Heap#get isHeap
  */
  public get isHeap () : boolean {
    return true
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
