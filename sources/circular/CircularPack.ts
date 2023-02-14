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
import { createUnsignedPackUpTo } from '../pack/BufferPack'
import { createSignedPackUpTo } from '../pack/BufferPack'
import { createInstancePack } from '../pack/InstancePack'

import type { Pack } from '../pack/Pack'

/**
 * 
 */
function gcd(left: number, right: number): number {
  while (right != 0) {
    const nextRight: number = left % right
    left = right
    right = nextRight
  }

  return left
}

/**
 * A sequence that drops the first inserted element when it has to add a new item beyond its capacity.
 */
export class CircularPack<Element> implements Pack<Element> {
  /**
   * The underlying pack used as a circular buffer.
   */
  private _elements: Pack<Element>

  /**
   * The index of the first element of the circular buffer in the underlying pack.
   */
  private _start: number

  /**
   * The number of element into the circular buffer.
   */
  private _size: number

  /**
   * 
   */
  private readonly _view: Sequence<Element>

  /**
   * Create a new circular buffer uppon an existing pack implementation.
   *
   * @param elements - A pack to use for storing this circular buffer elements.
   * @param [offset = 0] - Number of element to skip from the start of the pack.
   * @param [size = elements.size - offset] - Number of element to keep.
   */
  public constructor(elements: Pack<Element>, offset: number = 0, size: number = elements.size - offset) {
    this._elements = elements
    this._elements.size = elements.capacity

    this._start = offset
    this._size = size
    this._view = Sequence.view(this)
  }

  /**
   * @see {@link Collection.size}
   */
  public get size(): number {
    return this._size
  }

  /**
   * @see {@link Pack.allocate}
   */
  public allocate(capacity: number): CircularPack<Element> {
    return new CircularPack(this._elements.allocate(capacity))
  }

  /**
   * @see {@link List.size}
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
   * @see {@link StaticCollection.capacity}
   */
  public get capacity(): number {
    return this._elements.capacity
  }

  /**
   * @see {@link List.defaultValue}
   */
  public defaultValue(): Element {
    return this._elements.defaultValue()
  }

  /**
   * @see {@link ReallocableCollection.reallocate}
   */
  public reallocate(capacity: number): void {
    this.rotate(-this._start)
    this._elements.reallocate(capacity)
    this._size = Math.min(capacity, this._size)
  }

  /**
   * 
   */
  public rotate(offset: number): void {
    const elements: Pack<Element> = this._elements

    let safeOffset: number = offset % elements.capacity
    if (safeOffset < 0) safeOffset += elements.capacity

    const roots: number = gcd(elements.capacity, safeOffset)

    for (let start = 0; start < roots; ++start) {
      let temporary: Element = elements.get(start)!
      let index = (start + safeOffset) % elements.capacity

      while (index != start) {
        const swap: Element = elements.get(index)!
        elements.set(index, temporary)
        temporary = swap
        index = (start + safeOffset) % elements.capacity
      }

      elements.set(start, temporary)
    }

    this._start = (this._start + offset) % elements.capacity
  }

  /**
   * @see {@link ReallocableCollection.fit}
   */
  public fit(): void {
    this.reallocate(this._size)
  }

  /**
   * @see {@link Sequence.first}
   */
  public get first(): Element | undefined {
    return this._elements.get(this._start)
  }

  /**
   * @see {@link Sequence.last}
   */
  public get last(): Element | undefined {
    return this._elements.get((this._start + this._size) % this._elements.capacity)
  }

  /**
   * @see {@link Collection.forward}
   */
  public forward(): SequenceCursor<Element> {
    return new SequenceCursor(this, 0)
  }

  /**
   * @see {@link Sequence.get}
   */
  public get(index: number): Element | undefined {
    return this._elements.get((this._start + index) % this._elements.capacity)
  }

  /**
   * @see {@link List.fill}
   */
  public fill(element: Element): void {
    for (let index = 0, size = this._size; index < size; ++index) {
      this.set(index, element)
    }
  }

  /**
   * @see {@link List.pop}
   */
  public pop(): Element | undefined {
    if (this._size < 1) return undefined

    const last: number = this._size - 1

    const result: Element = this.get(last)!
    this.delete(last)

    return result
  }

  /**
   * @see {@link List.shift}
   */
  public shift(): Element | undefined {
    if (this._size < 1) return undefined

    const result: Element = this.get(0)!
    this.delete(0)

    return result
  }

  /**
   * @see {@link List.swap}
   */
  public swap(first: number, second: number): void {
    const rfirst: number = (this._start + first) % this._elements.capacity
    const rsecond: number = (this._start + second) % this._elements.capacity

    this._elements.swap(rfirst, rsecond)
  }

