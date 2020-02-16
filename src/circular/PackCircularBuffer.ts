import { equals } from '@library/algorithm/equals'
import { Pack } from '@library/pack/Pack'
import { CircularBuffer } from '@library/circular/CircularBuffer'
import { CircularBufferIterator } from '@library/iterator/CircularBufferIterator'
import { Sequence } from '@library/Sequence';

export class PackCircularBuffer<Element> implements CircularBuffer<Element>
{
  private _elements : Pack<Element>
  private _start : number
  private _size : number

  /**
  * Create a new circular buffer uppon an existing pack implementation.
  *
  * @param elements - A pack to use for storing this circular buffer elements.
  * @param [offset = 0] - Number of element to skip from the start of the pack.
  * @param [size = elements.size - offset] - Number of element to keep.
  */
  public constructor (
    elements : Pack<Element>,
    offset : number = 0,
    size : number = elements.size - offset
  ) {
    this._elements = elements
    this._elements.size = elements.capacity

    this._start = offset
    this._size = size
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._size
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
    const next : Pack<Element> = Pack.copy(this._elements)
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
  * @see Sequence.first
  */
  public get first () : Element {
    return this._size > 0 ? this._elements.get(this._start) : undefined
  }

  /**
  * @see Sequence.firstIndex
  */
  public get firstIndex () : number {
    return 0
  }

  /**
  * @see Sequence.last
  */
  public get last () : Element {
    return this._size > 0 ? this._elements.get((this._start + this._size) % this._elements.capacity) : undefined
  }

  /**
  * @see Sequence.lastIndex
  */
  public get lastIndex () : number {
    return Math.max(this._size - 1, 0)
  }

  /**
  * @see Collection.iterator
  */
  public iterator () : CircularBufferIterator<Element> {
    const result : CircularBufferIterator<Element> = new CircularBufferIterator()

    result.buffer = this
    result.index = 0

    return result
  }

  /**
  * @see Sequence.get
  */
  public get (index : number) : Element {
    return this._elements.get((this._start + index) % this._elements.capacity)
  }

  /**
  * @see MutableSequence.fill
  */
  public fill (element : Element) : void {
    for (let index = 0, size = this._size; index < size; ++index) {
      this.set(index, element)
    }
  }

  /**
  * @see MutableSequence.pop
  */
  public pop () : Element {
    const last : number = this._size - 1
    const result : Element = this.get(last)

    this.delete(last)

    return result
  }

  /**
  * @see MutableSequence.shift
  */
  public shift () : Element {
    const result : Element = this.get(0)

    this.delete(0)

    return result
  }

  /**
  * @see MutableSequence.swap
  */
  public swap (first : number, second : number) : void {
    const rfirst : number = (this._start + first) % this._elements.capacity
    const rsecond : number = (this._start + second) % this._elements.capacity

    this._elements.swap(rfirst, rsecond)
  }

  /**
  * @see MutableSequence.set
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
  * @see MutableSequence.insert
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
  * @see MutableSequence.push
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
  * @see MutableSequence.unshift
  */
  public unshift (value : Element) : void {
    this._start -= 1

    if (this._start < 0) {
      this._start += this._elements.capacity
    }

    this._elements.set(this._start, value)

    if (this._size < this._elements.capacity) {
      this._size += 1
    }
  }

  /**
  * @see MutableSequence.delete
  */
  public delete (index : number) : void {
    for (let toMove = index; toMove > 0; --toMove) {
      this.set(toMove, this.get(toMove - 1))
    }

    this._start = (this._start + 1) % this._elements.capacity
    this._size -= 1
  }

  /**
  * @see MutableSequence.warp
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
  * @see Sequence.indexOf
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
  * @see Sequence.copy
  */
  public copy (toCopy : Sequence<Element>) : void {
    if (toCopy.size > this.capacity) {
      this.reallocate(toCopy.size)
    }

    this.clear()

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      this.push(toCopy.get(index))
    }
  }

  /**
  * @see CircularBuffer.clone
  */
  public clone () : PackCircularBuffer<Element> {
    return new PackCircularBuffer(
      this._elements.clone(),
      this._start,
      this._size
    )
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

    if (other instanceof PackCircularBuffer) {
      if (other.size !== this._size) return false

      for (let index = 0, size = this._size; index < size; ++index) {
        if (!equals(other.get(index), this.get(index))) return false
      }

      return true
    }

    return false
  }
}

export namespace PackCircularBuffer {
  /**
  * Shallow copy an existing pack circular buffer instance.
  *
  * @param toCopy - An instance to shallow copy.
  *
  * @return A shallow copy of the given instance.
  */
  export function copy <Element> (
    toCopy : PackCircularBuffer<Element>
  ) : PackCircularBuffer<Element> {
    return toCopy == null ? null : toCopy.clone()
  }
}
