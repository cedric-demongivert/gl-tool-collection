import { Duplicator } from '../allocator/Duplicator'

import { Comparator } from '../Comparator'
import { Copiable } from '../Copiable'
import { Sequence } from '../sequence/Sequence'

import { SequenceView } from '../view/SequenceView'

import { PackIterator } from './PackIterator'
import { Pack } from './Pack'

/**
 * A javascript array of pre-allocated instances.
 *
 * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
 */
export class InstancePack<Element> implements Pack<Element> {
  /**
   * Wrapped javascript array.
   */
  private _elements: Pack<Element>

  /**
   * Duplicator for manipulating object instances.
   */
  public readonly duplicator: Duplicator<Element>

  /**
   * Makes an empty instance pack of the given capacity.
   *
   * @param duplicator - A duplicator that allows to manipulate the given instance type.
   * @param [capacity = 32] - Initial capacity of the pack.
   */
  public constructor(duplicator: Duplicator<Element>, capacity: number = 32) {
    this.duplicator = duplicator
    this._elements = Pack.any(capacity)
  }

  /**
   * @see Collection.size
   */
  public get size(): number {
    return this._elements.size
  }

  /**
   * @see List.size
   */
  public set size(value: number) {
    /**
    * @see https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M
    */
    while (this._elements.size < value) {
      this._elements.push(this.duplicator.allocate())
    }

    while (this._elements.size > value) {
      this.duplicator.free(this._elements.pop())
    }
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
    return this.duplicator.allocate()
  }

  /**
   * @see ReallocableCollection.reallocate
   */
  public reallocate(capacity: number): void {
    while (this._elements.size > capacity) {
      this.duplicator.free(this._elements.pop())
    }

    this._elements.reallocate(capacity)
  }

  /**
   * @see ReallocableCollection.fit
   */
  public fit(): void {
    this.reallocate(this._elements.size)
  }

  /**
   * @see Sequence.get
   */
  public get(index: number): Element {
    return this._elements.get(index)
  }

  /**
   * @see List.pop
   */
  public pop(): Element
  /**
   * 
   */
  public pop<T extends Copiable<Element>>(output: T): T
  /**
   * 
   */
  public pop<T extends Copiable<Element>>(output?: T): Element | T {
    if (output == undefined) {
      return this._elements.pop()
    } else {
      const result: Element = this._elements.pop()
      output.copy(result)
      this.duplicator.free(result)
      return output
    }
  }

  /**
   * @see Sequence.last
   */
  public get last(): Element {
    return this._elements.last
  }

  /**
   * @see Sequence.lastIndex
   */
  public get lastIndex(): number {
    return this._elements.lastIndex
  }

  /**
   * @see Sequence.first
   */
  public get first(): Element {
    return this._elements.first
  }

  /**
   * @see Sequence.firstIndex
   */
  public get firstIndex(): number {
    return 0
  }

