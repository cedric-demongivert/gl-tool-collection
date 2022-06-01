import { Comparator, equals, Factory } from '@cedric-demongivert/gl-tool-utils'

import { quicksort } from '../algorithm'
import { Duplicator } from '../allocator'
import { IsCollection } from '../IsCollection'

import type { Pack } from './Pack'

import { Sequence } from './Sequence'
import { SequenceCursor } from './SequenceCursor'


/**
 * An optimized javascript array.
 *
 * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
 */
export class InstancePack<Element> implements Pack<Element> {
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
  public readonly duplicator: Duplicator<Element>

  /**
   * 
   */
  public constructor(duplicator: Duplicator<Element>, capacity: number = 8) {
    this._size = 0
    this._view = Sequence.view(this)
    this.duplicator = duplicator

    const elements: Element[] = []

    while (elements.length < capacity) {
      elements.push(duplicator.allocate())
    }

    this._elements = elements
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
   * @see List.prototype.defaultValue
   */
  public defaultValue(): Element {
    return this.duplicator.allocate()
  }

  /**
   * @see List.prototype.size
   */
  public set size(newSize: number) {
    const elements: Array<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator
    const until: number = newSize < elements.length ? newSize : elements.length

    for (let index = this._size; index < until; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.allocate()
    }

    /**
     * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
     */
    while (elements.length < newSize) {
      elements.push(duplicator.allocate())
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
    const duplicator: Duplicator<Element> = this.duplicator

    /**
     * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
     */
    while (elements.length < capacity) {
      elements.push(duplicator.allocate())
    }

    if (elements.length > capacity) {
      for (let index = capacity; index < elements.length; ++index) {
        duplicator.free(elements[index])
      }

      elements.length = capacity
      this._size = this._size < capacity ? this._size : capacity
    }
  }

  /**
   * @see ReallocableCollection.prototype.fit
   */
  public fit(): void {
    const elements: Element[] = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = this._size; index < elements.length; ++index) {
      duplicator.free(elements[index])
    }

    elements.length = this._size
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
    const elements: Element[] = this._elements

    this._size -= 1

    const result: Element = elements[this._size]
    elements[this._size] = this.duplicator.allocate()

    return result
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
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = 0, size = this._size; index < size; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(element)
    }
  }

  /**
   * @see List.prototype.shift
   */
  public shift(): Element {
    const elements: Element[] = this._elements

    const value: Element = elements[0]
    elements[0] = this.duplicator.allocate()

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
    const duplicator: Duplicator<Element> = this.duplicator
    const afterIndexOrCapacity: number = index < elements.length ? index + 1 : elements.length

    for (let cursor = this._size; cursor < afterIndexOrCapacity; ++cursor) {
      duplicator.free(elements[cursor])
      elements[cursor] = duplicator.allocate()
    }

    while (elements.length <= index) {
      elements.push(duplicator.allocate())
    }

    duplicator.free(elements[index])
    elements[index] = duplicator.copy(value)
    this._size = index < this._size ? this._size : index + 1
  }

