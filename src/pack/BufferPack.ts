import { equals } from '../equals'
import { quicksort } from '../quicksort'
import { Comparator } from '../Comparator'

import { Pack } from './Pack'

type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array
type TypedArrayAllocator<Buffer extends TypedArray> = new (capacity : number) => Buffer

export class BufferPack<Buffer extends TypedArray> implements Pack<number> {
  static DEFAULT_VALUE : number = 0

  /**
  * Return a copy of another pack.
  *
  * @param toCopy - A pack to copy.
  */
  static copy <Buffer extends TypedArray> (
    toCopy : BufferPack<Buffer>
  ) : BufferPack<Buffer> {
    const result : BufferPack<Buffer> = toCopy.allocate(toCopy.capacity)

    result.size = toCopy.size

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      result.set(index, toCopy.get(index))
    }

    return result
  }

  private _elements : Buffer
  private _size : number

  /**
  * Wrap an existing buffer into a new pack instance.
  *
  * @param buffer - The buffer to wrap, the resulting pack will have the capacity of the given buffer.
  * @param [size = 0] - Initial number of elements in the pack.
  */
  public constructor (buffer : Buffer, size : number = 0) {
    this._elements = buffer
    this._size = size
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
  * @return The underlying typed array.
  */
  public get array () : Buffer {
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
  * Update the size of this pack.
  *
  * @param value - The new number of elements into this pack.
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
  * @return The constructor of the underlying typed array.
  */
  public get allocator () : TypedArrayAllocator<Buffer> {
    return this._elements.constructor as TypedArrayAllocator<Buffer>
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

    this._elements = new this.allocator(capacity)
    this._size = Math.min(this._size, capacity)

    for (let index = 0; index < oldSize; ++index) {
      this._elements[index] = old[index]
    }
  }

  /**
  * @see Pack.allocate
  */
  public allocate (capacity : number) : BufferPack<Buffer> {
    return new BufferPack<Buffer>(new this.allocator(capacity))
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
  * @see Collection.get
  */
  public get (index : number) : number {
    return this._elements[index]
  }

  /**
  * @see Pack.pop
  */
  public pop () : number {
    const last : number = this._size - 1
    const value : number = this._elements[last]
    this.delete(last)
    return value
  }

  /**
  * @see Pack.shift
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
  * @see Pack.swap
  */
  public swap (first : number, second : number) : void {
    const tmp : number = this._elements[first]
    this._elements[first] = this._elements[second]
    this._elements[second] = tmp
  }

  /**
  * @see Pack.set
  */
  public set (index : number, value : number) : void {
    if (index >= this._size) this.size = index + 1
    this._elements[index] = value
  }

  /**
  * @see Pack.insert
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
  * @see Pack.push
  */
  public push (value : number) : void {
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
  public has (element : number) : boolean {
    return this.indexOf(element) >= 0
  }

  /**
  * @see Collection.indexOf
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
  * Empty this pack of its elements.
  */
  public clear () : void {
    this._size = 0
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
