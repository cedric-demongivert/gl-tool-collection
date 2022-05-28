import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { Sequence } from './Sequence'

import { equals } from '../algorithm/equals'
import { quicksort } from '../algorithm/quicksort'

import { Pack } from './Pack'
import { SequenceCursor } from './SequenceCursor'
import { Markable, protomark } from '../mark'
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
  #elements: Array<Element>

  /**
   * Number of elements stored.
   */
  #size: number

  /**
   * 
   */
  #view: Sequence<Element>

  /**
   * Wrap the given array as a pack.
   *
   * @param elements - A javascript array to wrap.
   * @param [size = elements.length] - Initial number of elements in the array to wrap.
   */
  public constructor(elements: Element[], size: number = elements.length) {
    this.#elements = elements
    this.#size = size
    this.#view = Sequence.view(this)
  }

  /**
   * @see Collection.prototype.size
   */
  public get size(): number {
    return this.#size
  }

  /**
   * @see List.prototype.size
   */
  public set size(value: number) {
    /**
     * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
     */
    while (value > this.#elements.length) {
      this.#elements.push(null)
    }

    for (let index = this.#size; index < value; ++index) {
      this.#elements[index] = null
    }

    this.#size = value
  }

  /**
   * @see StaticCollection.prototype.capacity
   */
  public get capacity(): number {
    return this.#elements.length
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
    if (capacity < this.#elements.length) {
      this.#elements.length = capacity
      this.#size = Math.min(this.#size, capacity)
    } else {
      /**
       * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
       */
      while (this.#elements.length != capacity) {
        this.#elements.push(null)
      }
    }
  }

  /**
   * @see ReallocableCollection.prototype.fit
   */
  public fit(): void {
    this.#elements.length = this.#size
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Element {
    return this.#elements[index]
  }

  /**
   * @see List.prototype.pop
   */
  public pop(): Element {
    const last: number = this.#size - 1
    const value: Element = this.#elements[last]
    this.delete(last)
    return value
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): Element {
    return this.#elements[this.#size - 1]
  }

  /**
   * @see Sequence.prototype.lastIndex
   */
  public get lastIndex(): number {
    return Math.max(this.#size - 1, 0)
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): Element {
    return this.#elements[0]
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
    const elements: Array<Element> = this.#elements

    for (let index = 0, size = this.#size; index < size; ++index) {
      elements[index] = element
    }
  }

  /**
   * @see List.prototype.shift
   */
  public shift(): Element {
    const value: Element = this.#elements[0]
    this.delete(0)
    return value
  }

  /**
   * @see List.prototype.sort
   */
  public sort(comparator: Comparator<Element, Element>): void {
    quicksort(this, comparator, 0, this.#size)
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
    const tmp: Element = this.#elements[first]
    this.#elements[first] = this.#elements[second]
    this.#elements[second] = tmp
  }

  /**
   * @see List.prototype.set
   */
  public set(index: number, value: Element): void {
    if (index >= this.#size) this.size = index + 1
    this.#elements[index] = value
  }

  /**
   * @see List.prototype.setMany
   */
  public setMany(from: number, count: number, value: Element): void {
    const to: number = from + count

    if (to > this.#size) {
      this.size = to
    }

    const elements: Array<Element> = this.#elements

    for (let cursor = from; cursor < to; ++cursor) {
      elements[cursor] = value
    }
  }

  /**
   * @see List.prototype.insert
   */
  public insert(index: number, value: Element): void {
    if (index >= this.#size) {
      this.set(index, value)
    } else {
      this.size += 1

      for (let cursor = this.#size - 1; cursor > index; --cursor) {
        this.#elements[cursor] = this.#elements[cursor - 1]
      }

      this.#elements[index] = value
    }
  }

  /**
   * @see List.prototype.push
   */
  public push(value: Element): void {
    const index: number = this.#size

    this.size += 1
    this.#elements[index] = value
  }

  /**
   * @see List.prototype.unshift
   */
  public unshift(value: Element): void {
    this.size += 1

    for (let index = this.#size - 1; index > 0; --index) {
      this.#elements[index] = this.#elements[index - 1]
    }

    this.#elements[0] = value
  }

  /**
   * @see List.prototype.delete
   */
  public delete(index: number): void {
    for (let cursor = index, size = this.#size - 1; cursor < size; ++cursor) {
      this.#elements[cursor] = this.#elements[cursor + 1]
    }

    this.size -= 1
  }

  /**
   * @see List.prototype.deleteMany
   */
  public deleteMany(from: number, size: number): void {
    const toMove: number = this.#size - from - size
    const offset: number = from + size

    for (let cursor = 0; cursor < toMove; ++cursor) {
      this.#elements[from + cursor] = this.#elements[offset + cursor]
    }

    this.size -= size
  }

  /**
   * @see List.prototype.warp
   */
  public warp(index: number): void {
    this.#elements[index] = this.#elements[this.#size - 1]
    this.size -= 1
  }

  /**
   * @see List.prototype.warpMany
   */
  public warpMany(from: number, count: number): void {
    const size: number = this.#size
    const rest: number = size - from - count

    if (rest > 0) {
      const elements: Array<Element> = this.#elements
      const toWarp: number = rest > count ? count : rest

      for (let index = 0; index < toWarp; ++index) {
        elements[from + index] = elements[size - index - 1]
      }
    }

    this.#size -= count
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
    for (let index = 0, length = this.#size; index < length; ++index) {
      if (equals(element, this.#elements[index])) {
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
      if (equals(element, this.#elements[index])) {
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
    return this.#view
  }

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
    this.#size = 0
  }

  /**
   * @see Collection.prototype.values
   */
  public * values(): IterableIterator<Element> {
    for (let index = 0; index < this.#size; ++index) {
      yield this.#elements[index]
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
      if (other.size !== this.#size) return false

      for (let index = 0, size = this.#size; index < size; ++index) {
        if (!equals(other.get(index), this.#elements[index])) return false
      }

      return true
    }

    return false
  }

  /**
   * @see Object.prototype.toString
   */
  public toString(): string {
    return this.constructor.name + ' ' + Sequence.stringify(this)
  }

  /**
   * @see Markable.prototype.is
   */
  public is: Markable.Predicate
}

/**
 * 
 */
ArrayPack.prototype.is = protomark.is

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
    export function withDefaultCapacity(): ArrayPack<Element> {
      return allocate(32)
    }
  }

  /**
   * Wrap an existing array as a pack.
   *
   * @param elements - Array to wrap.
   * @param [size = elements.length] - Number of elements in the array to wrap.
   *
   * @returns The given array wrapped as a pack.
   */
  export function wrap<Element>(elements: Element[], size: number = elements.length): ArrayPack<Element> {
    return new ArrayPack<Element>(elements, size)
  }

  /**
   * Return a copy of another sequence.
   *
   * @param toCopy - A sequence to copy.
   * @param [capacity=toCopy.size] - Capacity of the copy.
   *
   * @returns A copy of the given sequence with the requested capacity.
   */
  export function copy<Element>(toCopy: Sequence<Element>, capacity: number = toCopy.size): ArrayPack<Element> {
    const result: ArrayPack<Element> = ArrayPack.allocate(capacity)
    result.copy(toCopy)
    return result
  }

  /**
   * 
   */
  export function of<Element>(...elements: Element[]): ArrayPack<Element> {
    const result: ArrayPack<Element> = ArrayPack.allocate(elements.length)
    result.concatArray(elements)
    return result
  }

  /**
   * 
   */
  export function ofIterator<Element>(elements: Iterator<Element>, capacity: number = 16): ArrayPack<Element> {
    const result: ArrayPack<Element> = ArrayPack.allocate(capacity)

    let iteratorResult = elements.next()

    while (!iteratorResult.done) {
      result.push(iteratorResult.value)
      iteratorResult = elements.next()
    }

    return result
  }
}
