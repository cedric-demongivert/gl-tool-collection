import { Comparator, equals, Factory } from '@cedric-demongivert/gl-tool-utils'

import { Duplicator } from '../allocator/Duplicator'
import { quicksort } from '../algorithm/quicksort'


import { Sequence } from '../sequence/Sequence'
import { SequenceCursor } from '../sequence/SequenceCursor'
import { createArrayPack } from '../pack/ArrayPack'
import { createUint8Pack } from '../pack/BufferPack'
import { createUint16Pack } from '../pack/BufferPack'
import { createUint32Pack } from '../pack/BufferPack'
import { createInt8Pack } from '../pack/BufferPack'
import { createInt16Pack } from '../pack/BufferPack'
import { createInt32Pack } from '../pack/BufferPack'
import { createFloat32Pack } from '../pack/BufferPack'
import { createFloat64Pack } from '../pack/BufferPack'
import { createUintPackUpTo } from '../pack/BufferPack'
import { createIntPackUpTo } from '../pack/BufferPack'
import { createInstancePack } from '../pack/InstancePack'

import type { Pack } from '../pack/Pack'


import { CircularPack } from './CircularPack'
import { IllegalCallError } from '../error/IllegalCallError'
import { EmptyCollectionError } from '../error/EmptyCollectionError'
import { IllegalArgumentsError } from '../error/IllegalArgumentsError'
import { IllegalSequenceIndexError } from '../sequence/error/IllegalSequenceIndexError'
import { IllegalSubsequenceError } from '../sequence/error/IllegalSubsequenceError'
import { join } from '../algorithm/join'
import { createSequenceView } from '../sequence/SequenceView'
import { NegativeSequenceIndexError } from '../sequence/error/NegativeSequenceIndexError'


/**
 * A sequence that drops the first inserted element when it has to add a new item beyond its capacity.
 */
export class CircularPackAdapter<Element> implements CircularPack<Element> {
  /**
   * The underlying pack used as a circular pack.
   */
  private _elements: Pack<Element>

  /**
   * The index of the first element of the circular pack in the underlying pack (inclusive).
   */
  private _start: number

  /**
   * The number of element into the circular pack.
   */
  private _size: number

  /**
   * Wraps an existing pack as a new circular pack.
   *
   * @param elements - A pack to use for storing this circular pack elements.
   * @param [start = 0] - Index of the first element of the circular pack in the underlying pack (inclusive).
   * @param [size = elements.size] - Number of element into the circular pack.
   */
  public constructor(elements: Pack<Element>, start: number = 0, size: number = elements.size) {
    this._elements = elements
    this._elements.size = elements.capacity

    this._start = start
    this._size = size
  }

  /**
   * @see {@link CircularPack.size}
   */
  public get size(): number {
    return this._size
  }

  /**
   * @see {@link CircularPack.allocate}
   */
  public allocate(capacity: number): CircularPackAdapter<Element> {
    return new CircularPackAdapter(this._elements.allocate(capacity), 0, 0)
  }

  /**
   * @see {@link CircularPack.size}
   */
  public set size(newSize: number) {
    const elements: Pack<Element> = this._elements

    if (this.capacity < newSize) {
      this.reallocate(newSize)
    }

    if (newSize > this._size) {
      const start: number = this._start
      const capacity: number = elements.capacity

      for (let index: number = this._size; index < newSize; ++index) {
        elements.set((start + index) % capacity, elements.defaultValue())
      }
    }

    this._size = newSize
  }

  /**
   * @see {@link CircularPack.capacity}
   */
  public get capacity(): number {
    return this._elements.capacity
  }

  /**
   * @see {@link CircularPack.defaultValue}
   */
  public defaultValue(): Element {
    return this._elements.defaultValue()
  }

  /**
   * @see {@link CircularPack.reallocate}
   */
  public reallocate(capacity: number): void {
    const elements = this._elements

    if (this._size > capacity) {
      elements.rotate(-this._start - (capacity - this._size))
      this._size = capacity
    } else {
      elements.rotate(-this._start)
    }

    elements.reallocate(capacity)
    elements.size = capacity
  }

  /**
   * @see {@link CircularPack.fit}
   */
  public fit(): void {
    const elements = this._elements
    elements.rotate(-this._start)
    elements.reallocate(this._size)
    elements.size = this._size
  }

  /**
   * @see {@link CircularPack.first}
   */
  public get first(): Element {
    if (this._size < 1) throw new IllegalCallError('get first', new EmptyCollectionError(this))
    return this._elements.get(this._start)
  }

  /**
   * @see {@link CircularPack.last}
   */
  public get last(): Element {
    if (this._size < 1) throw new IllegalCallError('get last', new EmptyCollectionError(this))

    const elements = this._elements
    return elements.get((this._start + this._size - 1) % elements.capacity)
  }

