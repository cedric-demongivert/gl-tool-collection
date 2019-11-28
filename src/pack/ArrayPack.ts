import { equals } from '../equals'
import { quicksort } from '../quicksort'
import { Comparator } from '../Comparator'
import { START, END } from '../iterator/symbols'
import { RandomAccessIterator } from '../iterator/RandomAccessIterator'

import { Pack } from './Pack'

export class ArrayPack<Element> implements Pack<Element> {
  static DEFAULT_VALUE : any = null

  /**
  * Return a copy of another pack.
  *
  * @param toCopy - A pack to copy.
  */
  static copy <Element> (toCopy : Pack<Element>) : ArrayPack<Element> {
    const result : ArrayPack<Element> = new ArrayPack<Element>(toCopy.capacity)

    result.size = toCopy.size

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      result.set(index, toCopy.get(index))
    }

    return result
  }

  private _elements : Array<Element>
  private _size : number

  /**
  * Instanciate a new pack with the given capacity based uppon a javascript array.
  *
  * @param [capacity=16] - Elementhe number of elements to preallocate.
  */
  public constructor (capacity : number = 16) {
    this._elements = []

    /**
    * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
    */
    for (let index = 0; index < capacity; ++index) {
      this._elements.push(null)
    }

    this._size = 0
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
  * @see Collection.size
  */
  public get size () : number {
    return this._size
  }

  /**
  * @see Pack.size
  */
  public set size (value : number) {
    /**
    * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
    */
    while (value > this._elements.length) {
      this._elements.push(null)
    }

    for (let index = this._size; index < value; ++index) {
      this._elements[index] = null
    }

    this._size = value
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity () : number {
    return this._elements.length
  }

  /**
  * @see ReallocableCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    if (capacity < this._elements.length) {
      this._elements.length = capacity
      this._size = Math.min(this._size, capacity)
    } else {
      /**
      * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
      */
      while (this._elements.length != capacity) {
        this._elements.push(null)
      }
    }
  }

  /**
  * @see ReallocableCollection.fit
  */
  public fit () : void {
    this._elements.length = this._size
  }

  /**
  * @see Collection.isCollection
  */
  public get isCollection () : boolean {
    return true
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : Element {
    return this._elements[index]
  }

  /**
  * @see Pack.pop
  */
  public pop () : Element {
    const last : number = this._size - 1
    const value : Element = this._elements[last]
    this.delete(last)
    return value
  }

  /**
  * @see Collection.last
  */
  public last () : Element {
    return this._elements[this._size - 1]
  }

  /**
  * @see Pack.fill
  */
  public fill (element : Element) : void {
    for (let index = 0, size = this._size; index < size; ++index) {
      this._elements[index] = element
    }
  }

  /**
  * @see Pack.shift
  */
  public shift () : Element {
    const value : Element = this._elements[0]
    this.delete(0)
    return value
  }

  /**
  * @see Collection.first
  */
  public first () : Element {
    return this._elements[0]
  }

  /**
  * @see Pack.sort
  */
  public sort (comparator : Comparator<Element, Element>) : void {
    quicksort(this, comparator, 0, this._size)
  }

  /**
  * @see Pack.subSort
  */
  public subSort (
    offset : number,
    size : number,
    comparator : Comparator<Element, Element>
  ) : void {
    quicksort(this, comparator, offset, size)
  }

  /**
  * @see Pack.swap
  */
  public swap (first : number, second : number) : void {
    const tmp : Element = this._elements[first]
    this._elements[first] = this._elements[second]
    this._elements[second] = tmp
  }

  /**
  * @see Pack.set
  */
  public set (index : number, value : Element) : void {
    if (index >= this._size) this.size = index + 1
    this._elements[index] = value
  }

  /**
  * @see Pack.insert
  */
  public insert (index : number, value : Element) : void {
    if (index >= this._size) {
      this.set(index, value)
    } else {
      this.size += 1

      for (let cursor = this._size - 1; cursor > index; --cursor) {
        this._elements[cursor] = this._elements[cursor - 1]
      }

      this._elements[index] = value
    }
  }

  /**
  * @see Pack.push
  */
  public push (value : Element) : void {
    const index : number = this._size

    this.size += 1
    this._elements[index] = value
  }

  /**
  * @see Pack.delete
  */
  public delete (index : number) : void {
    for (let cursor = index, size = this._size - 1; cursor < size; ++cursor) {
      this._elements[cursor] = this._elements[cursor + 1]
    }

    this.size -= 1
  }

  /**
  * @see Pack.warp
  */
  public warp (index : number) : void {
    this._elements[index] = this._elements[this._size - 1]
    this.size -= 1
  }

  /**
  * @see Collection.has
  */
  public has (element : Element) : boolean {
    return this.indexOf(element) >= 0
  }

  /**
  * @see Collection.indexOf
  */
  public indexOf (element : Element) : number {
    for (let index = 0, length = this._size; index < length; ++index) {
      if (equals(element, this._elements[index])) {
        return index
      }
    }

    return -1;
  }

  /**
  * @see Pack.allocate
  */
  public allocate (capacity : number) : ArrayPack<Element> {
    return new ArrayPack(capacity)
  }

  /**
  * @see Pack.start
  */
  public start () : Symbol {
    return START
  }

  /**
  * @see Pack.start
  */
  public end () : Symbol {
    return END
  }

  /**
  * @see Collection.iterator
  */
  public iterator () : RandomAccessIterator<Element> {
    const result : RandomAccessIterator<Element> = new RandomAccessIterator()
    result.reset(this)
    return result
  }

  /**
  * @see Pack.clear
  */
  public clear () : void {
    this._size = 0
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<Element> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._elements[index]
    }
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other.isCollection) {
      if (other.size !== this._size) return false

      for (let index = 0, size = this._size; index < size; ++index) {
        if (!equals(other.get(index), this._elements[index])) return false
      }

      return true
    }

    return false
  }
}
