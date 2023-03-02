import { Comparator, equals } from '@cedric-demongivert/gl-tool-utils'

import { quicksort } from '../algorithm/quicksort'
import { join } from '../algorithm/join'
import { gcd } from '../algorithm/gcd'

import { TypedArray } from '../native/TypedArray'
import { UintArray } from '../native/TypedArray'
import { IntArray } from '../native/TypedArray'
import { allocateSameTypedArray } from '../native/TypedArray'
import { createIntArrayUpTo } from '../native/TypedArray'
import { createUintArrayUpTo } from '../native/TypedArray'

import { Sequence } from '../sequence/Sequence'
import { SequenceCursor } from '../sequence/SequenceCursor'
import { IllegalSequenceIndexError } from '../sequence/error/IllegalSequenceIndexError'
import { NegativeSequenceIndexError } from '../sequence/error/NegativeSequenceIndexError'
import { IllegalSubsequenceError } from '../sequence/error/IllegalSubsequenceError'
import { createSequenceView } from '../sequence/SequenceView'

import { IllegalArgumentsError } from '../error/IllegalArgumentsError'
import { IllegalCallError } from '../error/IllegalCallError'
import { EmptyCollectionError } from '../error/EmptyCollectionError'

import { areEquallyConstructed } from '../areEquallyConstructed'

import { Pack } from './Pack'

/**
 * A wrapper for handling javascript ArrayBuffer instances as gl-tool Packs.
 */
