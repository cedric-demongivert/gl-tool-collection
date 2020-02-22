import { Comparator } from '../Comparator'
import { Sequence } from '../Sequence'

import { equals } from '../algorithm/equals'
import { quicksort } from '../algorithm/quicksort'

import { Buffer } from '../native/Buffer'
import { UnsignedIntegerBuffer } from '../native/UnsignedIntegerBuffer'
import { IntegerBuffer } from '../native/IntegerBuffer'

import { SequenceView } from '../view/SequenceView'

import { Pack } from './Pack'
import { PackIterator } from './PackIterator'

export class BufferPack<Wrapped extends Buffer> implements Pack<number> {
  /**
  * Default value of each new cell of this buffer.
  */
  static DEFAULT_VALUE : number = 0

  /**
  * Wrapped buffer.
  */
  private _elements : Wrapped

  /**
  * Number of elements in this pack.
  */
  private _size : number

  /**
  * Wrap an existing buffer into a new pack instance.
  *
  * @param elements - The buffer to wrap, the resulting pack will have the capacity of the given buffer.
  * @param [size = 0] - Initial number of elements in the pack.
  */
  public constructor (elements : Wrapped, size : number = 0) {
    this._elements = elements
    this._size = size
  }

  /**
  * @return The underlying typed array.
  */
  public get array () : Wrapped {
    return this._elements
  }

