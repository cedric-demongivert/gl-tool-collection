import { Comparator, equals, Factory } from '@cedric-demongivert/gl-tool-utils'

import { Duplicator } from '../allocator'
import { quicksort } from '../algorithm'

import type { Pack } from './Pack'

import { Sequence } from './Sequence'
import { SequenceCursor } from './SequenceCursor'
import { ArrayPack } from './ArrayPack'
import { BufferPack } from './BufferPack'
import { InstancePack } from './InstancePack'
import { IsCollection } from '../IsCollection'

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
   * @see Collection.prototype.size
   */
  public get size(): number {
    return this._size
  }

  /**
   * @see Pack.prototype.allocate
   */
  public allocate(capacity: number): CircularPack<Element> {
    return new CircularPack(this._elements.allocate(capacity))
  }

  /**
   * @see List.prototype.size
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
   * @see StaticCollection.prototype.capacity
   */
  public get capacity(): number {
    return this._elements.capacity
  }

  /**
   * @see List.prototype.defaultValue
   */
  public defaultValue(): Element {
    return this._elements.defaultValue()
  }

  /**
   * @see ReallocableCollection.prototype.reallocate
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
      let temporary: Element = elements.get(start)
      let index = (start + safeOffset) % elements.capacity

      while (index != start) {
        const swap: Element = elements.get(index)
        elements.set(index, temporary)
        temporary = swap
        index = (start + safeOffset) % elements.capacity
      }

      elements.set(start, temporary)
    }

    this._start = (this._start + offset) % elements.capacity
  }

  /**
   * @see ReallocableCollection.prototype.fit
   */
  public fit(): void {
    this.reallocate(this._size)
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): Element {
    return this._elements.get(this._start)
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): Element {
    return this._elements.get((this._start + this._size) % this._elements.capacity)
  }

  /**
   * @see Collection.prototype.forward
   */
  public forward(): SequenceCursor<Element> {
    return new SequenceCursor(this, 0)
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Element {
    return this._elements.get((this._start + index) % this._elements.capacity)
  }

  /**
   * @see List.prototype.fill
   */
  public fill(element: Element): void {
    for (let index = 0, size = this._size; index < size; ++index) {
      this.set(index, element)
    }
  }

  /**
   * @see List.prototype.pop
   */
  public pop(): Element {
    const last: number = this._size - 1

    const result: Element = this.get(last)
    this.delete(last)

    return result
  }

  /**
   * @see List.prototype.shift
   */
  public shift(): Element {
    const result: Element = this.get(0)
    this.delete(0)

    return result
  }

  /**
   * @see List.prototype.swap
   */
  public swap(first: number, second: number): void {
    const rfirst: number = (this._start + first) % this._elements.capacity
    const rsecond: number = (this._start + second) % this._elements.capacity

    this._elements.swap(rfirst, rsecond)
  }

  /**
   * @see List.prototype.set
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
   * @see List.prototype.setMany
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
   * @see List.prototype.sort
   */
  public sort(comparator: Comparator<Element, Element>): void {
    quicksort(this, comparator, 0, this._size)
  }

  /**
   * @see List.prototype.subsort
   */
  public subsort(offset: number, size: number, comparator: Comparator<Element, Element>): void {
    quicksort(this, comparator, offset, size)
  }

  /**
   * @see List.prototype.insert
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
        this.set(cursor, this.get(cursor - 1))
      }

      this.set(index, value)
    }
  }

  /**
   * @see List.prototype.push
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
   * @see List.prototype.unshift
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
   * @see List.prototype.delete
   */
  public delete(index: number): void {
    for (let toMove = index; toMove > 0; --toMove) {
      this.set(toMove, this.get(toMove - 1))
    }

    this._start = (this._start + 1) % this._elements.capacity
    this._size -= 1
  }

  /**
   * @see List.prototype.deleteMany
   */
  public deleteMany(from: number, size: number): void {
    const end: number = from + size

    for (let cursor = 0; cursor < from; ++cursor) {
      this.set(end - cursor - 1, this.get(from - cursor - 1))
    }

    this._start = (this._start + size) % this._elements.capacity
    this._size -= size
  }

  /**
   * @see List.prototype.warp
   */
  public warp(index: number): void {
    this.set(index, this.get(0))

    this._start = (this._start + 1) % this._elements.capacity
    this._size -= 1
  }

  /**
   * @see List.prototype.warpMany
   */
  public warpMany(start: number, count: number): void {
    count = Math.min(this._size - start, count)

    for (let index = 0; index < count; ++index) {
      this.set(index + start, this.get(index))
    }

    this._start = (this._start + count) % this._elements.capacity
    this._size -= count
  }

  /**
   * @see Collection.prototype.has
   */
  public has(element: Element): boolean {
    return this.indexOf(element) >= 0
  }

  /**
   * @see Sequence.prototype.indexOf
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
   * @see Sequence.prototype.hasInSubsequence
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this.indexOfInSubsequence(element, offset, size) >= 0
  }

  /**
   * @see Sequence.prototype.indexOfInSubsequence
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
   * @see List.prototype.concat
   */
  public concat(toConcat: Sequence<Element>): void {
    for (let index = 0, size = toConcat.size; index < size; ++index) {
      this.push(toConcat.get(index))
    }
  }

  /**
   * @see List.prototype.concatArray
   */
  public concatArray(toConcat: Element[]): void {
    for (let index = 0, size = toConcat.length; index < size; ++index) {
      this.push(toConcat[index])
    }
  }

  /**
   * @see List.prototype.copy
   */
  public copy(toCopy: Sequence<Element>): void {
    if (toCopy.size > this.capacity) {
      this.reallocate(toCopy.size)
    }

    this.clear()

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      this.push(toCopy.get(index))
    }
  }

  /**
   * @see List.prototype.subCopy
   */
  public subCopy(toCopy: Sequence<Element>, offset: number = 0, size: number = toCopy.size): void {
    if (size > this.capacity) {
      this.reallocate(size)
    }

    this.clear()

    for (let index = 0; index < size; ++index) {
      this.push(toCopy.get(offset + index))
    }
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): CircularPack<Element> {
    return new CircularPack(
      this._elements.clone(),
      this._start,
      this._size
    )
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): Sequence<Element> {
    return this._view
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): void {
    this._start = 0
    this._size = 0
  }

  /**
   * @see Collection.prototype.values
   */
  public * values(): IterableIterator<Element> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._elements.get((this._start + index) % this._elements.capacity)
    }
  }

  /**
   * @see Collection.prototype[Symbol.iterator]
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this.values()
  }

  /**
   * @see Comparable.prototype.equals
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
   * @see Object.prototype.toString
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._elements.constructor.name + ') ' + Sequence.stringify(this)
  }
}

/**
 * 
 */