  /**
   * @see {@link List.set}
   */
  public set(index: number, value: Element): void {
    if (index >= this._elements.capacity) {
      const offset: number = Math.min(index - this._elements.capacity + 1, this._size)

      this._start = (this._start + offset) % this._elements.capacity
      this._size -= offset
      index = this._elements.capacity - 1
    }

    while (index >= this._size) {
      this.push(this._elements.defaultValue())
    }

    this._elements.set((this._start + index) % this._elements.capacity, value)
  }

  /**
   * @see {@link List.setMany}
   */
  public setMany(start: number, count: number, value: Element): void {
    let until: number = start + count - 1

    if (until >= this._elements.capacity) {
      const offset: number = Math.min(until - this._elements.capacity + 1, this._size)

      this._start = (this._start + offset) % this._elements.capacity
      this._size -= offset
      start = this._elements.capacity - 1
    }

    while (start >= this._size) {
      this.push(this._elements.defaultValue())
    }

    until = start + count
    const offset: number = this._start

    for (let index = start; index < until; ++index) {
      this._elements.set((offset + index) % this._elements.capacity, value)
    }
  }

  /**
   * @see {@link List.sort}
   */
  public sort(comparator: Comparator<Element, Element>): void {
    quicksort(this, comparator, 0, this._size)
  }

  /**
   * @see {@link List.subsort}
   */
  public subsort(offset: number, size: number, comparator: Comparator<Element, Element>): void {
    quicksort(this, comparator, offset, size)
  }

  /**
   * @see {@link List.insert}
   */
  public insert(index: number, value: Element): void {
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
        this.set(cursor, this.get(cursor - 1)!)
      }

