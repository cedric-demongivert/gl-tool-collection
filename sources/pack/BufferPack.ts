import { Comparator, equals } from '@cedric-demongivert/gl-tool-utils'

import { quicksort } from '../algorithm/quicksort'
import { Buffer } from '../native/Buffer'
import { UnsignedIntegerBuffer } from '../native/UnsignedIntegerBuffer'
import { IntegerBuffer } from '../native/IntegerBuffer'
import { Sequence } from '../sequence/Sequence'
import { SequenceCursor } from '../sequence/SequenceCursor'

import type { Pack } from './Pack'

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
   * Wrap an existing buffer into a new pack instance.
   *
   * @param elements - The buffer to wrap; the resulting pack will have the capacity of the given buffer.
   * @param [size = 0] - Initial number of elements in the pack.
   */
  public constructor(elements: Wrapped, size: number = 0) {
    this._elements = elements
    this._size = size
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
   * @see {@link Pack.size}
   */
  public get size(): number {
    return this._size
  }

  /**
   * @see {@link Pack.size}
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
   * @see {@link Pack.capacity}
   */
  public get capacity(): number {
    return this._elements.length
  }

  /**
   * @see {@link Pack.defaultValue}
   */
  public defaultValue(): 0 {
    return 0
  }

  /**
   * @see {@link Pack.reallocate}
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
   * @see {@link Pack.fit}
   */
  public fit(): void {
    this.reallocate(this._size)
  }

  /**
   * @see {@link Pack.get}
   */
  public get(index: number): number | undefined {
    return this._elements[index]
  }

  /**
   * @see {@link Pack.fill}
   */
  public fill(element: number): void {
    for (let index = 0, size = this._size; index < size; ++index) {
      this._elements[index] = element
    }
  }

  /**
   * @see {@link Pack.last}
   */
  public get last(): number | undefined {
    return this._size === 0 ? undefined : this._elements[Math.max(this._size - 1, 0)]
  }

  /**
   * @see {@link Pack.first}
   */
  public get first(): number | undefined {
    return this._size === 0 ? undefined : this._elements[0]
  }

  /**
   * @see {@link Pack.pop}
   */
  public pop(): number | undefined {
    if (this._size < 1) return undefined

    const last: number = this._size - 1
    const value: number = this._elements[last]
    this.delete(last)
    return value
  }

  /**
   * @see {@link Pack.shift}
   */
  public shift(): number | undefined {
    if (this._size < 1) return undefined

    const value: number = this._elements[0]
    this.delete(0)
    return value
  }

  /**
   * @see {@link Pack.sort}
   */
  public sort(comparator: Comparator<number, number>): void {
    quicksort(this, comparator, 0, this._size)
  }

  /**
   * @see {@link Pack.subsort}
   */
  public subsort(offset: number, size: number, comparator: Comparator<number, number>): void {
    quicksort(this, comparator, offset, size)
  }

  /**
   * @see {@link Pack.swap}
   */
  public swap(first: number, second: number): void {
    const tmp: number = this._elements[first]
    this._elements[first] = this._elements[second]
    this._elements[second] = tmp
  }

  /**
   * @see {@link Pack.set}
   */
  public set(index: number, value: number): void {
    if (index >= this._size) this.size = index + 1
    this._elements[index] = value
  }

  /**
   * @see {@link Pack.setMany}
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
   * @see {@link Pack.insert}
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
   * @see {@link Pack.push}
   */
  public push(value: number): void {
    const index: number = this._size

    this.size += 1
    this._elements[index] = value
  }

  /**
   * @see {@link Pack.unshift}
   */
  public unshift(value: number): void {
    this.size += 1

    for (let index = this._size - 1; index > 0; --index) {
      this._elements[index] = this._elements[index - 1]
    }

    this._elements[0] = value
  }

  /**
   * @see {@link Pack.delete}
   */
  public delete(index: number): void {
    for (let cursor = index, size = this._size - 1; cursor < size; ++cursor) {
      this._elements[cursor] = this._elements[cursor + 1]
    }

    this.size -= 1
  }

  /**
   * @see {@link Pack.deleteMany}
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
   * @see {@link Pack.empty}
   */
  public empty(index: number): void {
    this.set(index, 0)
  }

  /**
   * @see {@link Pack.emptyMany}
   */
  public emptyMany(from: number, size: number): void {
    for (let cursor = 0; cursor < size; ++cursor) {
      this.set(from + cursor, 0)
    }
  }

  /**
   * @see {@link Pack.warp}
   */
  public warp(index: number): void {
    this._elements[index] = this._elements[this._size - 1]
    this.size -= 1
  }

  /**
   * @see {@link Pack.warpMany}
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
   * @see {@link Pack.has}
   */
  public has(element: number): boolean {
    return this.indexOf(element) >= 0
  }

  /**
   * @see {@link Pack.indexOf}
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
   * @see {@link Pack.hasInSubsequence}
   */
  public hasInSubsequence(element: number, offset: number, size: number): boolean {
    return this.indexOfInSubsequence(element, offset, size) >= 0
  }

  /**
   * @see {@link Pack.indexOfInSubsequence}
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
   * @see {@link Pack.copy}
   */
  public copy(toCopy: Sequence<number>): void {
    this.size = toCopy.size

    const elements: Wrapped = this._elements

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      elements[index] = toCopy.get(index)!
    }
  }

  /**
   * @see {@link Pack.subCopy}
   */
  public subCopy(toCopy: Sequence<number>, offset: number = 0, size: number = toCopy.size - offset): void {
    this.size = size

    const elements: Wrapped = this._elements

    for (let index = 0; index < size; ++index) {
      elements[index] = toCopy.get(offset + index)!
    }
  }


  /**
   * @see {@link Pack.concat}
   */
  public concat(toConcat: Sequence<number>): void {
    const toConcatSize: number = toConcat.size

    if (this.capacity < this.size + toConcatSize) {
      this.reallocate(this.size + toConcatSize)
    }

    for (let index = 0; index < toConcatSize; ++index) {
      this.push(toConcat.get(index)!)
    }
  }

  /**
   * @see {@link Pack.concatArray}
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
   * @see {@link Pack.allocate}
   */
  public allocate(capacity: number): BufferPack<Wrapped> {
    return new BufferPack<Wrapped>(Buffer.reallocate(this._elements, capacity))
  }

  /**
   * @see {@link Pack.clone}
   */
  public clone(): BufferPack<Wrapped> {
    const result: BufferPack<Wrapped> = this.allocate(this._elements.length)

    result.copy(this)

    return result
  }

  /**
   * @see {@link Pack.clear}
   */
  public clear(): void {
    this._size = 0
  }

  /**
   * @see {@link Pack.view}
   */
  public view(): Sequence<number> {
    return Sequence.view(this)
  }

  /**
   * @see {@link Pack.forward}
   */
  public forward(): SequenceCursor<number> {
    return new SequenceCursor(this, 0)
  }

  /**
   * @see {@link Pack.values}
   */
  public * values(): IterableIterator<number> {
    for (let index = 0; index < this._size; ++index) {
      yield this._elements[index]
    }
  }

  /**
   * @see {@link Pack[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  /**
   * @see {@link Pack.equals}
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
   * @see {@link Pack.toString}
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._elements.constructor.name + ') ' + Sequence.stringify(this)
  }
}

/**
 * 
 */