  /**
   * @see List.fill
   */
  public fill(element: Element): void {
    const elements: Pack<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = 0, size = elements.size; index < size; ++index) {
      duplicator.free(elements.get(index))
      elements.set(index, duplicator.copy(element))
    }
  }

  /**
   * @see List.shift
  */
  public shift(): Element
  /**
   * 
   */
  public shift<T extends Copiable<Element>>(output: T): T
  /**
   * 
   */
  public shift<T extends Copiable<Element>>(output?: T): Element | T {
    if (output == undefined) {
      return this._elements.shift()
    } else {
      const result: Element = this._elements.shift()
      output.copy(result)
      this.duplicator.free(result)
      return output
    }
  }

  /**
   * @see Pack.sort
   */
  public sort(comparator: Comparator<Element, Element>): void {
    this._elements.sort(comparator)
  }

  /**
   * @see Pack.subsort
   */
  public subsort(offset: number, size: number, comparator: Comparator<Element, Element>): void {
    this._elements.subsort(offset, size, comparator)
  }

  /**
   * @see List.swap
   */
  public swap(first: number, second: number): void {
    this._elements.swap(first, second)
  }

  /**
   * @see List.set
   */
  public set(index: number, value: Element): void {
    if (index >= this._elements.size) {
      this.size = index + 1
    }

    this.duplicator.free(this._elements.get(index))
    this._elements.set(index, this.duplicator.copy(value))
  }

  /**
   * @see List.setMany
   */
  public setMany(from: number, count: number, value: Element): void {
    const elements: Pack<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    if (from + count > elements.size) {
      this.size = from + count
    }

    for (let index = from, until = from + count; index < until; ++index) {
      duplicator.free(elements.get(index))
      elements.set(index, duplicator.copy(value))
    }
  }

  /**
   * @see List.insert
   */
  public insert(index: number, value: Element): void {
    if (index >= this._elements.size) {
      this.set(index, value)
    } else {
      if (this._elements.size === this._elements.capacity) {
        this.reallocate(this.capacity * 2)
      }

      this._elements.insert(index, this.duplicator.copy(value))
    }
  }

  /**
   * @see List.push
   */
  public push(value: Element): void {
    if (this._elements.size === this._elements.capacity) {
      this.reallocate(this.capacity * 2)
    }

    this._elements.push(this.duplicator.copy(value))
  }

  /**
   * @see List.unshift
   */
  public unshift(value: Element): void {
    if (this._elements.size === this._elements.capacity) {
      this.reallocate(this.capacity * 2)
    }

    this._elements.unshift(this.duplicator.copy(value))
  }

  /**
   * @see List.delete
   */
  public delete(index: number): void {
    this.duplicator.free(this._elements.get(index))
    this._elements.delete(index)
  }

  /**
   * @see List.deleteMany
   */
  public deleteMany(from: number, size: number): void {
    for (let index = 0; index < size; ++index) {
      const element: Element = this._elements.get(from + index)
      this.duplicator.free(element)
    }

    this._elements.deleteMany(from, size)
  }

  /**
   * @see List.warp
   */
  public warp(index: number): void {
    const element: Element = this._elements.get(index)
    this.duplicator.free(element)

    this._elements.warp(index)
  }

  /**
   * @see List.warpMany
   */
  public warpMany(from: number, count: number): void {
    const elements: Pack<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = from, until = from + count; index < until; ++index) {
      const element: Element = elements.get(index)
      duplicator.free(element)
    }

    elements.warpMany(from, count)
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
    return this._elements.indexOf(element)
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
    return this._elements.indexOfInSubsequence(element, offset, size)
  }

  /**
   * @see Pack.copy
   */
  public copy(toCopy: Sequence<Element>): void {
    this.size = toCopy.size

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      this.set(index, toCopy.get(index))
    }
  }

  /**
   * @see Sequence.concat
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
   * @see Sequence.is
   */
  public is(marker: Sequence.MARKER): true
  /**
   * @see Pack.is
   */
  public is(marker: Pack.MARKER): true
  /**
   * @see Collection.is
   */
  public is(marker: Symbol): boolean
  public is(marker: Symbol): boolean {
    return marker === Pack.MARKER || marker === Sequence.MARKER
  }

  /**
   * @see Pack.allocate
   */
  public allocate(capacity: number): InstancePack<Element> {
    return new InstancePack(this.duplicator, capacity)
  }

  /**
   * @see Pack.clone
   */
  public clone(): InstancePack<Element> {
    return InstancePack.copy(this)
  }

  /**
   * @see Collection.view
   */
  public view(): Sequence<Element> {
    return SequenceView.wrap(this)
  }

  /**
   * @see Collection.iterator
   */
  public iterator(): PackIterator<Element> {
    const result: PackIterator<Element> = new PackIterator()

    result.pack = this
    result.index = 0

    return result
  }

  /**
   * @see List.clear
   */
  public clear(): void {
    while (this._elements.size > 0) {
      this.duplicator.free(this._elements.pop())
    }
  }

  /**
   * @see Sequence.iterator
   */
  public *[Symbol.iterator](): IterableIterator<Element> {
    yield* this._elements
  }

  /**
   * @see Collection.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof InstancePack) {
      return (
        this.duplicator === other.duplicator &&
        this._elements.equals(other._elements)
      )
    }

    return false
  }
}

export namespace InstancePack {
  /**
   * Return an empty array pack of the given capacity.
   *
   * @param capacity - Capacity of the pack to allocate.
   *
   * @return An empty array pack of the given capacity.
   */
  export function allocate<Element>(duplicator: Duplicator<Element>, capacity: number): InstancePack<Element> {
    return new InstancePack<Element>(duplicator, capacity)
  }

  /**
   * Return a copy of another instance pack as an instance pack.
   *
   * @param toCopy - A pack to copy.
   *
   * @return An array pack that is a shallow copy of the given pack.
   */
  export function copy<Element>(toCopy: InstancePack<Element>): InstancePack<Element> {
    const result: InstancePack<Element> = toCopy.allocate(toCopy.capacity)

    result.copy(toCopy)

    return result
  }
}
