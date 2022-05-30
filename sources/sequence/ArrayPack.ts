import { Comparator, equals, Factory } from '@cedric-demongivert/gl-tool-utils'

import { quicksort } from '../algorithm'
import { Collection } from '../Collection'

import type { Pack } from './Pack'

import { Sequence } from './Sequence'
import { SequenceCursor } from './SequenceCursor'


/**
 * An optimized javascript array.
 *
 * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
 */
export class ArrayPack<Element> implements Pack<Element> {
  /**
   * Wrapped javascript array.
   */
  private readonly _elements: Array<Element>

  /**
   * Number of elements stored.
   */
  private _size: number

  /**
   * 
   */
  private readonly _view: Sequence<Element>

  /**
   * 
   */
  public readonly defaultValue: Factory<Element>

  /**
   * Wrap the given array as a pack.
   *
   * @param elements - A javascript array to wrap.
   * @param defaultFactory - A factory of filling elements.
   * @param [size = elements.length] - Initial number of elements in the array to wrap.
   */
  public constructor(elements: Array<Element>, defaultValue: Factory<Element>, size: number = elements.length) {
    this._elements = elements
    this._size = size
    this._view = Sequence.view(this)
    this.defaultValue = defaultValue
  }

  /**
   * @see Collection.prototype[Collection.IS]
   */
  public [Collection.IS](): true {
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
   * @see List.prototype.size
   */
  public set size(newSize: number) {
    const elements: Array<Element> = this._elements
    const defaultValue: Factory<Element> = this.defaultValue
    const until: number = newSize < elements.length ? newSize : elements.length

    for (let index = this._size; index < until; ++index) {
      elements[index] = defaultValue()
    }

    /**
     * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
     */
    while (elements.length < newSize) {
      elements.push(defaultValue())
    }

    this._size = newSize
  }

  /**
   * @see StaticCollection.prototype.capacity
   */
  public get capacity(): number {
    return this._elements.length
  }

  /**
   * @see ReallocableCollection.prototype.reallocate
   */
  public reallocate(capacity: number): void {
    const elements: Array<Element> = this._elements
    const defaultValue: Factory<Element> = this.defaultValue

    /**
     * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
     */
    while (elements.length < capacity) {
      elements.push(defaultValue())
    }

    if (elements.length > capacity) {
      elements.length = capacity
      this._size = this._size < capacity ? this._size : capacity
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
    this._size -= 1
    return this._elements[this._size]
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): Element {
    return this._elements[this._size - 1]
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): Element {
    return this._elements[0]
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
    const elements: Array<Element> = this._elements

    const swap: Element = elements[first]
    elements[first] = elements[second]
    elements[second] = swap
  }

  /**
   * @see List.prototype.set
   */
  public set(index: number, value: Element): void {
    const elements: Array<Element> = this._elements
    const defaultValue: Factory<Element> = this.defaultValue
    const afterIndexOrCapacity: number = index < elements.length ? index + 1 : elements.length

    for (let cursor = this._size; cursor < afterIndexOrCapacity; ++cursor) {
      elements[cursor] = defaultValue()
    }

    while (elements.length <= index) {
      elements.push(defaultValue())
    }

    elements[index] = value
    this._size = index < this._size ? this._size : index + 1
  }

  /**
   * @see List.prototype.setMany
   */
  public setMany(from: number, count: number, value: Element): void {
    const to: number = from + count
    const defaultValue: Factory<Element> = this.defaultValue
    const elements: Array<Element> = this._elements

    const fromOrCapacity: number = from < elements.length ? from : elements.length

    for (let index = this._size; index < fromOrCapacity; ++index) {
      elements[index] = defaultValue()
    }

    const toOrCapacity: number = to < elements.length ? to : elements.length

    for (let index = from; index < toOrCapacity; ++index) {
      elements[index] = value
    }

    while (elements.length < from) {
      elements.push(defaultValue())
    }

    while (elements.length < to) {
      elements.push(value)
    }

    this._size = to < this._size ? this._size : to
  }

  /**
   * @see List.prototype.insert
   */
  public insert(index: number, value: Element): void {
    if (index >= this._size) {
      return this.set(index, value)
    }

    const elements: Array<Element> = this._elements
    const defaultValue: Factory<Element> = this.defaultValue

    if (elements.length === this._size) {
      elements.push(defaultValue())
    }

    for (let cursor = this._size; cursor > index; --cursor) {
      elements[cursor] = elements[cursor - 1]
    }

    elements[index] = value

    this._size += 1
  }

  /**
   * @see List.prototype.push
   */
  public push(value: Element): void {
    const index: number = this._size
    const elements: Array<Element> = this._elements

    if (index === elements.length) {
      elements.push(value)
    } else {
      elements[index] = value
    }

    this._size += 1
  }

  /**
   * @see List.prototype.unshift
   */
  public unshift(value: Element): void {
    const elements: Array<Element> = this._elements

    if (this._size === elements.length) {
      elements.push(value)
    }

    for (let index = this._size; index > 0; --index) {
      elements[index] = elements[index - 1]
    }

    elements[0] = value

    this._size += 1
  }

  /**
   * @see List.prototype.delete
   */
  public delete(index: number): void {
    const elements: Array<Element> = this._elements

    for (let cursor = index, size = this._size - 1; cursor < size; ++cursor) {
      elements[cursor] = elements[cursor + 1]
    }

    this._size -= 1
  }

  /**
   * @see List.prototype.deleteMany
   */
  public deleteMany(from: number, size: number): void {
    const elements: Array<Element> = this._elements

    const toMove: number = this._size - from - size
    const offset: number = from + size

    for (let cursor = 0; cursor < toMove; ++cursor) {
      elements[from + cursor] = elements[offset + cursor]
    }

    this._size -= size
  }

  /**
   * @see List.prototype.warp
   */
  public warp(index: number): void {
    const elements: Array<Element> = this._elements

    elements[index] = elements[this._size - 1]
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
    const elements: Array<Element> = this._elements

    for (let index = 0, length = this._size; index < length; ++index) {
      if (equals(element, elements[index])) {
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
    const elements: Array<Element> = this._elements

    for (let index = offset, length = offset + size; index < length; ++index) {
      if (equals(element, elements[index])) {
        return index
      }
    }

    return -1
  }

  /**
   * @see List.prototype.copy
   */
  public copy(toCopy: Sequence<Element>): void {
    const elements: Array<Element> = this._elements
    const toCopySizeOrCapacity: number = toCopy.size < elements.length ? toCopy.size : elements.length

    for (let index = 0; index < toCopySizeOrCapacity; ++index) {
      elements[index] = toCopy.get(index)
    }

    while (elements.length < toCopy.size) {
      elements.push(toCopy.get(elements.length))
    }

    this._size = toCopy.size
  }

  /**
   * @see List.prototype.concat
   */
  public concat(toConcat: Sequence<Element>): void {
    const elements: Array<Element> = this._elements
    const offset: number = this._size
    const end: number = offset + toConcat.size
    const endOrCapacity: number = end < elements.length ? end : elements.length

    for (let index = offset; index < endOrCapacity; ++index) {
      elements[index] = toConcat.get(index - offset)
    }

    while (elements.length < end) {
      elements.push(toConcat.get(elements.length - offset))
    }

    this._size = end
  }

  /**
   * @see List.prototype.concatArray
   */
  public concatArray(toConcat: Array<Element>): void {
    const elements: Array<Element> = this._elements
    const offset: number = this._size
    const end: number = offset + toConcat.length
    const endOrCapacity: number = end < elements.length ? end : elements.length

    for (let index = this._size; index < endOrCapacity; ++index) {
      elements[index] = toConcat[index - offset]
    }

    while (elements.length < end) {
      elements.push(toConcat[elements.length - offset])
    }

    this._size = end
  }

  /**
   * @see Pack.prototype.allocate
   */
  public allocate(capacity: number): ArrayPack<Element> {
    return ArrayPack.allocate(capacity, this.defaultValue)
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): ArrayPack<Element> {
    return ArrayPack.copy(this, this.defaultValue)
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): Sequence<Element> {
    return this._view
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
  public equals(other: unknown): boolean {
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

  /**
   * @see Object.prototype.toString
   */
  public toString(): string {
    return this.constructor.name + ' ' + Sequence.stringify(this)
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
   * @param defaultValue - The default value to use.
   *
   * @returns An empty array pack of the given capacity.
   */
  export function allocate<Element>(capacity: number, defaultValue: Factory<Element>): ArrayPack<Element> {
    const result: Array<Element> = []

    /**
     * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
     */
    while (result.length != capacity) {
      result.push(defaultValue())
    }

    return new ArrayPack(result, defaultValue, 0)
  }

  /**
   * 
   */
  export namespace allocate {
    /**
     * @see ArrayPack.allocate
     */
    export function withDefaultCapacity(defaultValue: Factory<Element>): ArrayPack<Element> {
      return allocate(32, defaultValue)
    }
  }

  /**
   * Wrap an existing array as a pack.
   *
   * @param elements - Array to wrap.
   * @param defaultValue - The default value to use.
   * @param [size = elements.length] - Number of elements in the array to wrap.
   *
   * @returns The given array wrapped as a pack.
   */
  export function wrap<Element>(elements: Element[], defaultValue: Factory<Element>, size: number = elements.length): ArrayPack<Element> {
    return new ArrayPack<Element>(elements, defaultValue, size)
  }

  /**
   * Return a copy of another sequence.
   *
   * @param toCopy - A sequence to copy.
   * @param [capacity=toCopy.size] - Capacity of the copy.
   *
   * @returns A copy of the given sequence with the requested capacity.
   */
  export function copy<Element>(toCopy: Sequence<Element>, defaultValue: Factory<Element>, capacity: number = toCopy.size): ArrayPack<Element> {
    const result: ArrayPack<Element> = ArrayPack.allocate(capacity, defaultValue)
    result.copy(toCopy)
    return result
  }

  /**
   * 
   */
  export function of<Element>(defaultValue: Factory<Element>, ...elements: Element[]): ArrayPack<Element> {
    const result: ArrayPack<Element> = ArrayPack.allocate(elements.length, defaultValue)
    result.concatArray(elements)
    return result
  }

  /**
   * 
   */
  export function ofIterator<Element>(defaultValue: Factory<Element>, elements: Iterator<Element>, capacity: number = 16): ArrayPack<Element> {
    const result: ArrayPack<Element> = ArrayPack.allocate(capacity, defaultValue)

    let iteratorResult = elements.next()

    while (!iteratorResult.done) {
      result.push(iteratorResult.value)
      iteratorResult = elements.next()
    }

    return result
  }
}
