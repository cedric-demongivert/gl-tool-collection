import { equals } from '../algorithm/equals'
import { Pack } from '../pack/Pack'
import { quicksort } from '../algorithm/quicksort'
import { CircularBuffer } from '../circular/CircularBuffer'
import { CircularBufferIterator } from '../circular/CircularBufferIterator'
import { Sequence } from '../Sequence'
import { Comparator } from '../Comparator'
import { SequenceView } from '../view/SequenceView'

/**
 * An implementation of CircularBuffer over a Pack instance.
 */
export class PackCircularBuffer<Element> implements CircularBuffer<Element>
{
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
  }

  /**
   * @see Collection.size
   */
  public get size(): number {
    return this._size
  }

  /**
   * @see Collection.size
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
   * @see StaticCollection.capacity
   */
  public get capacity(): number {
    return this._elements.capacity
  }

  /**
   * @see List.defaultValue
   */
  public defaultValue(): Element {
    return this._elements.defaultValue()
  }

  /**
   * @see ReallocableCollection.reallocate
   */
  public reallocate(capacity: number): void {
    const next: Pack<Element> = Pack.copy(this._elements)
    next.reallocate(capacity)

    const nextSize: number = Math.min(capacity, this._size)

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
  public fit(): void {
    this.reallocate(this._size)
  }

  /**
   * @see Sequence.first
   */
  public get first(): Element {
    return this._size > 0 ? this._elements.get(this._start) : undefined
  }

  /**
   * @see Sequence.firstIndex
   */
  public get firstIndex(): number {
    return 0
  }

  /**
   * @see Sequence.last
   */
  public get last(): Element {
    return this._size > 0 ? this._elements.get((this._start + this._size) % this._elements.capacity) : undefined
  }

  /**
   * @see Sequence.lastIndex
   */
  public get lastIndex(): number {
    return Math.max(this._size - 1, 0)
  }

  /**
   * @see Collection.iterator
   */
  public iterator(): CircularBufferIterator<Element> {
    const result: CircularBufferIterator<Element> = new CircularBufferIterator()

    result.buffer = this
    result.index = 0

    return result
  }

  /**
   * @see Sequence.get
   */
  public get(index: number): Element {
    return this._elements.get((this._start + index) % this._elements.capacity)
  }

  /**
   * @see List.fill
   */
  public fill(element: Element): void {
    for (let index = 0, size = this._size; index < size; ++index) {
      this.set(index, element)
    }
  }

  /**
   * @see List.pop
   */
  public pop(): Element {
    const last: number = this._size - 1
    const result: Element = this.get(last)

    this.delete(last)

    return result
  }

  /**
   * @see List.shift
   */
  public shift(): Element {
    const result: Element = this.get(0)

    this.delete(0)

    return result
  }

  /**
   * @see List.swap
   */
  public swap(first: number, second: number): void {
    const rfirst: number = (this._start + first) % this._elements.capacity
    const rsecond: number = (this._start + second) % this._elements.capacity

    this._elements.swap(rfirst, rsecond)
  }

  /**
   * @see List.set
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
   * @see List.setMany
   * @TODO
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
   * @see Array.sort
   */
  public sort(comparator: Comparator<Element, Element>): void {
    quicksort(this, comparator, 0, this._size)
  }

  /**
   * @see List.subsort
   */
  public subsort(offset: number, size: number, comparator: Comparator<Element, Element>): void {
    quicksort(this, comparator, offset, size)
  }

  /**
   * @see List.insert
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
   * @see List.push
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
   * @see List.unshift
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
   * @see List.delete
   */
  public delete(index: number): void {
    for (let toMove = index; toMove > 0; --toMove) {
      this.set(toMove, this.get(toMove - 1))
    }

    this._start = (this._start + 1) % this._elements.capacity
    this._size -= 1
  }

  /**
   * @see List.deleteMany
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
   * @see List.warp
   */
  public warp(index: number): void {
    this.set(index, this.get(0))

    this._start = (this._start + 1) % this._elements.capacity
    this._size -= 1
  }

  /**
   * @see List.warpMany
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
   * @see Collection.has
   */
  public has(element: Element): boolean {
    return this.indexOf(element) >= 0
  }

  /**
   * @see Sequence.indexOf
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
   * @see Sequence.hasInSubsequence
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this.indexOfInSubsequence(element, offset, size) >= 0
  }

  /**
   * @see Sequence.indexOfInSubsequence
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
   * @see Sequence.concat
   */
  public concat(toConcat: Sequence<Element>): void {
    const firstIndex: number = toConcat.firstIndex
    const lastIndex: number = toConcat.lastIndex + 1

    for (let index = firstIndex; index < lastIndex; ++index) {
      this.push(toConcat.get(index))
    }
  }

  /**
   * @see Sequence.copy
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
   * @see Sequence.is
   */
  public is(marker: Sequence.MARKER): true
  /**
   * @see CircularBuffer.is
   */
  public is(marker: CircularBuffer.MARKER): true
  /**
   * @see Collection.is
   */
  public is(marker: Symbol): boolean
  public is(marker: Symbol): boolean {
    return marker === CircularBuffer.MARKER || marker === Sequence.MARKER
  }

  /**
   * @see CircularBuffer.clone
   */
  public clone(): PackCircularBuffer<Element> {
    return new PackCircularBuffer(
      this._elements.clone(),
      this._start,
      this._size
    )
  }

  /**
   * @see Collection.view
   */
  public view(): Sequence<Element> {
    return SequenceView.wrap(this)
  }

  /**
   * @see CircularBuffer.clear
   */
  public clear(): void {
    this._start = 0
    this._size = 0
  }

  /**
   * @see Collection.iterator
   */
  public *[Symbol.iterator](): IterableIterator<Element> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._elements.get((this._start + index) % this._elements.capacity)
    }
  }

  /**
   * @see Collection.equals
   */
  public equals(other: any): boolean {
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
  export function copy<Element>(toCopy: PackCircularBuffer<Element>): PackCircularBuffer<Element> {
    return toCopy == null ? null : toCopy.clone()
  }

  /**
   * Instantiate a new circular buffer that wrap a pack of the given type of instance.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return A new buffer that wrap a pack of the given type of instance.
   */
  export function any<T>(capacity: number): PackCircularBuffer<T> {
    return new PackCircularBuffer<T>(Pack.any(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a unsigned byte pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return A new circular buffer that wrap a unsigned byte pack of the given capacity.
   */
  export function uint8(capacity: number): PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.uint8(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a unsigned short pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return A new circular buffer that wrap a unsigned short pack of the given capacity.
   */
  export function uint16(capacity: number): PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.uint16(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a unsigned integer pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return A new circular buffer that wrap a unsigned integer pack of the given capacity.
   */
  export function uint32(capacity: number): PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.uint32(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a byte pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return A new circular buffer that wrap a byte pack of the given capacity.
   */
  export function int8(capacity: number): PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.int8(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a short pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return A new circular buffer that wrap a short pack of the given capacity.
   */
  export function int16(capacity: number): PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.int16(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a integer pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return A new circular buffer that wrap a integer pack of the given capacity.
   */
  export function int32(capacity: number): PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.int32(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a float pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return A new circular buffer that wrap a float pack of the given capacity.
   */
  export function float32(capacity: number): PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.float32(capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a double pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return A new circular buffer that wrap a double pack of the given capacity.
   */
  export function float64(capacity: number): PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.float64(capacity))
  }

  /**
   * Instantiate a new pack that wrap a unsigned integer pack that can store
   * values in range [0, maximum] and that is of the given capacity.
   *
   * @param maximum - Maximum value that can be stored.
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return A new pack that wrap a unsigned integer pack that can store values
   *         in range [0, maximum] and that is of the given capacity.
   */
  export function unsignedUpTo(maximum: number, capacity: number): PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.unsignedUpTo(maximum, capacity))
  }

  /**
   * Instantiate a new circular buffer that wrap a signed integer pack that can store
   * values in range [-maximum, maximum] and that is of the given capacity.
   *
   * @param maximum - Maximum value that can be stored.
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return A new circular buffer that wrap a signed integer pack that can store values
   *         in range [-maximum, maximum] and that is of the given capacity.
   */
  export function signedUpTo(maximum: number, capacity: number): PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.signedUpTo(maximum, capacity))
  }
}