export function createPackFromBuffer<Wrapped extends Buffer>(toWrap: Wrapped, size: number = toWrap.length): BufferPack<Wrapped> {
  return new BufferPack(toWrap, size)
}

/**
 * Instantiate a new pack that wraps an unsigned byte buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a unsigned byte buffer of the given capacity.
 */
export function createUint8Pack(capacity: number): BufferPack<Uint8Array> {
  return new BufferPack<Uint8Array>(new Uint8Array(capacity))
}

/**
 * Instantiate a new pack that wraps an unsigned short buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a unsigned short buffer of the given capacity.
 */
export function createUint16Pack(capacity: number): BufferPack<Uint16Array> {
  return new BufferPack<Uint16Array>(new Uint16Array(capacity))
}

/**
 * Instantiate a new pack that wraps an unsigned integer buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a unsigned integer buffer of the given capacity.
 */
export function createUint32Pack(capacity: number): BufferPack<Uint32Array> {
  return new BufferPack<Uint32Array>(new Uint32Array(capacity))
}

/**
 * Instantiate a new pack that wraps a byte buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a byte buffer of the given capacity.
 */
export function createInt8Pack(capacity: number): BufferPack<Int8Array> {
  return new BufferPack<Int8Array>(new Int8Array(capacity))
}