export class BufferPack<Wrapped extends TypedArray> implements Pack<number> {
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
   * @param [size = elements.length] - Initial number of elements in the pack.
   */
  public constructor(elements: Wrapped, size: number = elements.length) {
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

    this._elements = allocateSameTypedArray(old, capacity)
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
  public get(index: number): number {
    if (index < 0 || index >= this._size) {
      throw new IllegalArgumentsError({ index }, new IllegalSequenceIndexError({ value: index, sequence: this }))
    }
    
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
  public get last(): number {
    if (this._size < 1) throw new IllegalCallError('get last', new EmptyCollectionError(this))
    return this._elements[this._size - 1]
  }

  /**
   * @see {@link Pack.first}
   */
  public get first(): number {
    if (this._size < 1) throw new IllegalCallError('get first', new EmptyCollectionError(this))
    return this._elements[0]
  }

  /**
   * @see {@link Pack.pop}
   */
  public pop(): number {
    if (this._size < 1) throw new IllegalCallError(this.pop, new EmptyCollectionError(this))

    const last: number = this._size - 1
    const value: number = this._elements[last]
    this.delete(last)
    return value
  }

  /**
   * @see {@link Pack.shift}
   */
  public shift(): number {
    if (this._size < 1) throw new IllegalCallError(this.shift, new EmptyCollectionError(this))

    const value: number = this._elements[0]
    this.delete(0)
    return value
  }

  /**
   * @see {@link Pack.sort}
   */
  public sort(
    comparator: Comparator<number, number>, 
    startOrEnd: number = 0, 
    endOrStart: number = this.size
  ): void {
    quicksort(this, comparator, startOrEnd, endOrStart)
  }

  /**
   * @see {@link Pack.swap}
   */
  public swap(first: number, second: number): void {
    if (first < 0 || first >= this._size) {
      throw new IllegalArgumentsError({ first }, new IllegalSequenceIndexError({ value: first, sequence: this }))
    }

    if (second < 0 || second >= this._size) {
      throw new IllegalArgumentsError({ second }, new IllegalSequenceIndexError({ value: second, sequence: this }))
    }

    const elements = this._elements

    const tmp: number = elements[first]
    elements[first] = elements[second]
    elements[second] = tmp
  }

  /**
   * @see {@link Pack.set}
   */
  public set(index: number, value: number): void 
  /**
   * @see {@link Pack.set}
   */
  public set(startOrEnd: number, endOrStart: number, value: number): void
  /**
   * 
   */
  public set(startOrEnd: number): void {
    const value: number = arguments.length > 2 ? arguments[2] : arguments[1]
    const endOrStart: number = arguments.length > 2 ? arguments[1] : startOrEnd + 1

    const start: number = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end: number = startOrEnd < endOrStart ? endOrStart : startOrEnd
    
    if (startOrEnd < 0) {
      if (arguments.length > 2) {
        throw new IllegalArgumentsError({ startOrEnd }, new NegativeSequenceIndexError(startOrEnd))
      } else {
        throw new IllegalArgumentsError({ index: startOrEnd }, new NegativeSequenceIndexError(startOrEnd))
      }
    }

    if (endOrStart < 0) {
      throw new IllegalArgumentsError({ endOrStart }, new NegativeSequenceIndexError(endOrStart))
    }

    if (this._elements.length < end) {
      this.reallocate(end)
    }

    const elements = this._elements

    for (let index = this._size; index < start; ++index) {
      elements[index] = 0
    }

    for (let index = start; index < end; ++index) {
      elements[index] = value
    }

    this._size = end < this._size ? this._size : end
  }

  /**
   * @see {@link Pack.stringify}
   */
  public stringify(): string {
    return '[' + join(this) + ']'
  }

  /**
   * @see {@link Pack.insert}
   */
  public insert(index: number, value: number): void {
    if (index < 0) {
      throw new IllegalArgumentsError({ index }, new NegativeSequenceIndexError(index))
    }

    if (index >= this._size) {
      return this.set(index, value)
    } 
    
    this.size += 1

    const elements = this._elements

    for (let cursor = this._size - 1; cursor > index; --cursor) {
      elements[cursor] = elements[cursor - 1]
    }

    elements[index] = value
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

    const elements = this._elements

    for (let index = this._size - 1; index > 0; --index) {
      elements[index] = elements[index - 1]
    }

    elements[0] = value
  }
  
  /**
   * @see {@link Pack.rotate}
   */
  public rotate(offset: number): void {
    const elements = this._elements
    const size = this._size

    let safeOffset: number = offset % size
    if (safeOffset < 0) safeOffset += size

    const roots: number = gcd(size, safeOffset)

    for (let start = 0; start < roots; ++start) {
      let temporary: number = elements[start]
      let index = (start + safeOffset) % size

      while (index != start) {
        const swap: number = elements[index]
        elements[index] = temporary
        temporary = swap
        index = (index + safeOffset) % size
      }

      elements[start] = temporary
    }
  }

  /**
   * @see {@link Pack.unique}
   */
  public unique(
    comparator: Comparator<number, number> = Comparator.compareWithOperator, 
    startOrEnd: number = 0, 
    endOrStart: number = this._size
  ): void {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements = this._elements
    let processedIndex = start

    for (let candidateIndex = start; candidateIndex < end; ++candidateIndex) {
      const candidate = elements[candidateIndex]

      let index = start

      while (index < processedIndex && comparator(candidate, elements[index]) !== 0) {
        ++index
      }

      if (index === processedIndex) {
        elements[processedIndex] = elements[candidateIndex]
        processedIndex += 1
      }
    }

    this.delete(processedIndex, end)
  }

  /**
   * @see {@link Pack.delete}
   */
  public delete(startOrEnd: number, endOrStart: number = startOrEnd + 1): void {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements = this._elements
    const offset: number = end - start

    for (let cursor = end; cursor < size; ++cursor) {
      elements[cursor - offset] = elements[cursor]
    }

    this._size -= offset
  }

  /**
   * @see {@link Pack.warp}
   */
  public warp(startOrEnd: number, endOrStart: number = startOrEnd + 1): void {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements = this._elements
    const toWarp: number = end - start

    for (let index = 0; index < toWarp; ++index) {
      elements[start + index] = elements[size - index - 1]
    }

    this._size -= toWarp
  }


  /**
   * @see {@link Pack.has}
   */
  public has(element: number, startOrEnd: number = 0, endOrStart: number = this.size): boolean {
    return this.indexOf(element, startOrEnd, endOrStart) >= 0
  }

  /**
   * @see {@link Pack.indexOf}
   */
  public indexOf(element: number, startOrEnd: number = 0, endOrStart: number = this.size): number {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements = this._elements

    for (let index = start; index < end; ++index) {
      if (element === elements[index]) {
        return index
      }
    }

    return -1
  }

  /**
   * @see {@link Pack.copy}
   */
  public copy(
    toCopy: Sequence<number>, 
    startOrEnd: number = 0,
    endOrStart: number = toCopy.size
  ): void {
    const toCopySize = toCopy.size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start >= toCopySize || end > toCopySize) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const subsequenceSize: number = end - start

    this.size = subsequenceSize

    const elements = this._elements

    for (let index = 0; index < subsequenceSize; ++index) {
      elements[index] = toCopy.get(start + index)
    }
  }

  /**
   * @see {@link Pack.concat}
   */
  public concat(toConcat: Sequence<number>): void {
    const toConcatSize: number = toConcat.size
    const oldSize = this._size
    const newSize = oldSize + toConcatSize

    this.size = newSize

    const elements = this._elements

    for (let index = oldSize; index < newSize; ++index) {
      elements[index] = toConcat.get(index - oldSize)
    }
  }

  /**
   * @see {@link Pack.concatArray}
   */
  public concatArray(toConcat: number[]): void {
    const toConcatSize: number = toConcat.length
    const oldSize = this._size
    const newSize = oldSize + toConcatSize

    this.size = newSize

    const elements = this._elements

    for (let index = oldSize; index < newSize; ++index) {
      elements[index] = toConcat[index - oldSize]
    }
  }

  /**
   * @see {@link Pack.allocate}
   */
  public allocate(capacity: number): BufferPack<Wrapped> {
    return new BufferPack<Wrapped>(allocateSameTypedArray(this._elements, capacity), 0)
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
    return createSequenceView(this)
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

    if (areEquallyConstructed(other, this)) {
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
    return this.constructor.name + ' (' + this._elements.constructor.name + ') ' + this.stringify()
  }
}

/**
 * 
 */
export function wrapAsBufferPack<Wrapped extends TypedArray>(toWrap: Wrapped, size: number = toWrap.length): BufferPack<Wrapped> {
  return new BufferPack(toWrap, size)
}

/**
 * Instantiate a new pack that wraps an unsigned byte buffer of the given capacity.
 *
 * @param [capacity=32] - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a unsigned byte buffer of the given capacity.
 */
export function createUint8Pack(capacity: number = 32): BufferPack<Uint8Array> {
  return new BufferPack<Uint8Array>(new Uint8Array(capacity), 0)
}

/**
 * Instantiate a new pack that wraps an unsigned short buffer of the given capacity.
 *
 * @param [capacity=32] - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a unsigned short buffer of the given capacity.
 */
export function createUint16Pack(capacity: number = 32): BufferPack<Uint16Array> {
  return new BufferPack<Uint16Array>(new Uint16Array(capacity), 0)
}

/**
 * Instantiate a new pack that wraps an unsigned integer buffer of the given capacity.
 *
 * @param [capacity=32] - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a unsigned integer buffer of the given capacity.
 */
export function createUint32Pack(capacity: number = 32): BufferPack<Uint32Array> {
  return new BufferPack<Uint32Array>(new Uint32Array(capacity), 0)
}

/**
 * Instantiate a new pack that wraps a byte buffer of the given capacity.
 *
 * @param [capacity=32] - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a byte buffer of the given capacity.
 */
export function createInt8Pack(capacity: number = 32): BufferPack<Int8Array> {
  return new BufferPack<Int8Array>(new Int8Array(capacity), 0)
}

/**
 * Instantiate a new pack that wraps a short buffer of the given capacity.
 *
 * @param [capacity=32] - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a short buffer of the given capacity.
 */
export function createInt16Pack(capacity: number = 32): BufferPack<Int16Array> {
  return new BufferPack<Int16Array>(new Int16Array(capacity), 0)
}

/**
 * Instantiate a new pack that wraps an integer buffer of the given capacity.
 *
 * @param [capacity=32] - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a integer buffer of the given capacity.
 */
export function createInt32Pack(capacity: number = 32): BufferPack<Int32Array> {
  return new BufferPack<Int32Array>(new Int32Array(capacity), 0)
}

/**
 * Instantiate a new pack that wraps a float buffer of the given capacity.
 *
 * @param [capacity=32] - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a float buffer of the given capacity.
 */
export function createFloat32Pack(capacity: number = 32): BufferPack<Float32Array> {
  return new BufferPack<Float32Array>(new Float32Array(capacity), 0)
}

/**
 * Instantiate a new pack that wraps a double buffer of the given capacity.
 *
 * @param [capacity=32] - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wrap a double buffer of the given capacity.
 */
export function createFloat64Pack(capacity: number = 32): BufferPack<Float64Array> {
  return new BufferPack<Float64Array>(new Float64Array(capacity), 0)
}

/**
 * Returns a new pack that wraps an UintArray that can store values in range [0, maximum] and that is of the given capacity.
 *
 * @param maximum - Maximum value that can be stored.
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wraps an UintArray that can store values in range [0, maximum] and that is of the given capacity.
 */
export function createUintPackUpTo(maximum: number, capacity: number): BufferPack<UintArray> {
  return new BufferPack(createUintArrayUpTo(maximum, capacity), 0)
}

/**
 * Returns a new pack that wraps an IntArray that can store values in range [-maximum, maximum] and that is of the given capacity.
 *
 * @param maximum - Maximum value that can be stored.
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns A new pack that wraps an IntArray that can store values in range [-maximum, maximum] and that is of the given capacity.
 */
export function createIntPackUpTo(maximum: number, capacity: number): BufferPack<IntArray> {
  return new BufferPack(createIntArrayUpTo(maximum, capacity), 0)
}

/**
 * 
 */
export function createUint8PackFromValues(...values: number[]): BufferPack<Uint8Array> {
  return new BufferPack<Uint8Array>(new Uint8Array(values), values.length)
}

/**
 * 
 */
export function createUint16PackFromValues(...values: number[]): BufferPack<Uint16Array> {
  return new BufferPack<Uint16Array>(new Uint16Array(values), values.length)
}

/**
 * 
 */
export function createUint32PackFromValues(...values: number[]): BufferPack<Uint32Array> {
  return new BufferPack<Uint32Array>(new Uint32Array(values), values.length)
}

/**
 * 
 */
export function createInt8PackFromValues(...values: number[]): BufferPack<Int8Array> {
  return new BufferPack<Int8Array>(new Int8Array(values), values.length)
}

/**
 * 
 */
export function createInt16PackFromValues(...values: number[]): BufferPack<Int16Array> {
  return new BufferPack<Int16Array>(new Int16Array(values), values.length)
}

/**
 *
 */
export function createInt32PackFromValues(...values: number[]): BufferPack<Int32Array> {
  return new BufferPack<Int32Array>(new Int32Array(values), values.length)
}

/**
 * 
 */
export function createFloat32PackFromValues(...values: number[]): BufferPack<Float32Array> {
  return new BufferPack<Float32Array>(new Float32Array(values), values.length)
}

/**
 * 
 */
export function createFloat64PackFromValues(...values: number[]): BufferPack<Float64Array> {
  return new BufferPack<Float64Array>(new Float64Array(values), values.length)
}
