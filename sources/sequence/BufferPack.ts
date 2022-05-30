import { Comparator, equals } from '@cedric-demongivert/gl-tool-utils'

import { quicksort } from '../algorithm'
import { IsCollection } from '../IsCollection'
import { Buffer, UnsignedIntegerBuffer, IntegerBuffer } from '../native'

import type { Pack } from './Pack'

import { Sequence } from './Sequence'
import { SequenceCursor } from './SequenceCursor'

/**
 * A wrapper for handling javascript ArrayBuffer instances as gl-tool Packs.
 */
export class BufferPack<Wrapped extends Buffer> implements Pack<number> {
  /**
   * Wrapped buffer.
   */
  private _elements: Wrapped

  /**
   * Number of elements in this pack.
   */
  private _size: number

  /**
   * 
   */
  private _view: Sequence<number>

  /**
   * Wrap an existing buffer into a new pack instance.
   *
   * @param elements - The buffer to wrap; the resulting pack will have the capacity of the given buffer.
   * @param [size = 0] - Initial number of elements in the pack.
   */
  public constructor(elements: Wrapped, size: number = 0) {
    this._elements = elements
    this._size = size
    this._view = Sequence.view(this)
  }

  /**
   * @see Collection.prototype[IsCollection.SYMBOL]
   */
  public [IsCollection.SYMBOL](): true {
    return true
  }

  /**
   * @see Collection.prototype.isSequence
   */
  public isSequence(): true {
    return true
  }

  /**
   * @see Collection.prototype.isPack
   */
  public isPack(): true {
    return true
  }

  /**
   * @see Collection.prototype.isList
   */
  public isList(): true {
    return true
  }

  /**
   * @see Collection.prototype.isGroup
   */
  public isGroup(): false {
    return false
  }

  /**
   * @see Collection.prototype.isSet
   */
  public isSet(): false {
    return false
  }

  /**
   * @returns The underlying typed array.
   */
  public get array(): Wrapped {
    return this._elements
  }

  /**
   * @returns The underlying buffer.
   */
  public get buffer(): ArrayBuffer {
    return this._elements.buffer
  }

  /**
   * @see Collection.prototype.size
   */
  public get size(): number {
    return this._size
  }

  /**
   * @see List.prototype.size
   */
  public set size(value: number) {
    if (value > this._elements.length) {
      this.reallocate(value)
    }

    for (let index = this._size; index < value; ++index) {
      this._elements[index] = 0
    }

    this._size = value
  }

  /**
   * @see StaticCollection.prototype.capacity
   */
  public get capacity(): number {
    return this._elements.length
  }

  /**
   * @see List.prototype.defaultValue
   */
  public defaultValue(): 0 {
    return 0
  }

  /**
   * @see ReallocableCollection.prototype.reallocate
   */
  public reallocate(capacity: number): void {
    const old: any = this._elements
    const oldSize: number = this._size

    this._elements = Buffer.reallocate(old, capacity)
    this._size = Math.min(this._size, capacity)

    for (let index = 0; index < oldSize; ++index) {
      this._elements[index] = old[index]
    }
  }

  /**
   * @see ReallocableCollection.prototype.fit
   */
  public fit(): void {
    this.reallocate(this._size)
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): number {
    return this._elements[index]
  }

  /**
   * @see List.prototype.fill
   */
  public fill(element: number): void {
    for (let index = 0, size = this._size; index < size; ++index) {
      this._elements[index] = element
    }
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): number {
    return this._elements[Math.max(this._size - 1, 0)]
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): number {
    return this._elements[0]
  }

  /**
   * @see List.prototype.pop
   */
  public pop(): number {
    const last: number = this._size - 1
    const value: number = this._elements[last]
    this.delete(last)
    return value
  }

  /**
   * @see List.prototype.shift
   */
  public shift(): number {
    const value: number = this._elements[0]
    this.delete(0)
    return value
  }

  /**
   * @see Pack.prototype.sort
   */
  public sort(comparator: Comparator<number, number>): void {
    quicksort(this, comparator, 0, this._size)
  }

  /**
   * @see Pack.prototype.subsort
   */
  public subsort(offset: number, size: number, comparator: Comparator<number, number>): void {
    quicksort(this, comparator, offset, size)
  }

  /**
   * @see List.prototype.swap
   */
  public swap(first: number, second: number): void {
    const tmp: number = this._elements[first]
    this._elements[first] = this._elements[second]
    this._elements[second] = tmp
  }

  /**
   * @see List.prototype.set
   */
  public set(index: number, value: number): void {
    if (index >= this._size) this.size = index + 1
    this._elements[index] = value
  }

  /**
   * @see List.prototype.setMany
   */
  public setMany(from: number, count: number, value: number): void {
    const to: number = from + count

    if (to > this._size) {
      this.size = to
    }

    const elements: Wrapped = this._elements

    for (let cursor = from; cursor < to; ++cursor) {
      elements[cursor] = value
    }
  }

