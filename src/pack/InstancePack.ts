import { Allocator } from '../Allocator'

import { Comparator } from '../Comparator'
import { Sequence } from '../Sequence'

import { SequenceView } from '../view/SequenceView'

import { PackIterator } from './PackIterator'
import { Pack } from './Pack'

/**
* A javascript array of pre-allocated instances.
*
* @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
*/
export class InstancePack<Element> implements Pack<Element> {
  /**
  * Instance pool.
  */
  private _pool : Pack<Element>

  /**
  * Wrapped javascript array.
  */
  private _elements : Pack<Element>

  public readonly allocator : Allocator<Element>

  /**
  * Makes an empty instance pack of the given capacity.
  *
  * @param allocator - An allocator that allows to manipulate the given instance type.
  * @param [capacity = 32] - Initial capacity of the pack to instantiate.
  */
  public constructor (allocator : Allocator<Element>, capacity : number = 32) {
    this.allocator = allocator
    this._pool = Pack.any(capacity)
    this._elements = Pack.any(capacity)

    while (this._pool.size < this._pool.capacity) {
      this._pool.push(this.allocator.allocate())
    }
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._elements.size
  }

  /**
  * @see MutableSequence.size
  */
  public set size (value : number) {
    if (value > this._pool.capacity) {
      this.reallocate(value)
    }

    /**
    * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
    */
    while (this._elements.size < value) {
      this._elements.push(this._pool.pop())
    }

    while (this._elements.size > value) {
      this._pool.push(this._elements.pop())
    }
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity () : number {
    return this._elements.capacity
  }

  /**
  * @see ReallocableCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    const oldCapacity : number = this._elements.capacity

    this._elements.reallocate(capacity)
    this._pool.reallocate(capacity)

    for (let index = oldCapacity; index < capacity; ++index) {
      this._pool.push(this.allocator.allocate())
    }

    this._pool.size = capacity - this._elements.size
  }

  /**
  * @see ReallocableCollection.fit
  */
  public fit () : void {
    this.reallocate(this._elements.size)
  }

  /**
  * @see Sequence.get
  */
  public get (index : number) : Element {
    return this._elements.get(index)
  }

  /**
  * @see MutableSequence.pop
  */
  public pop (output : Element = this.allocator.allocate()) : Element {
    this.allocator.copy(this._elements.last, output)
    this._pool.push(this._elements.pop())
    this.allocator.clear(this._pool.last)

    return output
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
  * @see Sequence.first
  */
  public get first () : Element {
    return this._elements.first
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
    for (let index = 0, size = this._elements.size; index < size; ++index) {
      this.allocator.copy(element, this._elements.get(index))
    }
  }

  /**
  * @see MutableSequence.shift
  */
  public shift (output : Element = this.allocator.allocate()) : Element {
    this.allocator.copy(this._elements.first, output)
    this._pool.push(this._elements.shift())
    this.allocator.clear(this._pool.last)

    return output
  }

  /**
  * @see Pack.sort
  */
  public sort (comparator : Comparator<Element, Element>) : void {
    this._elements.sort(comparator)
  }

  /**
  * @see Pack.subsort
  */
  public subsort (offset : number, size : number, comparator : Comparator<Element, Element>) : void {
    this._elements.subsort(offset, size, comparator)
  }

  /**
  * @see MutableSequence.swap
  */
  public swap (first : number, second : number) : void {
    this._elements.swap(first, second)
  }

  /**
  * @see MutableSequence.set
  */
  public set (index : number, value : Element) : void {
    if (index >= this._elements.size) {
      this.size = index + 1
    }

    this.allocator.copy(value, this._elements.get(index))
  }

  /**
  * @see MutableSequence.insert
  */
  public insert (index : number, value : Element) : void {
    if (index >= this._elements.size) {
      this.set(index, value)
    } else {
      if (this._elements.size === this._elements.capacity) {
        this.reallocate(this.capacity * 2)
      }

      this._elements.insert(index, this._pool.pop())
      this.allocator.copy(value, this._elements.get(index))
    }
  }

  /**
  * @see MutableSequence.push
  */
  public push (value : Element) : void {
    if (this._elements.size === this._elements.capacity) {
      this.reallocate(this.capacity * 2)
    }

    this._elements.push(this._pool.pop())
    this.allocator.copy(value, this._elements.last)
  }

  /**
  * @see MutableSequence.unshift
  */
  public unshift (value : Element) : void {
    if (this._elements.size === this._elements.capacity) {
      this.reallocate(this.capacity * 2)
    }

    this._elements.unshift(this._pool.pop())
    this.allocator.copy(value, this._elements.first)
  }

  /**
  * @see MutableSequence.delete
  */
  public delete (index : number) : void {
    const element : Element = this._elements.get(index)
    this._pool.push(element)
    this.allocator.clear(element)

    this._elements.delete(index)
  }

  /**
  * @see MutableSequence.deleteMany
  */
  public deleteMany (from : number, size : number) : void {
    for (let index = 0; index < size; ++index) {
      const element : Element = this._elements.get(from + index)
      this._pool.push(element)
      this.allocator.clear(element)
    }

    this._elements.deleteMany(from, size)
  }

  /**
  * @see MutableSequence.warp
  */
  public warp (index : number) : void {
    const element : Element = this._elements.get(index)
    this._pool.push(element)
    this.allocator.clear(element)

    this._elements.warp(index)
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
    return this._elements.indexOf(element)
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
  * @see Sequence.concat
  */
  public concat (toConcat : Sequence<Element>) : void {
    const firstIndex : number = toConcat.firstIndex
    const lastIndex : number = toConcat.lastIndex + 1

    if (this.capacity < this.size + toConcat.size) {
      this.reallocate(this.size + toConcat.size)
    }

    for (let index = firstIndex; index < lastIndex; ++index) {
      this.push(toConcat.get(index))
    }
  }

  /**
  * @see Pack.allocate
  */
  public allocate (capacity : number) : InstancePack<Element> {
    return new InstancePack(this.allocator, capacity)
  }

  /**
  * @see Pack.clone
  */
  public clone () : InstancePack<Element> {
    return InstancePack.copy(this)
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
    while (this._elements.size > 0) {
      const element : Element = this._elements.pop()
      this._pool.push(element)
      this.allocator.clear(element)
    }
  }

  /**
  * @see Sequence.iterator
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

    if (other instanceof InstancePack) {
      return this.allocator === other.allocator &&
             this._elements.equals(other._elements)
    }

    return false
  }
}

export namespace InstancePack {
  /**
  * Return an empty array pack of the given capacity.
  *
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return An empty array pack of the given capacity.
  */
  export function allocate <Element> (allocator : Allocator<Element>, capacity : number) : InstancePack<Element> {
    return new InstancePack<Element>(allocator, capacity)
  }

  /**
  * Return a copy of another instance pack as an instance pack.
  *
  * @param toCopy - A pack to copy.
  *
  * @return An array pack that is a shallow copy of the given pack.
  */
  export function copy <Element> (toCopy : InstancePack<Element>) : InstancePack<Element> {
    const result : InstancePack<Element> = toCopy.allocate(toCopy.capacity)

    result.copy(toCopy)

    return result
  }
}
