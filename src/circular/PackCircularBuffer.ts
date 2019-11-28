import { equals } from '../equals'
import { RandomlyAccessibleCollection } from '../RandomlyAccessibleCollection'
import { RandomAccessIterator } from '../iterator/RandomAccessIterator'

import { Pack } from '../pack/Pack'
import { Packs } from '../pack/Packs'

import { ReallocableCircularBuffer } from './ReallocableCircularBuffer'

export class PackCircularBuffer<Element>
  implements ReallocableCircularBuffer<Element>,
             RandomlyAccessibleCollection<Element>
{
  private _elements : Pack<Element>
  private _start : number
  private _size : number

  /**
  * Create a new circular buffer uppon an existing pack implementation.
  *
  * @param elements - A pack to use for storing this circular buffer elements.
  */
  public constructor (elements : Pack<Element>) {
    this._elements = elements
    this._start = 0
    this._size = elements.size
    this._elements.size = elements.capacity
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._size
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
  * @see StaticCollection.capacity
  */
  public get capacity () : number {
    return this._elements.capacity
  }

  /**
  * @see ReallocableCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    const next : Pack<Element> = Packs.copy(this._elements)
    next.reallocate(capacity)

    const nextSize : number = Math.min(capacity, this._size)

    for (let index = 0; index < capacity && index < this._size; ++index) {
      next.set(nextSize - index - 1, this.get(this._size - index - 1))
    }

    this._elements = next
    this._size = nextSize
    this._start = 0
  }

  /**
  * @see ReallocableCollection.fit
  */
  public fit () : void {
    this.reallocate(this._size)
  }

  /**
  * @see Collection.isCollection
  */
  public get isCollection () : boolean {
    return true
  }

  /**
  * @see CircularBuffer.isCircularBuffer
  */
  public get isCircularBuffer () : boolean {
    return true
  }

  /**
  * @see Collection.first
  */
  public first () : Element {
    return this._size > 0 ? this._elements.get(this._start) : undefined
  }

  /**
  * @see Collection.last
  */
  public last () : Element {
    return this._size > 0 ? this._elements.get((this._start + this._size) % this._elements.capacity) : undefined
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
  * @see Collection.get
  */
  public get (index : number) : Element {
    return this._elements.get((this._start + index) % this._elements.capacity)
  }

  /**
  * @see CircularBuffer.fill
  */
  public fill (element : Element) : void {
    for (let index = 0, size = this._size; index < size; ++index) {
      this.set(index, element)
    }
  }

  /**
  * @see CircularBuffer.pop
  */
  public pop () : Element {
    const last : number = this._size - 1
    const result : Element = this.get(last)

    this.delete(last)

    return result
  }

  /**
  * @see CircularBuffer.shift
  */
  public shift () : Element {
    const result : Element = this.get(0)

    this.delete(0)

    return result
  }

  /**
  * @see CircularBuffer.swap
  */
  public swap (first : number, second : number) : void {
    const rfirst : number = (this._start + first) % this._elements.capacity
    const rsecond : number = (this._start + second) % this._elements.capacity

    this._elements.swap(rfirst, rsecond)
  }

  /**
  * @see CircularBuffer.set
  */
  public set (index : number, value : Element) : void {
    if (index >= this._elements.capacity) {
      const offset : number = Math.min(
        index - this._elements.capacity + 1,
        this._size
      )

      this._start = (this._start + offset) % this._elements.capacity
      this._size -= offset
      index = this._elements.capacity - 1
    }

    while (index >= this._size) {
      this.push((this._elements.constructor as any).DEFAULElement_VALUE)
    }

    this._elements.set((this._start + index) % this._elements.capacity, value)
  }

  /**
  * @see CircularBuffer.insert
  */
  public insert (index : number, value : Element) : void {
    if (index >= this._size) {
      this.set(index, value)
    } else {
      if (this._size == this._elements.capacity) {
        this._start = (this._start + 1) % this._elements.capacity
        --index;
      } else {
        this._size += 1
      }

      for (let cursor = this._size - 1; cursor > index; --cursor) {
        this.set(cursor, this.get(cursor - 1))
      }

      this.set(index, value)
    }
  }

  /**
  * @see CircularBuffer.push
  */
  public push (value : Element) : void {
    if (this._size < this._elements.capacity) {
      this._elements.set(
        (this._start + this._size) % this._elements.capacity,
        value
      )
      this._size += 1
    } else {
      this._elements.set(this._start, value)
      this._start = (this._start + 1) % this._elements.capacity
    }
  }

  /**
  * @see CircularBuffer.delete
  */
  public delete (index : number) : void {
    for (let toMove = index; toMove > 0; --toMove) {
      this.set(toMove, this.get(toMove - 1))
    }

    this._start = (this._start + 1) % this._elements.capacity
    this._size -= 1
  }

  /**
  * @see CircularBuffer.warp
  */
  public warp (index : number) : void {
    this.set(index, this.get(0))

    this._start = (this._start + 1) % this._elements.capacity
    this._size -= 1
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
      if (equals(
        this._elements.get((this._start + index) % this._elements.capacity),
        element
      )) {
        return index
      }
    }

    return -1
  }

  /**
  * @see CircularBuffer.clear
  */
  public clear () : void {
    this._start = 0
    this._size = 0
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<Element> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._elements.get((this._start + index) % this._elements.capacity)
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
        if (!equals(other.get(index), this.get(index))) return false
      }

      return true
    }

    return false
  }
}