  /**
   * @see List.prototype.insert
   */
  public insert(index: number, value: number): void {
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
   * @see List.prototype.push
   */
  public push(value: number): void {
    const index: number = this._size

    this.size += 1
    this._elements[index] = value
  }

  /**
   * @see List.prototype.unshift
   */
  public unshift(value: number): void {
    this.size += 1

    for (let index = this._size - 1; index > 0; --index) {
      this._elements[index] = this._elements[index - 1]
    }

    this._elements[0] = value
  }

  /**
   * @see List.prototype.delete
   */
  public delete(index: number): void {
    for (let cursor = index, size = this._size - 1; cursor < size; ++cursor) {
      this._elements[cursor] = this._elements[cursor + 1]
    }

    this.size -= 1
  }

  /**
   * @see List.prototype.deleteMany
   */
  public deleteMany(from: number, size: number): void {
    const toMove: number = this._size - from - size
    const offset: number = from + size

    for (let cursor = 0; cursor < toMove; ++cursor) {
      this._elements[from + cursor] = this._elements[offset + cursor]
    }

    this.size -= size
  }

  /**
   * @see List.prototype.empty
   */
  public empty(index: number): void {
    this.set(index, 0)
  }

  /**
   * @see List.prototype.emptyMany
   */
  public emptyMany(from: number, size: number): void {
    for (let cursor = 0; cursor < size; ++cursor) {
      this.set(from + cursor, 0)
    }
  }

  /**
   * @see List.prototype.warp
   */
  public warp(index: number): void {
    this._elements[index] = this._elements[this._size - 1]
    this.size -= 1
  }

  /**
   * @see List.prototype.warpMany
   */
  public warpMany(from: number, count: number): void {
    const size: number = this._size
    const rest: number = size - from - count

    if (rest > 0) {
      const elements: Wrapped = this._elements
      const toWarp: number = rest > count ? count : rest

      for (let index = 0; index < toWarp; ++index) {
        elements[from + index] = elements[size - index - 1]
      }
    }

    this._size -= count
  }

  /**
   * @see Collection.prototype.has
   */
  public has(element: number): boolean {
    return this.indexOf(element) >= 0
  }

  /**
   * @see Sequence.prototype.indexOf
   */
  public indexOf(element: number): number {
    for (let index = 0, length = this._size; index < length; ++index) {
      if (equals(element, this._elements[index])) {
        return index
      }
    }

    return -1;
  }

  /**
   * @see Sequence.prototype.hasInSubsequence
   */
  public hasInSubsequence(element: number, offset: number, size: number): boolean {
    return this.indexOfInSubsequence(element, offset, size) >= 0
  }

  /**
   * @see Sequence.prototype.indexOfInSubsequence
   */
  public indexOfInSubsequence(element: number, offset: number, size: number): number {
    for (let index = offset, length = offset + size; index < length; ++index) {
      if (equals(element, this._elements[index])) {
        return index
      }
    }

    return -1;
  }

  /**
   * @see List.prototype.copy
   */
  public copy(toCopy: Sequence<number>): void {
    this.size = toCopy.size

    const elements: Wrapped = this._elements

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      elements[index] = toCopy.get(index)
    }
  }

  /**
   * @see Sequence.prototype.concat
   */
  public concat(toConcat: Sequence<number>): void {
    const toConcatSize: number = toConcat.size

    if (this.capacity < this.size + toConcatSize) {
      this.reallocate(this.size + toConcatSize)
    }

    for (let index = 0; index < toConcatSize; ++index) {
      this.push(toConcat.get(index))
    }
  }

  /**
   * @see Sequence.prototype.concat
   */
  public concatArray(toConcat: number[]): void {
    if (this.capacity < this.size + toConcat.length) {
      this.reallocate(this.size + toConcat.length)
    }

    for (let index = 0, size = toConcat.length; index < size; ++index) {
      this.push(toConcat[index])
    }
  }

  /**
   * @see Pack.prototype.allocate
   */
  public allocate(capacity: number): BufferPack<Wrapped> {
    return new BufferPack<Wrapped>(Buffer.reallocate(this._elements, capacity))
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): BufferPack<Wrapped> {
    const result: BufferPack<Wrapped> = this.allocate(this._elements.length)

    result.copy(this)

    return result
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): void {
    this._size = 0
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): Sequence<number> {
    return this._view
  }

  /**
   * @see Collection.prototype.forward
   */
  public forward(): SequenceCursor<number> {
    return new SequenceCursor(this, 0)
  }

  /**
   * @see Collection.prototype.values
   */
  public * values(): IterableIterator<number> {
    for (let index = 0; index < this._size; ++index) {
      yield this._elements[index]
    }
  }

