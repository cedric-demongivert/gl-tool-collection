import { Pack } from '../pack/Pack'
import { Packs } from '../pack/Packs'

import { Comparator } from '../Comparator'

import { ReallocableHeap } from './ReallocableHeap'

/**
* A heap based uppon a pack collection.
*/
export class PackHeap<Value> implements ReallocableHeap<Value>{
  /**
  * Copy an existing heap instance.
  *
  * @param toCopy - An heap instance to copy.
  *
  * @return A copy of the given heap instance.
  */
  public static copy <Value> (toCopy : PackHeap<Value>) : PackHeap<Value> {
    return new PackHeap<Value>(
      Packs.copy(toCopy._elements),
      toCopy._comparator
    )
  }

  private _elements : Pack<Value>
  private _comparator : Comparator<Value, Value>

  /**
  * Instantiate a new empty heap.
  *
  * @param elements - Pack to use for storing the heap.
  * @param comparator - A comparator to use for sorting the heap.
  */
  public constructor (
    elements : Pack<Value>,
    comparator : Comparator<Value, Value>
  ) {
    this._comparator = comparator
    this._elements = elements
  }

  /**
  * @see Heap#next
  */
  public next () : Value {
    const result : Value = this._elements.get(0)
    this.delete(0)
    return result
  }

  /**
  * @see Heap#add
  */
  public push (value : Value) : void {
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
  public get (index : number) : Value {
    return this._elements.get(index)
  }

  /**
  * @see Collection#indexOf
  */
  public indexOf (value : Value) : number {
    return this._elements.indexOf(value)
  }

  /**
  * @see Collection#has
  */
  public has (value : Value) : boolean {
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
  public get comparator () : Comparator<Value, Value> {
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