      this.set(index, value)
    }
  }

  /**
   * @see {@link List.push}
   */
  public push(value: Element): void {
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
   * @see {@link List.unshift}
   */
  public unshift(value: Element): void {
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
   * @see {@link List.delete}
   */
  public delete(index: number): void {
    for (let toMove = index; toMove > 0; --toMove) {
      this.set(toMove, this.get(toMove - 1)!)
    }

    this._start = (this._start + 1) % this._elements.capacity
    this._size -= 1
  }

  /**
   * @see {@link List.deleteMany}
   */
  public deleteMany(from: number, size: number): void {
    const end: number = from + size

    for (let cursor = 0; cursor < from; ++cursor) {
      this.set(end - cursor - 1, this.get(from - cursor - 1)!)
    }

    this._start = (this._start + size) % this._elements.capacity
    this._size -= size
  }

  /**
   * @see {@link List.warp}
   */
  public warp(index: number): void {
    this.set(index, this.get(0)!)

    this._start = (this._start + 1) % this._elements.capacity
    this._size -= 1
  }

  /**
   * @see {@link List.warpMany}
   */
  public warpMany(start: number, count: number): void {
    count = Math.min(this._size - start, count)

    for (let index = 0; index < count; ++index) {
      this.set(index + start, this.get(index)!)
    }

    this._start = (this._start + count) % this._elements.capacity
    this._size -= count
  }

  /**
   * @see {@link Collection.has}
   */
  public has(element: Element): boolean {
    return this.indexOf(element) >= 0
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: Element): number {
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
   * @see {@link Sequence.hasInSubsequence}
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this.indexOfInSubsequence(element, offset, size) >= 0
  }

  /**
   * @see {@link Sequence.indexOfInSubsequence}
   */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    for (let index = offset, length = offset + size; index < length; ++index) {
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
   * @see {@link List.concat}
   */
  public concat(toConcat: Sequence<Element>): void {
    for (let index = 0, size = toConcat.size; index < size; ++index) {
      this.push(toConcat.get(index)!)
    }
  }

  /**
   * @see {@link List.concatArray}
   */
  public concatArray(toConcat: Element[]): void {
    for (let index = 0, size = toConcat.length; index < size; ++index) {
      this.push(toConcat[index])
    }
  }

  /**
   * @see {@link List.copy}
   */
  public copy(toCopy: Sequence<Element>): void {
    if (toCopy.size > this.capacity) {
      this.reallocate(toCopy.size)
    }

    this.clear()

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      this.push(toCopy.get(index)!)
    }
  }

  /**
   * @see {@link List.subCopy}
   */
  public subCopy(toCopy: Sequence<Element>, offset: number = 0, size: number = toCopy.size - offset): void {
    if (size > this.capacity) {
      this.reallocate(size)
    }

    this.clear()

    for (let index = 0; index < size; ++index) {
      this.push(toCopy.get(offset + index)!)
    }
  }

  /**
   * @see {@link Clonable.clone}
   */
  public clone(): CircularPack<Element> {
    return new CircularPack(
      this._elements.clone(),
      this._start,
      this._size
    )
  }

  /**
   * @see {@link Pack.stringify}
   */
  public stringify(): string {
    return Sequence.stringify(this)
  }

  /**
   * @see {@link Collection.view}
   */
  public view(): Sequence<Element> {
    return this._view
  }

  /**
   * @see {@link Clearable.clear}
   */
  public clear(): void {
    this._start = 0
    this._size = 0
  }

  /**
   * @see {@link Collection.values}
   */
  public * values(): IterableIterator<Element> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._elements.get((this._start + index) % this._elements.capacity)!
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

    if (other instanceof CircularPack) {
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
    return this.constructor.name + ' (' + this._elements.constructor.name + ') ' + Sequence.stringify(this)
  }
}

/**
 * Return a circular buffer that wraps the given pack.
 *
 * @param pack - An existing pack instance to wrap.
 *
 * @returns A circular buffer that wraps the given pack.
 */
export function asCircularPack<Element>(pack: Pack<Element>): CircularPack<Element> {
  return new CircularPack<Element>(pack)
}

/**
 * Instantiate a new circular buffer that wrap a pack of the given type of instance.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new buffer that wrap a pack of the given type of instance.
 */
export function createArrayCircularPack<Element>(capacity: number, defaultValue: Factory<Element>): CircularPack<Element> {
  return new CircularPack(createArrayPack(capacity, defaultValue))
}

/**
 * Instantiate a new circular buffer that wrap a unsigned byte pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular buffer that wrap a unsigned byte pack of the given capacity.
 */
export function createUint8CircularPack(capacity: number): CircularPack<number> {
  return new CircularPack<number>(createUint8Pack(capacity))
}

/**
 * Instantiate a new circular buffer that wrap a unsigned short pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular buffer that wrap a unsigned short pack of the given capacity.
 */
export function createUint16CircularPack(capacity: number): CircularPack<number> {
  return new CircularPack<number>(createUint16Pack(capacity))
}

/**
 * Instantiate a new circular buffer that wrap a unsigned integer pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular buffer that wrap a unsigned integer pack of the given capacity.
 */
export function createUint32CircularPack(capacity: number): CircularPack<number> {
  return new CircularPack<number>(createUint32Pack(capacity))
}

/**
 * Instantiate a new circular buffer that wrap a byte pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular buffer that wrap a byte pack of the given capacity.
 */
export function createInt8CircularPack(capacity: number): CircularPack<number> {
  return new CircularPack<number>(createInt8Pack(capacity))
}

/**
 * Instantiate a new circular buffer that wrap a short pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular buffer that wrap a short pack of the given capacity.
 */
export function createInt16CircularPack(capacity: number): CircularPack<number> {
  return new CircularPack<number>(createInt16Pack(capacity))
}

/**
 * Instantiate a new circular buffer that wrap a integer pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular buffer that wrap a integer pack of the given capacity.
 */
export function createInt32CircularPack(capacity: number): CircularPack<number> {
  return new CircularPack<number>(createInt32Pack(capacity))
}

/**
 * Instantiate a new circular buffer that wrap a float pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular buffer that wrap a float pack of the given capacity.
 */
export function createFloat32CircularPack(capacity: number): CircularPack<number> {
  return new CircularPack<number>(createFloat32Pack(capacity))
}

/**
 * Instantiate a new circular buffer that wrap a double pack of the given capacity.
 *
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular buffer that wrap a double pack of the given capacity.
 */
export function createFloat64CircularPack(capacity: number): CircularPack<number> {
  return new CircularPack<number>(createFloat64Pack(capacity))
}

/**
 * Instantiate a new circular buffer that wrap an instance pack of the given capacity.
 *
 * @param allocator - Capacity of the pack to allocate.
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular buffer that wrap an instance pack of the given capacity.
 */
export function createInstanceCircularPack<Element>(allocator: Duplicator<Element>, capacity: number): CircularPack<Element> {
  return new CircularPack<Element>(createInstancePack(allocator, capacity))
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
export function createUnsignedCircularPackUpTo(maximum: number, capacity: number): CircularPack<number> {
  return new CircularPack<number>(createUnsignedPackUpTo(maximum, capacity))
}

/**
 * Instantiate a new circular buffer that wrap a signed integer pack that can store
 * values in range [-maximum, maximum] and that is of the given capacity.
 *
 * @param maximum - Maximum value that can be stored.
 * @param capacity - Capacity of the pack to allocate.
 *
 * @returns A new circular buffer that wrap a signed integer pack that can store values
 *         in range [-maximum, maximum] and that is of the given capacity.
 */
export function createSignedCircularPackUpTo(maximum: number, capacity: number): CircularPack<number> {
  return new CircularPack<number>(createSignedPackUpTo(maximum, capacity))
}