  /**
   * @see Collection.prototype[Symbol.iterator]
   */
  public [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  /**
   * @see Collection.equals
   */
  public equals(other: any): boolean {
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

  /**
   * @see Object.prototype.toString
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._elements.constructor.name + ') ' + Sequence.stringify(this)
  }
}

export namespace BufferPack {
  /**
   * 
   */
  export function wrap<Wrapped extends Buffer>(toWrap: Wrapped, size: number = toWrap.length): BufferPack<Wrapped> {
    return new BufferPack(toWrap, size)
  }

  /**
   * Instantiate a new pack that wraps an unsigned byte buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @returns A new pack that wrap a unsigned byte buffer of the given capacity.
   */
  export function uint8(capacity: number): BufferPack<Uint8Array> {
    return new BufferPack<Uint8Array>(new Uint8Array(capacity))
  }

  /**
   * Instantiate a new pack that wraps an unsigned short buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @returns A new pack that wrap a unsigned short buffer of the given capacity.
   */
  export function uint16(capacity: number): BufferPack<Uint16Array> {
    return new BufferPack<Uint16Array>(new Uint16Array(capacity))
  }

  /**
   * Instantiate a new pack that wraps an unsigned integer buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @returns A new pack that wrap a unsigned integer buffer of the given capacity.
   */
  export function uint32(capacity: number): BufferPack<Uint32Array> {
    return new BufferPack<Uint32Array>(new Uint32Array(capacity))
  }

  /**
   * Instantiate a new pack that wraps a byte buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @returns A new pack that wrap a byte buffer of the given capacity.
   */
  export function int8(capacity: number): BufferPack<Int8Array> {
    return new BufferPack<Int8Array>(new Int8Array(capacity))
  }

  /**
   * Instantiate a new pack that wraps a short buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @returns A new pack that wrap a short buffer of the given capacity.
   */
  export function int16(capacity: number): BufferPack<Int16Array> {
    return new BufferPack<Int16Array>(new Int16Array(capacity))
  }

  /**
   * Instantiate a new pack that wraps an integer buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @returns A new pack that wrap a integer buffer of the given capacity.
   */
  export function int32(capacity: number): BufferPack<Int32Array> {
    return new BufferPack<Int32Array>(new Int32Array(capacity))
  }

  /**
   * Instantiate a new pack that wraps a float buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @returns A new pack that wrap a float buffer of the given capacity.
   */
  export function float32(capacity: number): BufferPack<Float32Array> {
    return new BufferPack<Float32Array>(new Float32Array(capacity))
  }

  /**
   * Instantiate a new pack that wraps a double buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @returns A new pack that wrap a double buffer of the given capacity.
   */
  export function float64(capacity: number): BufferPack<Float64Array> {
    return new BufferPack<Float64Array>(new Float64Array(capacity))
  }

  /**
   * Instantiate a new pack that wraps an unsigned integer buffer that can store
   * values in range [0, maximum] and that is of the given capacity.
   *
   * @param maximum - Maximum value that can be stored.
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @returns A new pack that wrap a unsigned integer buffer that can store values
   *         in range [0, maximum] and that is of the given capacity.
   */
  export function unsignedUpTo(maximum: number, capacity: number): BufferPack<UnsignedIntegerBuffer> {
    return new BufferPack(UnsignedIntegerBuffer.upTo(maximum, capacity))
  }

  /**
   * Instantiate a new pack that wrap a signed integer buffer that can store
   * values in range [-maximum, maximum] and that is of the given capacity.
   *
   * @param maximum - Maximum value that can be stored.
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @returns A new pack that wrap a signed integer buffer that can store values
   *         in range [-maximum, maximum] and that is of the given capacity.
   */
  export function signedUpTo(maximum: number, capacity: number): BufferPack<IntegerBuffer> {
    return new BufferPack(IntegerBuffer.upTo(maximum, capacity))
  }

  /**
   * 
   */
  export function ofUint8(...values: number[]): BufferPack<Uint8Array> {
    return new BufferPack<Uint8Array>(new Uint8Array(values), values.length)
  }

  /**
   * 
   */
  export function ofUint16(...values: number[]): BufferPack<Uint16Array> {
    return new BufferPack<Uint16Array>(new Uint16Array(values), values.length)
  }

  /**
   * 
   */
  export function ofUint32(...values: number[]): BufferPack<Uint32Array> {
    return new BufferPack<Uint32Array>(new Uint32Array(values), values.length)
  }

  /**
   * 
   */
  export function ofInt8(...values: number[]): BufferPack<Int8Array> {
    return new BufferPack<Int8Array>(new Int8Array(values), values.length)
  }

  /**
   * 
   */
  export function ofInt16(...values: number[]): BufferPack<Int16Array> {
    return new BufferPack<Int16Array>(new Int16Array(values), values.length)
  }

  /**
   *
   */
  export function ofInt32(...values: number[]): BufferPack<Int32Array> {
    return new BufferPack<Int32Array>(new Int32Array(values), values.length)
  }

  /**
   * 
   */
  export function ofFloat32(...values: number[]): BufferPack<Float32Array> {
    return new BufferPack<Float32Array>(new Float32Array(values), values.length)
  }

  /**
   * 
   */
  export function ofFloat64(...values: number[]): BufferPack<Float64Array> {
    return new BufferPack<Float64Array>(new Float64Array(values), values.length)
  }
}
