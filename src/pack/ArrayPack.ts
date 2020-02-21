import { Comparator } from '@library/Comparator'

import { equals } from '@library/algorithm/equals'
import { quicksort } from '@library/algorithm/quicksort'

import { PackIterator } from '@library/pack/PackIterator'
import { Pack } from '@library/pack/Pack'
import { Sequence } from '@library/Sequence'

import { SequenceView } from '@library/view/SequenceView'

/**
* A javascript array.
*
* @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
*/
export class ArrayPack<Element> implements Pack<Element> {
  /**
  * Wrapped javascript array.
  */
  private _elements : Array<Element>

  /**
  * Number of elements stored.
  */
  private _size : number

  /**
  * Wrap the given array as a pack.
  *
  * @param elements - A javascript array to wrap.
  * @param [size = elements.length] - Initial number of elements in the array to wrap.
  */
  public constructor (elements : Element[], size : number = elements.length) {
    this._elements = elements
    this._size = size
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._size
  }

  /**
  * @see MutableSequence.size
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
  * @see Sequence.get
  */
  public get (index : number) : Element {
    return this._elements[index]
  }

  /**
  * @see MutableSequence.pop
  */
  public pop () : Element {
    const last : number = this._size - 1
    const value : Element = this._elements[last]
    this.delete(last)
    return value
  }

  /**
  * @see Sequence.last
  */
  public get last () : Element {
    return this._elements[this._size - 1]
  }

  /**
  * @see Sequence.lastIndex
  */
  public get lastIndex () : number {
    return Math.max(this._size - 1, 0)
  }

  /**
  * @see Sequence.first
  */
  public get first () : Element {
    return this._elements[0]
  }

  /**
  * @see Sequence.firstIndex
  */
  public get firstIndex () : number {
    return 0
  }

  /**
  * @see MutableSequence.fill
  */
  public fill (element : Element) : void {
    for (let index = 0, size = this._size; index < size; ++index) {
      this._elements[index] = element
    }
  }

  /**
  * @see MutableSequence.shift
  */
  public shift () : Element {
    const value : Element = this._elements[0]
    this.delete(0)
    return value
  }

  /**
  * @see Pack.sort
  */
  public sort (comparator : Comparator<Element, Element>) : void {
    quicksort(this, comparator, 0, this._size)
  }

  /**
  * @see Pack.subsort
  */
  public subsort (offset : number, size : number, comparator : Comparator<Element, Element>) : void {
    quicksort(this, comparator, offset, size)
  }

  /**
  * @see MutableSequence.swap
  */
  public swap (first : number, second : number) : void {
    const tmp : Element = this._elements[first]
    this._elements[first] = this._elements[second]
    this._elements[second] = tmp
  }

  /**
  * @see MutableSequence.set
  */
  public set (index : number, value : Element) : void {
    if (index >= this._size) this.size = index + 1
    this._elements[index] = value
  }

  /**
  * @see MutableSequence.insert
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
  * @see MutableSequence.push
  */
  public push (value : Element) : void {
    const index : number = this._size

    this.size += 1
    this._elements[index] = value
  }

  /**
  * @see MutableSequence.unshift
  */
  public unshift (value : Element) : void {
    this.size += 1

    for (let index = this._size - 1; index > 0; --index) {
      this._elements[index] = this._elements[index - 1]
    }

    this._elements[0] = value
  }

  /**
  * @see MutableSequence.delete
  */
  public delete (index : number) : void {
    for (let cursor = index, size = this._size - 1; cursor < size; ++cursor) {
      this._elements[cursor] = this._elements[cursor + 1]
    }

    this.size -= 1
  }

  /**
  * @see MutableSequence.warp
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
  * @see Sequence.indexOf
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
  * @see Pack.copy
  */
  public copy (toCopy : Sequence<Element>) : void {
    this.size = toCopy.size

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      this.set(index, toCopy.get(index))
    }
  }

  /**
  * @see Pack.allocate
  */
  public allocate (capacity : number) : ArrayPack<Element> {
    return ArrayPack.allocate(capacity)
  }

  /**
  * @see Pack.clone
  */
  public clone () : ArrayPack<Element> {
    return ArrayPack.copy(this)
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
  public iterator () : PackIterator<Element> {
    const result : PackIterator<Element> = new PackIterator()

    result.pack = this
    result.index = 0

    return result
  }

  /**
  * @see MutableSequence.clear
  */
  public clear () : void {
    this._size = 0
  }

  /**
  * @see Sequence.iterator
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

    if (other instanceof ArrayPack) {
      if (other.size !== this._size) return false

      for (let index = 0, size = this._size; index < size; ++index) {
        if (!equals(other.get(index), this._elements[index])) return false
      }

      return true
    }

    return false
  }
}

export namespace ArrayPack {
  /**
  * Initial value of each new cell of a pack.
  */
  export const DEFAULT_VALUE : any = null

  /**
  * Return an empty array pack of the given capacity.
  *
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return An empty array pack of the given capacity.
  */
  export function allocate <Element> (capacity : number) : ArrayPack<Element> {
    const result : Element[] = []

    /**
    * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
    */
    while (result.length != capacity) {
      result.push(DEFAULT_VALUE)
    }

    return new ArrayPack<Element>(result, 0)
  }

  /**
  * Wrap an existing array as a pack.
  *
  * @param elements - Array to wrap.
  *
  * @return The given array wrapped as a pack.
  */
  export function wrap <Element> (elements : Element[]) : ArrayPack<Element> {
    return new ArrayPack<Element>(elements)
  }

  /**
  * Return a shallow copy of another pack as an array pack.
  *
  * @param toCopy - A pack to copy.
  *
  * @return An array pack that is a shallow copy of the given pack.
  */
  export function copy <Element> (toCopy : Pack<Element>) : ArrayPack<Element> {
    const result : ArrayPack<Element> = allocate(toCopy.capacity)

    result.copy(toCopy)

    return result
  }
}