export namespace CircularPack {
  /**
   * Return a circular buffer that wraps the given pack.
   *
   * @param pack - An existing pack instance to wrap.
   *
   * @returns A circular buffer that wraps the given pack.
   */
  export function fromPack<Element>(pack: Pack<Element>): CircularPack<Element> {
    return new CircularPack<Element>(pack)
  }

  /**
   * Instantiate a new circular buffer that wrap a pack of the given type of instance.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns A new buffer that wrap a pack of the given type of instance.
   */
  export function any<Element>(capacity: number, defaultValue: Factory<Element>): CircularPack<Element> {
    return new CircularPack(ArrayPack.allocate(capacity, defaultValue))
  }

  /**
   * Instantiate a new circular buffer that wrap a unsigned byte pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns A new circular buffer that wrap a unsigned byte pack of the given capacity.
   */
  export function uint8(capacity: number): CircularPack<number> {
    return new CircularPack<number>(BufferPack.uint8(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a unsigned short pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns A new circular buffer that wrap a unsigned short pack of the given capacity.
   */
  export function uint16(capacity: number): CircularPack<number> {
    return new CircularPack<number>(BufferPack.uint16(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a unsigned integer pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns A new circular buffer that wrap a unsigned integer pack of the given capacity.
   */
  export function uint32(capacity: number): CircularPack<number> {
    return new CircularPack<number>(BufferPack.uint32(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a byte pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns A new circular buffer that wrap a byte pack of the given capacity.
   */
  export function int8(capacity: number): CircularPack<number> {
    return new CircularPack<number>(BufferPack.int8(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a short pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns A new circular buffer that wrap a short pack of the given capacity.
   */
  export function int16(capacity: number): CircularPack<number> {
    return new CircularPack<number>(BufferPack.int16(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a integer pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns A new circular buffer that wrap a integer pack of the given capacity.
   */
  export function int32(capacity: number): CircularPack<number> {
    return new CircularPack<number>(BufferPack.int32(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a float pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns A new circular buffer that wrap a float pack of the given capacity.
   */
  export function float32(capacity: number): CircularPack<number> {
    return new CircularPack<number>(BufferPack.float32(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a double pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns A new circular buffer that wrap a double pack of the given capacity.
   */
  export function float64(capacity: number): CircularPack<number> {
    return new CircularPack<number>(BufferPack.float64(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap an instance pack of the given capacity.
   *
   * @param allocator - Capacity of the pack to allocate.
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns A new circular buffer that wrap an instance pack of the given capacity.
   */
  export function instance<Element>(allocator: Duplicator<Element>, capacity: number): CircularPack<Element> {
    return new CircularPack<Element>(InstancePack.allocate(allocator, capacity))
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
  export function unsignedUpTo(maximum: number, capacity: number): CircularPack<number> {
    return new CircularPack<number>(BufferPack.unsignedUpTo(maximum, capacity))
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
  export function signedUpTo(maximum: number, capacity: number): CircularPack<number> {
    return new CircularPack<number>(BufferPack.signedUpTo(maximum, capacity))
  }
}