/**
 * Instantiate a new pack that wraps a short buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a short buffer of the given capacity.
 */
export function createInt16Pack(capacity: number): BufferPack<Int16Array> {
  return new BufferPack<Int16Array>(new Int16Array(capacity))
}

/**
 * Instantiate a new pack that wraps an integer buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a integer buffer of the given capacity.
 */
export function createInt32Pack(capacity: number): BufferPack<Int32Array> {
  return new BufferPack<Int32Array>(new Int32Array(capacity))
}

/**
 * Instantiate a new pack that wraps a float buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a float buffer of the given capacity.
 */
export function createFloat32Pack(capacity: number): BufferPack<Float32Array> {
  return new BufferPack<Float32Array>(new Float32Array(capacity))
}

/**
 * Instantiate a new pack that wraps a double buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a double buffer of the given capacity.
 */
export function createFloat64Pack(capacity: number): BufferPack<Float64Array> {
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
export function createUnsignedPackUpTo(maximum: number, capacity: number): BufferPack<UnsignedIntegerBuffer> {
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
export function createSignedPackUpTo(maximum: number, capacity: number): BufferPack<IntegerBuffer> {
  return new BufferPack(IntegerBuffer.upTo(maximum, capacity))
}

/**
 * 
 */
export function asUint8Pack(...values: number[]): BufferPack<Uint8Array> {
  return new BufferPack<Uint8Array>(new Uint8Array(values), values.length)
}

/**
 * 
 */
export function asUint16Pack(...values: number[]): BufferPack<Uint16Array> {
  return new BufferPack<Uint16Array>(new Uint16Array(values), values.length)
}

/**
 * 
 */
export function asUint32Pack(...values: number[]): BufferPack<Uint32Array> {
  return new BufferPack<Uint32Array>(new Uint32Array(values), values.length)
}

/**
 * 
 */
export function asInt8Pack(...values: number[]): BufferPack<Int8Array> {
  return new BufferPack<Int8Array>(new Int8Array(values), values.length)
}

/**
 * 
 */
export function asInt16Pack(...values: number[]): BufferPack<Int16Array> {
  return new BufferPack<Int16Array>(new Int16Array(values), values.length)
}

/**
 *
 */
export function asInt32Pack(...values: number[]): BufferPack<Int32Array> {
  return new BufferPack<Int32Array>(new Int32Array(values), values.length)
}

/**
 * 
 */
export function asFloat32Pack(...values: number[]): BufferPack<Float32Array> {
  return new BufferPack<Float32Array>(new Float32Array(values), values.length)
}

/**
 * 
 */
export function asFloat64Pack(...values: number[]): BufferPack<Float64Array> {
  return new BufferPack<Float64Array>(new Float64Array(values), values.length)
}

/**
 * 
 */
export function isBufferPack(candidate: unknown): candidate is BufferPack<never> {
  return candidate != null && candidate.constructor === BufferPack
}