  /**
   * @see {@link CircularPack.forward}
   */
  public forward(): SequenceCursor<Element> {
    return new SequenceCursor(this, 0)
  }

  /**
   * @see {@link CircularPack.get}
   */
  public get(index: number): Element {
    if (index < 0 || index >= this._size) throw new IllegalArgumentsError({ index }, new IllegalSequenceIndexError({ value: index, sequence: this }))

    const elements = this._elements
    return elements.get((this._start + index) % elements.capacity)
  }

  /**
   * @see {@link CircularPack.fill}
   */
  public fill(element: Element): void {
    const elements = this._elements
    const start = this._start
    const capacity = elements.capacity
    const end = (start + this._size) % capacity

    if (start < end) {
      for (let index = start; index < end; ++index) {
        elements.set(index, element)
      }
    } else {
      for (let index = 0; index < end; ++index) {
        elements.set(index, element)
      }
  
      for (let index = start; index < capacity; ++index) {
        elements.set(index, element)
      }
    }    
  }

  /**
   * @see {@link CircularPack.pop}
   */
  public pop(): Element {
    if (this._size < 1) throw new IllegalCallError(this.pop, new EmptyCollectionError(this))

    const last: number = this._size - 1

    const result: Element = this.get(last)
    this.delete(last)

    return result
  }

  /**
   * @see {@link CircularPack.shift}
   */
  public shift(): Element {
    if (this._size < 1) throw new IllegalCallError(this.shift, new EmptyCollectionError(this))

    const result: Element = this.get(0)
    this.delete(0)

    return result
  }

  /**
   * @see {@link CircularPack.swap}
   */
  public swap(first: number, second: number): void {
    if (first < 0 || first >= this._size) {
      throw new IllegalArgumentsError({ first }, new IllegalSequenceIndexError({ value: first, sequence: this }))
    }

    if (second < 0 || second >= this._size) {
      throw new IllegalArgumentsError({ second }, new IllegalSequenceIndexError({ value: second, sequence: this }))
    }

    const rfirst: number = (this._start + first) % this._elements.capacity
    const rsecond: number = (this._start + second) % this._elements.capacity

    this._elements.swap(rfirst, rsecond)
  }

  /**
   * @see {@link CircularPack.set}
   */
  public set(index: number, value: Element): void 
  /**
   * @see {@link CircularPack.set}
   */
  public set(startOrEnd: number, endOrStart: number, value: Element): void
  /**
   * 
   */
  public set(startOrEnd: number): void {
    const value: Element = arguments.length > 2 ? arguments[2] : arguments[1]
    const endOrStart: number = arguments.length > 2 ? arguments[1] : startOrEnd + 1

    let start: number = startOrEnd < endOrStart ? startOrEnd : endOrStart
    let end: number = startOrEnd < endOrStart ? endOrStart : startOrEnd
    
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

    const oldCapacity = this._elements.capacity

    if (end > oldCapacity) {
      this.reallocate(end)
    }

    const elements = this._elements
    const capacity = elements.capacity
    const offset = this._start

    for (let index = this._size; index < start; ++index) {
      elements.set((offset + index) % capacity, elements.defaultValue())
    }

    for (let index = start; index < end; ++index) {
      elements.set((offset + index) % capacity, value)
    }

    this._size = end > this._size ? end : this._size
  }

  /**
   * @see {@link CircularPack.sort}
   */
  public sort(
    comparator: Comparator<Element, Element>, 
    startOrEnd: number = 0, 
    endOrStart: number = this.size
  ): void {
    quicksort(this, comparator, startOrEnd, endOrStart)
  }

  

  /**
   * @see {@link CircularPack.insert}
   */
  public insert(index: number, value: Element): void {
    if (index >= this._size) {
      return this.set(index, value)
    } 

    if (this._size == this._elements.capacity) {
      this.shift()
      --index;
    }

    const elements = this._elements
    const capacity = elements.capacity
    const offset = this._start

    for (let cursor = this._size - 1; cursor >= index; --cursor) {
      elements.set((cursor + 1 + offset) % capacity, elements.get((cursor + offset) % capacity))
    }

    elements.set((index + offset) % capacity, value)
    this._size += 1
  }

  /**
   * @see {@link CircularPack.push}
   */
  public push(value: Element): void {
    const elements = this._elements

    if (this._size < elements.capacity) {
      elements.set(
        (this._start + this._size) % elements.capacity,
        value
      )
      this._size += 1
    } else {
      elements.set(this._start, value)
      this._start = (this._start + 1) % elements.capacity
    }
  }

