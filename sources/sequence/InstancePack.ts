import { Assignable, Comparator, equals } from '@cedric-demongivert/gl-tool-utils'
import { Duplicator } from '../allocator/Duplicator'
import { quicksort } from '../algorithm/quicksort'
import { Mark, protomark } from '../mark'

import { Sequence } from './Sequence'

import { StaticCollection } from '../StaticCollection'
import { ReallocableCollection } from '../ReallocableCollection'
import { Collection } from '../Collection'

import { Pack } from './Pack'
import { SequenceCursor } from './SequenceCursor'
import { List } from './List'

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
export class InstancePack<Element> implements Pack<Element> {
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
  private readonly _view: Sequence<Element>

  /**
   * 
   */
  public readonly duplicator: Duplicator<Element>

  /**
   * 
   */
  public constructor(duplicator: Duplicator<Element>, capacity: number = 0) {
    this._elements = []
    this._size = 0
    this._view = Sequence.view(this)
    this.duplicator = duplicator
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
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Element[] = this._elements

    /**
     * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
     */
    while (value > this._elements.length) {
      elements.push(duplicator.allocate())
    }

    for (let index = this._size; index < value; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.allocate()
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
  public defaultValue(): Element {
    return this.duplicator.allocate()
  }

  /**
   * @see ReallocableCollection.prototype.reallocate
   */
  public reallocate(capacity: number): void {
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Element[] = this._elements

    if (capacity < this._elements.length) {
      for (let index = capacity; index < elements.length; ++index) {
        duplicator.free(elements[index])
      }

      elements.length = capacity
      this._size = Math.min(this._size, capacity)
    } else {
      /**
       * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
       */
      while (elements.length != capacity) {
        elements.push(duplicator.allocate())
      }
    }
  }

  /**
   * @see ReallocableCollection.prototype.fit
   */
  public fit(): void {
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Element[] = this._elements

    for (let index = this._size; index < elements.length; ++index) {
      duplicator.free(elements[index])
    }

    elements.length = this._size
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Element | undefined {
    return this._elements[index]
  }

  /**
   * @see List.prototype.pop
   */
  public pop(): Element | undefined {
    if (this._size < 1) return undefined

    const last: number = this._size - 1
    const elements: Element[] = this._elements

    const result: Element | undefined = elements[last]
    elements[last] = this.duplicator.allocate()

    this._size -= 1

    return result
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): Element | undefined {
    return this._elements[this._size - 1]
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): Element | undefined {
    return this._elements[0]
  }

  /**
   * @see List.prototype.fill
   */
  public fill(element: Element): void {
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    for (let index = 0, size = this._size; index < size; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(element)
    }
  }

  /**
   * @see List.prototype.shift
   */
  public shift(): Element | undefined {
    const elements: Array<Element> = this._elements

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

    const tmp: Element | null = elements[first]
    elements[first] = elements[second]
    elements[second] = tmp
  }

  /**
   * @see List.prototype.set
   */
  public set(index: number, value: Element): void {
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    if (index >= this._size) this.size = index + 1

    duplicator.free(elements[index])
    elements[index] = duplicator.copy(value)
  }

  /**
   * @see List.prototype.setMany
   */
  public setMany(from: number, count: number, value: Element): void {
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    const to: number = from + count

    if (to > this._size) {
      this.size = to
    }

    for (let cursor = from; cursor < to; ++cursor) {
      duplicator.free(elements[cursor])
      elements[cursor] = duplicator.copy(value)
    }
  }

  /**
   * @see List.prototype.insert
   */
  public insert(index: number, value: Element): void {
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    if (index >= this._size) {
      this.set(index, value)
    } else {
      this.size += 1

      duplicator.free(elements[this._size - 1])

      for (let cursor = this._size - 1; cursor > index; --cursor) {
        elements[cursor] = elements[cursor - 1]
      }

      elements[index] = duplicator.copy(value)
    }
  }

  /**
   * @see List.prototype.push
   */
  public push(value: Element): void {
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    const index: number = this._size

    this.size += 1

    duplicator.free(elements[index])
    elements[index] = duplicator.copy(value)
  }

  /**
   * @see List.prototype.unshift
   */
  public unshift(value: Element): void {
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    this.size += 1

    duplicator.free(elements[this._size - 1])

    for (let index = this._size - 1; index > 0; --index) {
      elements[index] = elements[index - 1]
    }

    elements[0] = duplicator.copy(value)
  }

  /**
   * @see List.prototype.delete
   */
  public delete(index: number): void {
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    duplicator.free(elements[index])

    for (let cursor = index, size = this._size - 1; cursor < size; ++cursor) {
      elements[cursor] = elements[cursor + 1]
    }

    elements[this._size - 1] = duplicator.allocate()

    this.size -= 1
  }

  /**
   * @see List.prototype.deleteMany
   */
  public deleteMany(from: number, size: number): void {
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    const toMove: number = this._size - from - size
    const offset: number = from + size

    for (let cursor = 0; cursor < size; ++cursor) {
      duplicator.free(elements[from + cursor])
    }

    for (let cursor = 0; cursor < toMove; ++cursor) {
      elements[from + cursor] = elements[offset + cursor]
    }

    for (let cursor = 0; cursor < size; ++cursor) {
      elements[this.size - cursor - 1] = duplicator.allocate()
    }

    this.size -= size
  }

  /**
   * @see List.prototype.warp
   */
  public warp(index: number): void {
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

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
      const duplicator: Duplicator<Element> = this.duplicator
      const elements: Array<Element> = this._elements
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
    for (let index = 0, length = this._size; index < length; ++index) {
      if (equals(element, this._elements[index])) {
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
      if (equals(element, this._elements[index])) {
        return index
      }
    }

    return -1
  }

  /**
   * @see List.prototype.copy
   */
  public copy(toCopy: Sequence<Element>): void {
    this.size = toCopy.size

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      this.set(index, toCopy.get(index)!)
    }
  }

  /**
   * @see List.prototype.concat
   */
  public concat(toConcat: Sequence<Element>): void {
    const toConcatSize: number = toConcat.size

    if (this.capacity < this.size + toConcatSize) {
      this.reallocate(this.size + toConcatSize)
    }

    for (let index = 0; index < toConcatSize; ++index) {
      this.push(toConcat.get(index)!)
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
  public allocate(capacity: number): InstancePack<Element> {
    return InstancePack.allocate(this.duplicator, capacity)
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): InstancePack<Element> {
    const result: InstancePack<Element> = new InstancePack(this.duplicator, this.capacity)
    const elements: Element[] = this._elements

    for (let index = 0; index < elements.length; ++index) {
      result.push(elements[index])
    }

    return result
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

  /**
   * @see Markable.prototype.is
   */
  public is(markLike: Mark.Alike): boolean {
    return protomark.is(this.constructor, markLike)
  }
}

/**
 * 
 */
export namespace InstancePack {
  /**
   * Return an empty array pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @returns An empty array pack of the given capacity.
   */
  export function allocate<Element>(duplicator: Duplicator<Element>, capacity: number): InstancePack<Element> {
    return new InstancePack<Element>(duplicator, capacity)
  }

  /**
   * 
   */
  export namespace allocate {
    /**
     * @see InstancePack.allocate
     */
    export function withDefaultCapacity(duplicator: Duplicator<Element>): InstancePack<Element> {
      return new InstancePack<Element>(duplicator, 32)
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
  export function copy<Element>(toCopy: InstancePack<Element>, capacity: number = toCopy.capacity): InstancePack<Element> {
    const result: InstancePack<Element> = InstancePack.allocate(toCopy.duplicator, capacity)
    result.copy(toCopy)
    return result
  }
}
