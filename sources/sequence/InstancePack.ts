import { Comparator, Copiable } from '@cedric-demongivert/gl-tool-utils'

import { Duplicator } from '../allocator/Duplicator'

import { Sequence } from '../sequence/Sequence'

import { Pack } from './Pack'
import { Markable, protomark } from '../mark'
import { Collection } from '../Collection'
import { List } from './List'
import { StaticCollection } from '../StaticCollection'
import { ReallocableCollection } from '../ReallocableCollection'
import { SequenceCursor } from './SequenceCursor'

/**
 * @todo Copiable<Element> instead of Copiable
 */

/**
 * A javascript array of pre-allocated instances.
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
  private _elements: Pack<Element>

  /**
   * Duplicator for manipulating object instances.
   */
  public readonly duplicator: Duplicator<Element>

  /**
   * 
   */
  private readonly _view: Sequence<Element>

  /**
   * Makes an empty instance pack of the given capacity.
   *
   * @param duplicator - A duplicator that allows to manipulate the given instance type.
   * @param [capacity = 32] - Initial capacity of the pack.
   */
  public constructor(duplicator: Duplicator<Element>, capacity: number = 32) {
    this.duplicator = duplicator
    this._elements = Pack.any(capacity)
    this._view = Sequence.view(this)
  }

  /**
   * @see Collection.prototype.size
   */
  public get size(): number {
    return this._elements.size
  }

  /**
   * @see List.prototype.size
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
   * @see StaticCollection.prototype.capacity
   */
  public get capacity(): number {
    return this._elements.capacity
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
    while (this._elements.size > capacity) {
      this.duplicator.free(this._elements.pop())
    }

    this._elements.reallocate(capacity)
  }

  /**
   * @see ReallocableCollection.prototype.fit
   */
  public fit(): void {
    this.reallocate(this._elements.size)
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Element {
    return this._elements.get(index)
  }

  /**
   * @see List.prototype.pop
   */
  public pop(): Element
  /**
   * 
   */
  public pop<T extends Copiable>(output: T): T
  /**
   * 
   */
  public pop<T extends Copiable>(output?: T): Element | T {
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
   * @see Sequence.prototype.last
   */
  public get last(): Element {
    return this._elements.last
  }

  /**
   * @see Sequence.prototype.lastIndex
   */
  public get lastIndex(): number {
    return this._elements.lastIndex
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): Element {
    return this._elements.first
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
    const elements: Pack<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = 0, size = elements.size; index < size; ++index) {
      duplicator.free(elements.get(index))
      elements.set(index, duplicator.copy(element))
    }
  }

  /**
   * @see List.prototype.shift
  */
  public shift(): Element
  /**
   * 
   */
  public shift<T extends Copiable>(output: T): T
  /**
   * 
   */
  public shift<T extends Copiable>(output?: T): Element | T {
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
   * @see List.prototype.sort
   */
  public sort(comparator: Comparator<Element, Element>): void {
    this._elements.sort(comparator)
  }

  /**
   * @see List.prototype.subsort
   */
  public subsort(offset: number, size: number, comparator: Comparator<Element, Element>): void {
    this._elements.subsort(offset, size, comparator)
  }

  /**
   * @see List.prototype.swap
   */
  public swap(first: number, second: number): void {
    this._elements.swap(first, second)
  }

  /**
   * @see List.prototype.set
   */
  public set(index: number, value: Element): void {
    if (index >= this._elements.size) {
      this.size = index + 1
    }

    this.duplicator.free(this._elements.get(index))
    this._elements.set(index, this.duplicator.copy(value))
  }

  /**
   * @see List.prototype.setMany
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
   * @see List.prototype.insert
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
   * @see List.prototype.push
   */
  public push(value: Element): void {
    if (this._elements.size === this._elements.capacity) {
      this.reallocate(this.capacity * 2)
    }

    this._elements.push(this.duplicator.copy(value))
  }

  /**
   * @see List.prototype.unshift
   */
  public unshift(value: Element): void {
    if (this._elements.size === this._elements.capacity) {
      this.reallocate(this.capacity * 2)
    }

    this._elements.unshift(this.duplicator.copy(value))
  }

  /**
   * @see List.prototype.delete
   */
  public delete(index: number): void {
    this.duplicator.free(this._elements.get(index))
    this._elements.delete(index)
  }

  /**
   * @see List.prototype.deleteMany
   */
  public deleteMany(from: number, size: number): void {
    for (let index = 0; index < size; ++index) {
      const element: Element = this._elements.get(from + index)
      this.duplicator.free(element)
    }

    this._elements.deleteMany(from, size)
  }

  /**
   * @see List.prototype.warp
   */
  public warp(index: number): void {
    const element: Element = this._elements.get(index)
    this.duplicator.free(element)

    this._elements.warp(index)
  }

  /**
   * @see List.prototype.warpMany
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
   * @see Collection.prototype.has
   */
  public has(element: Element): boolean {
    return this.indexOf(element) >= 0
  }

  /**
   * @see Sequence.prototype.indexOf
   */
  public indexOf(element: Element): number {
    return this._elements.indexOf(element)
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
    return this._elements.indexOfInSubsequence(element, offset, size)
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
  public allocate(capacity: number): InstancePack<Element> {
    return new InstancePack(this.duplicator, capacity)
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): InstancePack<Element> {
    return InstancePack.copy(this)
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
    while (this._elements.size > 0) {
      this.duplicator.free(this._elements.pop())
    }
  }

  /**
   * @see Collection.prototype.values
   */
  public values(): IterableIterator<Element> {
    return this._elements.values()
  }

  /**
   * @see Collection.prototype[Symbol.iterator]
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._elements.values()
  }

  /**
   * @see Comparable.prototype.equals
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
InstancePack.prototype.is = protomark.is

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
   * Return a copy of another instance pack as an instance pack.
   *
   * @param toCopy - A pack to copy.
   *
   * @returns An array pack that is a shallow copy of the given pack.
   */
  export function copy<Element>(toCopy: InstancePack<Element>): InstancePack<Element> {
    const result: InstancePack<Element> = toCopy.allocate(toCopy.capacity)

    result.copy(toCopy)

    return result
  }
}