  /**
   * @see {@link CircularPack.unshift}
   */
  public unshift(value: Element): void {
    const elements = this._elements

    this._start -= 1

    if (this._start < 0) {
      this._start += elements.capacity
    }

    elements.set(this._start, value)

    if (this._size < elements.capacity) {
      this._size += 1
    }
  }

  /**
   * @see {@link CircularPack.delete}
   */
  public delete(startOrEnd: number, endOrStart: number = startOrEnd + 1): void {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const offset = end - start

    for (let cursor = end; cursor < size; ++cursor) {
      this.set(cursor - offset, this.get(cursor))
    }

    this._size -= offset
  }

  /**
   * @see {@link CircularPack.warp}
   */
  public warp(startOrEnd: number, endOrStart: number = startOrEnd + 1): void {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    let count = end - start

    for (let index = 0; index < count; ++index) {
      
      this.set(index + start, this.get(index))
    }

    this._start = (this._start + count) % this._elements.capacity
    this._size -= count
  }

  /**
   * @see {@link CircularPack.has}
   */
  public has(element: Element, startOrEnd: number = 0, endOrStart: number = this.size): boolean {
    return this.indexOf(element, startOrEnd, endOrStart) >= 0
  }

  /**
   * @see {@link CircularPack.indexOf}
   */
  public indexOf(element: Element, startOrEnd: number = 0, endOrStart: number = this.size): number {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements = this._elements

    for (let index = start; index < end; ++index) {
      if (elements.get((this._start + index) % elements.capacity) == element) { 
        return index 
      }
    }

    return -1
  }

  /**
   * @see {@link Pack.search}
   */
  public search<Key>(key: Key, comparator: Comparator<Key, Element>, startOrEnd: number = 0, endOrStart: number = this.size): number {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements = this._elements

    for (let index = start; index < end; ++index) {
      if (comparator(key, elements.get((this._start + index) % elements.capacity)) === 0) { 
        return index 
      }
    }

    return -1
  }

  /**
   * @see {@link CircularPack.pushSequence}
   */
  public pushSequence(toConcat: Sequence<Element>): void {
    for (let index = 0, size = toConcat.size; index < size; ++index) {
      this.push(toConcat.get(index))
    }
  }

  /**
   * @see {@link CircularPack.pushArray}
   */
  public pushArray(toConcat: Element[]): void {
    for (let index = 0, size = toConcat.length; index < size; ++index) {
      this.push(toConcat[index])
    }
  }

  /**
   * @see {@link CircularPack.pushSequence}
   */
  public unshiftSequence(toConcat: Sequence<Element>): void {
    for (let index = 0, size = toConcat.size; index < size; ++index) {
      this.unshift(toConcat.get(size - index - 1))
    }
  }

  /**
   * @see {@link CircularPack.pushArray}
   */
  public unshiftArray(toConcat: Element[]): void {
    for (let index = 0, size = toConcat.length; index < size; ++index) {
      this.unshift(toConcat[size - index - 1])
    }
  }

  /**
   * @see {@link CircularPack.copy}
   */
  public copy(toCopy: Sequence<Element>, startOrEnd: number = 0, endOrStart: number = toCopy.size): void {
    const toCopySize = toCopy.size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start >= toCopySize || end > toCopySize) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const size = end - start

    if (size > this.capacity) {
      this.reallocate(size)

    }

    this.clear()

    for (let index = 0; index < size; ++index) {
      this.push(toCopy.get(start + index))
    }
  }

  /**
   * @see {@link CircularPack.clone}
   */
  public clone(): CircularPackAdapter<Element> {
    return new CircularPackAdapter(
      this._elements.clone(),
      this._start,
      this._size
    )
  }

  /**
   * @see {@link CircularPack.stringify}
   */
  public stringify(): string {
    return '[' + join(this) + ']'
  }

  /**
   * @see {@link CircularPack.view}
   */
  public view(): Sequence<Element> {
    return createSequenceView(this)
  }

  /**
   * @see {@link CircularPack.clear}
   */
  public clear(): void {
    this._start = 0
    this._size = 0
  }

  /**
   * @see {@link CircularPack.values}
   */
  public * values(): IterableIterator<Element> {
    const elements = this._elements

    for (let index = 0, length = this._size; index < length; ++index) {
      yield elements.get((this._start + index) % elements.capacity)
    }
  }

  /**
   * @see {@link Collection[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this.values()
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof CircularPackAdapter) {
      if (other.size !== this._size) return false

      for (let index = 0, size = this._size; index < size; ++index) {
        if (!equals(other.get(index), this.get(index))) return false
      }

      return true
    }

    return false
  }

  /**
   * @see {@link Object.toString}
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._elements.constructor.name + ') ' + this.stringify()
  }
}

/**
 * Return a circular pack that wraps the given pack.
 *
 * @param pack - An existing pack instance to wrap.
 *
 * @returns A circular pack that wraps the given pack.
 */
