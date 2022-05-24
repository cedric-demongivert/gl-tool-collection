import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { Sequence } from './Sequence'

import { equals } from '../algorithm/equals'
import { quicksort } from '../algorithm/quicksort'

import { Pack } from './Pack'
import { SequenceCursor } from './SequenceCursor'
import { protomark } from '../mark'
import { Collection } from '../Collection'
import { List } from './List'
import { StaticCollection } from '../StaticCollection'
import { ReallocableCollection } from '../ReallocableCollection'

/**
 * An optimized javascript array.
 *
 * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
 */
@protomark(Collection)
@protomark(Sequence)
@protomark(List)
@protomark(Pack)
@protomark(StaticCollection)
@protomark(ReallocableCollection)
export class ArrayPack<Element> implements Pack<Element> {
  /**
   * Wrapped javascript array.
   */
  private _elements: Array<Element>

  /**
   * Number of elements stored.
   */
  private _size: number

  /**
   * 
   */
  private _view: Sequence<Element>

  /**
   * Wrap the given array as a pack.
   *
   * @param elements - A javascript array to wrap.
   * @param [size = elements.length] - Initial number of elements in the array to wrap.
   */
  public constructor(elements: Element[], size: number = elements.length) {
    this._elements = elements
    this._size = size
    this._view = Sequence.view(this)
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
    /**
     * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
     */
    while (value > this._elements.length) {
      this._elements.push(null)
    }

    for (let index = this._size; index < value; ++index) {
      this._elements[index] = null
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
  public defaultValue(): null {
    return null
  }

  /**
   * @see ReallocableCollection.prototype.reallocate
   */
  public reallocate(capacity: number): void {
    if (capacity < this._elements.length) {
      this._elements.length = capacity
      this._size = Math.min(this._size, capacity)
    } else {
      /**
       * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
       */
      while (this._elements.length != capacity) {
        this._elements.push(null)
      }
    }
  }

  /**
   * @see ReallocableCollection.prototype.fit
   */
  public fit(): void {
    this._elements.length = this._size
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Element {
    return this._elements[index]
  }

  /**
   * @see List.prototype.pop
   */
  public pop(): Element {
    const last: number = this._size - 1
    const value: Element = this._elements[last]
    this.delete(last)
    return value
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): Element {
    return this._elements[this._size - 1]
  }

  /**
   * @see Sequence.prototype.lastIndex
   */
  public get lastIndex(): number {
    return Math.max(this._size - 1, 0)
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): Element {
    return this._elements[0]
  }

  /**
   * @see Sequence.prototype.firstIndex
   */
  public get firstIndex(): number {
    return 0
  }

  /**
   * @see List.prototype.fill
   */
  public fill(element: Element): void {
    const elements: Array<Element> = this._elements

    for (let index = 0, size = this._size; index < size; ++index) {
      elements[index] = element
    }
  }

  /**
   * @see List.prototype.shift
   */
  public shift(): Element {
    const value: Element = this._elements[0]
    this.delete(0)
    return value
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
   * @see List.prototype.swap
   */
  public swap(first: number, second: number): void {
    const tmp: Element = this._elements[first]
    this._elements[first] = this._elements[second]
    this._elements[second] = tmp
  }

  /**
   * @see List.prototype.set
   */
  public set(index: number, value: Element): void {
    if (index >= this._size) this.size = index + 1
    this._elements[index] = value
  }

  /**
   * @see List.prototype.setMany
   */
  public setMany(from: number, count: number, value: Element): void {
    const to: number = from + count

    if (to > this._size) {
      this.size = to
    }

    const elements: Array<Element> = this._elements

    for (let cursor = from; cursor < to; ++cursor) {
      elements[cursor] = value
    }
  }

  /**
   * @see List.prototype.insert
   */
  public insert(index: number, value: Element): void {
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
  public push(value: Element): void {
    const index: number = this._size

    this.size += 1
    this._elements[index] = value
  }

  /**
   * @see List.prototype.unshift
   */
  public unshift(value: Element): void {
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
      const elements: Array<Element> = this._elements
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
  public has(element: Element): boolean {
    return this.indexOf(element) >= 0
  }

  /**
   * @see Sequence.prototype.indexOf
   */
  public indexOf(element: Element): number {
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
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this.indexOfInSubsequence(element, offset, size) >= 0
  }

  /**
   * @see Sequence.prototype.indexOfInSubsequence
   */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
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
  public copy(toCopy: Sequence<Element>): void {
    this.size = toCopy.size

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      this.set(index, toCopy.get(index))
    }
  }

  /**
   * @see List.prototype.concat
   */
  public concat(toConcat: Sequence<Element>): void {
    const firstIndex: number = toConcat.firstIndex
    const lastIndex: number = toConcat.lastIndex + 1

    if (this.capacity < this.size + toConcat.size) {
      this.reallocate(this.size + toConcat.size)
    }

    for (let index = firstIndex; index < lastIndex; ++index) {
      this.push(toConcat.get(index))
    }
  }

  /**
   * @see List.prototype.concatArray
   */
  public concatArray(toConcat: Element[]): void {
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
  public allocate(capacity: number): ArrayPack<Element> {
    return ArrayPack.allocate(capacity)
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): ArrayPack<Element> {
    return ArrayPack.copy(this)
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): Sequence<Element> {
    return this._view
  }

  /**
   * @see Markable.prototype.is
   */
  public is = protomark.is

  /**
   * @see Collection.prototype.forward
   */
  public forward(): SequenceCursor<Element> {
    return new SequenceCursor(this, 0)
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): void {
    this._size = 0
  }

  /**
   * @see Collection.prototype.values
   */
  public * values(): IterableIterator<Element> {
    for (let index = 0; index < this._size; ++index) {
      yield this._elements[index]
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

    if (other instanceof ArrayPack) {
      if (other.size !== this._size) return false

      for (let index = 0, size = this._size; index < size; ++index) {
        if (!equals(other.get(index), this._elements[index])) return false
      }

      return true
    }

    return false
  }
}

/**
 * 
 */
export namespace ArrayPack {
  /**
   * Return an empty array pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns An empty array pack of the given capacity.
   */
  export function allocate<Element>(capacity: number): ArrayPack<Element> {
    const result: Element[] = []

    /**
     * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
     */
    while (result.length != capacity) {
      result.push(null)
    }

    return new ArrayPack<Element>(result, 0)
  }

  /**
   * 
   */
  export namespace allocate {
    /**
     * @see ArrayPack.allocate
     */
    export function withDefaultCapacity(capacity: number = 32): ArrayPack<Element> {
      return allocate(capacity)
    }
  }

  /**
   * Wrap an existing array as a pack.
   *
   * @param elements - Array to wrap.
   *
   * @returns The given array wrapped as a pack.
   */
  export function wrap<Element>(elements: Element[]): ArrayPack<Element> {
    return new ArrayPack<Element>(elements)
  }

  /**
   * Return a shallow copy of another pack as an array pack.
   *
   * @param toCopy - A pack to copy.
   *
   * @returns An array pack that is a shallow copy of the given pack.
   */
  export function copy<Element>(toCopy: Pack<Element>): ArrayPack<Element> {
    const result: ArrayPack<Element> = allocate(toCopy.capacity)
    result.copy(toCopy)
    return result
  }
}