  /**
   * @see List.prototype.setMany
   */
  public setMany(from: number, count: number, value: Element): void {
    const to: number = from + count
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    const fromOrCapacity: number = from < elements.length ? from : elements.length

    for (let index = this._size; index < fromOrCapacity; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.allocate()
    }

    const toOrCapacity: number = to < elements.length ? to : elements.length

    for (let index = from; index < toOrCapacity; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(value)
    }

    while (elements.length < from) {
      elements.push(duplicator.allocate())
    }

    while (elements.length < to) {
      elements.push(duplicator.copy(value))
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
    const duplicator: Duplicator<Element> = this.duplicator

    if (elements.length === this._size) {
      elements.push(duplicator.allocate())
    }

    duplicator.free(elements[this._size])

    for (let cursor = this._size; cursor > index; --cursor) {
      elements[cursor] = elements[cursor - 1]
    }

    elements[index] = duplicator.copy(value)

    this._size += 1
  }

  /**
   * @see List.prototype.push
   */
  public push(value: Element): void {
    const index: number = this._size
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    if (index === elements.length) {
      elements.push(duplicator.copy(value))
    } else {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(value)
    }

    this._size += 1
  }

  /**
   * @see List.prototype.unshift
   */
  public unshift(value: Element): void {
    const elements: Array<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    if (this._size === elements.length) {
      elements.push(duplicator.copy(value))
    }

    duplicator.free(elements[this._size])

    for (let index = this._size; index > 0; --index) {
      elements[index] = elements[index - 1]
    }

    elements[0] = duplicator.copy(value)

    this._size += 1
  }

  /**
   * @see List.prototype.delete
   */
  public delete(index: number): void {
    const elements: Array<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    duplicator.free(elements[index])

    for (let cursor = index, size = this._size - 1; cursor < size; ++cursor) {
      elements[cursor] = elements[cursor + 1]
    }

    elements[this._size - 1] = duplicator.allocate()

    this._size -= 1
  }

  /**
   * @see List.prototype.deleteMany
   */
  public deleteMany(from: number, size: number): void {
    const elements: Array<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    const toMove: number = this._size - from - size
    const offset: number = from + size

    for (let cursor = 0; cursor < toMove; ++cursor) {
      duplicator.free(elements[from + cursor])
      elements[from + cursor] = elements[offset + cursor]
      elements[offset + cursor] = duplicator.allocate()
    }

    this._size -= size
  }

  /**
   * @see List.prototype.warp
   */
  public warp(index: number): void {
    const elements: Array<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    duplicator.free(elements[index])
    elements[index] = elements[this._size - 1]
    elements[this._size - 1] = duplicator.allocate()
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
      const duplicator: Duplicator<Element> = this.duplicator
      const toWarp: number = rest > count ? count : rest

      for (let index = 0; index < toWarp; ++index) {
        duplicator.free(elements[from + index])
        elements[from + index] = elements[size - index - 1]
        elements[size - index - 1] = duplicator.allocate()
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
    const duplicator: Duplicator<Element> = this.duplicator
    const toCopySizeOrCapacity: number = toCopy.size < elements.length ? toCopy.size : elements.length

    for (let index = 0; index < toCopySizeOrCapacity; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(toCopy.get(index))
    }

    while (elements.length < toCopy.size) {
      elements.push(duplicator.copy(toCopy.get(elements.length)))
    }

    this._size = toCopy.size
  }

  /**
   * @see List.prototype.subCopy
   */
  public subCopy(toCopy: Sequence<Element>, offset: number = 0, size: number = toCopy.size - offset): void {
    const elements: Array<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator
    const toCopySizeOrCapacity: number = size < elements.length ? size : elements.length

    for (let index = 0; index < toCopySizeOrCapacity; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(toCopy.get(offset + index))
    }

    while (elements.length < toCopy.size) {
      elements.push(duplicator.copy(toCopy.get(offset + elements.length)))
    }

    this._size = size
  }

  /**
   * @see List.prototype.concat
   */
  public concat(toConcat: Sequence<Element>): void {
    const elements: Array<Element> = this._elements
    const offset: number = this._size
    const end: number = offset + toConcat.size
    const endOrCapacity: number = end < elements.length ? end : elements.length
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = offset; index < endOrCapacity; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(toConcat.get(index - offset))
    }

    while (elements.length < end) {
      elements.push(duplicator.copy(toConcat.get(elements.length - offset)))
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
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = this._size; index < endOrCapacity; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(toConcat[index - offset])
    }

    while (elements.length < end) {
      elements.push(duplicator.copy(toConcat[elements.length - offset]))
    }

    this._size = end
  }

  /**
   * @see Pack.prototype.allocate
   */
  public allocate(capacity: number): InstancePack<Element> {
    return InstancePack.allocate(this.duplicator, capacity)
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): InstancePack<Element> {
    return InstancePack.copy(this, this.duplicator)
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

    if (other instanceof InstancePack) {
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
export namespace InstancePack {
  /**
   * 
   */
  export function allocate<Element>(duplicator: Duplicator<Element>, capacity: number): InstancePack<Element> {
    return new InstancePack(duplicator, capacity)
  }

  /**
   * 
   */
  export namespace allocate {
    /**
     * @see InstancePack.allocate
     */
    export function withDefaultCapacity(duplicator: Duplicator<Element>): InstancePack<Element> {
      return allocate(duplicator, 32)
    }
  }

  /**
   * Return a copy of another sequence.
   *
   * @param toCopy - A sequence to copy.
   * @param [capacity=toCopy.size] - Capacity of the copy.
   *
   * @returns A copy of the given sequence with the requested capacity.
   */
  export function copy<Element>(toCopy: Sequence<Element>, duplicator: Duplicator<Element>, capacity: number = toCopy.size): InstancePack<Element> {
    const result: InstancePack<Element> = InstancePack.allocate(duplicator, capacity)
    result.copy(toCopy)
    return result
  }

  /**
   * 
   */
  export function of<Element>(duplicator: Duplicator<Element>, ...elements: Element[]): InstancePack<Element> {
    const result: InstancePack<Element> = InstancePack.allocate(duplicator, elements.length)
    result.concatArray(elements)
    return result
  }

  /**
   * 
   */
  export function ofIterator<Element>(duplicator: Duplicator<Element>, elements: Iterator<Element>, capacity: number = 16): InstancePack<Element> {
    const result: InstancePack<Element> = InstancePack.allocate(duplicator, capacity)

    let iteratorResult = elements.next()

    while (!iteratorResult.done) {
      result.push(iteratorResult.value)
      iteratorResult = elements.next()
    }

    return result
  }
}