export function asCircularPackAdapter<Element>(pack: Pack<Element>): CircularPackAdapter<Element> {
  return new CircularPackAdapter<Element>(pack)
}

/**
 * Instantiate a new circular pack that wrap a pack of the given type of instance.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new buffer that wrap a pack of the given type of instance.
 */
export function createArrayCircularPackAdapter<Element>(defaultValue: Factory<Element>, capacity: number): CircularPackAdapter<Element> {
  return new CircularPackAdapter(createArrayPack(defaultValue, capacity))
}

/**
 * Instantiate a new circular pack that wrap a unsigned byte pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular pack that wrap a unsigned byte pack of the given capacity.
 */
export function createUint8CircularPackAdapter(capacity: number): CircularPackAdapter<number> {
  return new CircularPackAdapter<number>(createUint8Pack(capacity))
}

/**
 * Instantiate a new circular pack that wrap a unsigned short pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular pack that wrap a unsigned short pack of the given capacity.
 */
export function createUint16CircularPackAdapter(capacity: number): CircularPackAdapter<number> {
  return new CircularPackAdapter<number>(createUint16Pack(capacity))
}

/**
 * Instantiate a new circular pack that wrap a unsigned integer pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular pack that wrap a unsigned integer pack of the given capacity.
 */
export function createUint32CircularPackAdapter(capacity: number): CircularPackAdapter<number> {
  return new CircularPackAdapter<number>(createUint32Pack(capacity))
}

/**
 * Instantiate a new circular pack that wrap a byte pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular pack that wrap a byte pack of the given capacity.
 */
export function createInt8CircularPackAdapter(capacity: number): CircularPackAdapter<number> {
  return new CircularPackAdapter<number>(createInt8Pack(capacity))
}

/**
 * Instantiate a new circular pack that wrap a short pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular pack that wrap a short pack of the given capacity.
 */
export function createInt16CircularPackAdapter(capacity: number): CircularPackAdapter<number> {
  return new CircularPackAdapter<number>(createInt16Pack(capacity))
}

/**
 * Instantiate a new circular pack that wrap a integer pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular pack that wrap a integer pack of the given capacity.
 */
export function createInt32CircularPackAdapter(capacity: number): CircularPackAdapter<number> {
  return new CircularPackAdapter<number>(createInt32Pack(capacity))
}

/**
 * Instantiate a new circular pack that wrap a float pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular pack that wrap a float pack of the given capacity.
 */
export function createFloat32CircularPackAdapter(capacity: number): CircularPackAdapter<number> {
  return new CircularPackAdapter<number>(createFloat32Pack(capacity))
}

/**
 * Instantiate a new circular pack that wrap a double pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular pack that wrap a double pack of the given capacity.
 */
export function createFloat64CircularPackAdapter(capacity: number): CircularPackAdapter<number> {
  return new CircularPackAdapter<number>(createFloat64Pack(capacity))
}

/**
 * Instantiate a new circular pack that wrap an instance pack of the given capacity.
 *
 * @param allocator - Capacity of the pack to allocate.
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular pack that wrap an instance pack of the given capacity.
 */
export function createInstanceCircularPackAdapter<Element>(allocator: Duplicator<Element>, capacity: number): CircularPackAdapter<Element> {
  return new CircularPackAdapter<Element>(createInstancePack(allocator, capacity))
}

/**
 * Instantiate a new pack that wrap a unsigned integer pack that can store
 * values in range [0, maximum] and that is of the given capacity.
 *
 * @param maximum - Maximum value that can be stored.
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new pack that wrap a unsigned integer pack that can store values
 *         in range [0, maximum] and that is of the given capacity.
 */
export function createUnsignedCircularPackAdapterUpTo(maximum: number, capacity: number): CircularPackAdapter<number> {
  return new CircularPackAdapter<number>(createUintPackUpTo(maximum, capacity))
}

/**
 * Instantiate a new circular pack that wrap a signed integer pack that can store
 * values in range [-maximum, maximum] and that is of the given capacity.
 *
 * @param maximum - Maximum value that can be stored.
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular pack that wrap a signed integer pack that can store values
 *         in range [-maximum, maximum] and that is of the given capacity.
 */
export function createSignedCircularPackAdapterUpTo(maximum: number, capacity: number): CircularPackAdapter<number> {
  return new CircularPackAdapter<number>(createIntPackUpTo(maximum, capacity))
}