  /**
  * @return The underlying buffer.
  */
  public get buffer () : ArrayBuffer {
    return this._elements.buffer
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
    if (value > this._elements.length) {
      this.reallocate(value)
    }

    for (let index = this._size; index < value; ++index) {
      this._elements[index] = 0
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
    const old : any = this._elements
    const oldSize : number = this._size

    this._elements = Buffer.reallocate(old, capacity)
    this._size = Math.min(this._size, capacity)

    for (let index = 0; index < oldSize; ++index) {
      this._elements[index] = old[index]
    }
  }

  /**
  * @see ReallocableCollection.fit
  */
  public fit () : void {
    this.reallocate(this._size)
  }

  /**
  * @see Sequence.get
  */
  public get (index : number) : number {
    return this._elements[index]
  }

  /**
  * @see MutableSequence.fill
  */
  public fill (element : number) : void {
    for (let index = 0, size = this._size; index < size; ++index) {
      this._elements[index] = element
    }
  }

  /**
  * @see Sequence.last
  */
  public get last () : number {
    return this._elements[Math.max(this._size - 1, 0)]
  }

  /**
  * @see Sequence.last
  */
  public get lastIndex () : number {
    return Math.max(this._size - 1, 0)
  }

  /**
  * @see Sequence.first
  */
  public get first () : number {
    return this._elements[0]
  }

  /**
  * @see Sequence.firstIndex
  */
  public get firstIndex () : number {
    return 0
  }

  /**
  * @see MutableSequence.pop
  */
  public pop () : number {
    const last : number = this._size - 1
    const value : number = this._elements[last]
    this.delete(last)
    return value
  }

  /**
  * @see MutableSequence.shift
  */
  public shift () : number {
    const value : number = this._elements[0]
    this.delete(0)
    return value
  }

  /**
  * @see Pack.sort
  */
  public sort (comparator : Comparator<number, number>) : void {
    quicksort(this, comparator, 0, this._size)
  }

  /**
  * @see Pack.subsort
  */
  public subsort (offset : number, size : number, comparator : Comparator<number, number>) : void {
    quicksort(this, comparator, offset, size)
  }

  /**
  * @see MutableSequence.swap
  */
  public swap (first : number, second : number) : void {
    const tmp : number = this._elements[first]
    this._elements[first] = this._elements[second]
    this._elements[second] = tmp
  }

  /**
  * @see MutableSequence.set
  */
  public set (index : number, value : number) : void {
    if (index >= this._size) this.size = index + 1
    this._elements[index] = value
  }

  /**
  * @see MutableSequence.insert
  */
  public insert (index : number, value : number) : void {
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
  public push (value : number) : void {
    const index : number = this._size

    this.size += 1
    this._elements[index] = value
  }

  /**
  * @see MutableSequence.unshift
  */
  public unshift (value : number) : void {
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
  public has (element : number) : boolean {
    return this.indexOf(element) >= 0
  }

  /**
  * @see Sequence.indexOf
  */
  public indexOf (element : number) : number {
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
  public copy (toCopy : Sequence<number>) : void {
    this.size = toCopy.size

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      this.set(index, toCopy.get(index))
    }
  }

  /**
  * @see Pack.allocate
  */
  public allocate (capacity : number) : BufferPack<Wrapped> {
    return new BufferPack<Wrapped>(Buffer.reallocate(this._elements, capacity))
  }

  /**
  * @see Collection.clone
  */
  public clone () : BufferPack<Wrapped> {
    const result : BufferPack<Wrapped> = this.allocate(this._elements.length)

    result.copy(this)

    return result
  }

  /**
  * @see MutableSequence.clear
  */
  public clear () : void {
    this._size = 0
  }

  /**
  * @see Collection.view
  */
  public view () : Sequence<number> {
    return SequenceView.wrap(this)
  }

  /**
  * @see Collection.iterator
  */
  public iterator () : PackIterator<number> {
    const result : PackIterator<number> = new PackIterator()

    result.pack = this
    result.index = 0

    return result
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<number> {
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

    if (other instanceof BufferPack) {
      if (other.size !== this._size) return false

      for (let index = 0, size = this._size; index < size; ++index) {
        if (!equals(other.get(index), this._elements[index])) return false
      }

      return true
    }

    return false
  }
}

export namespace BufferPack {
  /**
  * Return a copy of another pack.
  *
  * @param toCopy - A pack to copy.
  */
  export function copy <Wrapped extends Buffer> (
    toCopy : BufferPack<Wrapped>
  ) : BufferPack<Wrapped> {
    return toCopy == null ? null : toCopy.clone()
  }

  /**
  * Instantiate a new pack that wrap a unsigned byte buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a unsigned byte buffer of the given capacity.
  */
  export function uint8 (capacity : number) : BufferPack<Uint8Array> {
    return new BufferPack<Uint8Array>(new Uint8Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a unsigned short buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a unsigned short buffer of the given capacity.
  */
  export function uint16 (capacity : number) : BufferPack<Uint16Array> {
    return new BufferPack<Uint16Array>(new Uint16Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a unsigned integer buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a unsigned integer buffer of the given capacity.
  */
  export function uint32 (capacity : number) : BufferPack<Uint32Array> {
    return new BufferPack<Uint32Array>(new Uint32Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a byte buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a byte buffer of the given capacity.
  */
  export function int8 (capacity : number) : BufferPack<Int8Array> {
    return new BufferPack<Int8Array>(new Int8Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a short buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a short buffer of the given capacity.
  */
  export function int16 (capacity : number) : BufferPack<Int16Array> {
    return new BufferPack<Int16Array>(new Int16Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a integer buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a integer buffer of the given capacity.
  */
  export function int32 (capacity : number) : BufferPack<Int32Array> {
    return new BufferPack<Int32Array>(new Int32Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a float buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a float buffer of the given capacity.
  */
  export function float32 (capacity : number) : BufferPack<Float32Array> {
    return new BufferPack<Float32Array>(new Float32Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a double buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a double buffer of the given capacity.
  */
  export function float64 (capacity : number) : BufferPack<Float64Array> {
    return new BufferPack<Float64Array>(new Float64Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a unsigned integer buffer that can store
  * values in range [0, maximum] and that is of the given capacity.
  *
  * @param maximum - Maximum value that can be stored.
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a unsigned integer buffer that can store values
  *         in range [0, maximum] and that is of the given capacity.
  */
  export function unsignedUpTo (
    maximum : number, capacity : number
  ) : BufferPack<UnsignedIntegerBuffer> {
    return new BufferPack(UnsignedIntegerBuffer.upTo(maximum, capacity))
  }

  /**
  * Instantiate a new pack that wrap a signed integer buffer that can store
  * values in range [-maximum, maximum] and that is of the given capacity.
  *
  * @param maximum - Maximum value that can be stored.
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a signed integer buffer that can store values
  *         in range [-maximum, maximum] and that is of the given capacity.
  */
  export function signedUpTo (
    maximum : number, capacity : number
  ) : BufferPack<IntegerBuffer> {
    return new BufferPack(IntegerBuffer.upTo(maximum, capacity))
  }
}
