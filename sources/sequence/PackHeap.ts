import { Comparator, Factory } from '@cedric-demongivert/gl-tool-utils'

import { ReallocableCollection } from '../ReallocableCollection'

import { Sequence } from './Sequence'
import { Pack } from './Pack'
import { Heap } from './Heap'

import { ForwardCursor } from '../cursor'
import { IsCollection } from '../IsCollection'

/**
 * An object that uses a Pack instance as a Heap.
 */
export class PackHeap<Element> implements ReallocableCollection, Heap<Element>, Sequence<Element>
{
  /**
   * The underlying pack instance.
   */
  private _elements: Pack<Element>

  /**
   * The comparison operator used by the heap.
   */
  private _comparator: Comparator<Element, Element>

  /**
   *  
   */
  private readonly _view: Sequence<Element>

  /**
   * Instantiate a new empty heap.
   *
   * @param elements - Pack to use as a heap.
   * @param comparator - A comparator to use for sorting the heap.
   */
  public constructor(elements: Pack<Element>, comparator: Comparator<Element, Element>) {
    this._comparator = comparator
    this._elements = elements
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
  public isPack(): false {
    return false
  }

  /**
   * @see Collection.prototype.isList
   */
  public isList(): false {
    return false
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
   * @see Heap.prototype.next
   */
  public next(): Element {
    const result: Element = this._elements.get(0)
    this.delete(0)
    return result
  }

  /**
   * @see Heap.prototype.push
   */
  public push(value: Element): void {
    this._elements.push(value)
    this.upliftAsPossible(this._elements.size - 1)
  }

  /**
   * Moves the value at the given index up in the tree while it violates the order of the heap.
   *
   * @param index - Index of the value to move up.
   *
   * @returns The new index of the given value.
   */
  private upliftAsPossible(index: number): number {
    const elements: Pack<Element> = this._elements
    const comparator: Comparator<Element, Element> = this._comparator

    let cell: number = index
    let parent: number = (cell - 1) >> 1

    while (cell > 0 && comparator(elements.get(cell), elements.get(parent)) > 0) {
      elements.swap(cell, parent)
      cell = parent
      parent = (cell - 1) >> 1
    }

    return cell
  }

  /**
   * Moves the value at the given index down in the tree while the value violates the order of the heap.
   *
   * @param index - Index of the value to move down.
   *
   * @returns The new index of the given value.
   */
  private diveAsPossible(index: number): number {
    const elements: Pack<Element> = this._elements
    const comparator: Comparator<Element, Element> = this._comparator

    const size: number = elements.size
    let cell: number = index
    let next: number = (cell << 1) + 1

    while (next < size) {
      if (next + 1 < size && comparator(elements.get(cell), elements.get(next + 1)) < 0) {
        if (comparator(elements.get(next), elements.get(next + 1)) < 0) {
          elements.swap(cell, next + 1)
          cell = next + 1
        } else {
          elements.swap(cell, next)
          cell = next
        }
      } else if (comparator(elements.get(cell), elements.get(next)) < 0) {
        elements.swap(cell, next)
        cell = next
      } else {
        break
      }

      next = (cell << 1) + 1
    }

    return cell
  }

  /**
   * @see Heap.prototype.delete
   */
  public delete(index: number): void {
    const size: number = this._elements.size

    this._elements.warp(index)

    if (index < size) {
      this.diveAsPossible(this.upliftAsPossible(index))
    }
  }

  /**
   * @see Heap.prototype.compare
   */
  public compare(left: number, right: number): number {
    const elements: Pack<Element> = this._elements
    return this._comparator(elements.get(left), elements.get(right))
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Element {
    return this._elements.get(index)
  }

  /**
   * @see Sequence.prototype.indexOf
   */
  public indexOf(value: Element): number {
    return this._elements.indexOf(value)
  }

  /**
   * @see Sequence.prototype.hasInSubsequence
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this._elements.hasInSubsequence(element, offset, size)
  }

  /**
   * @see Sequence.prototype.indexOfInSubsequence
   */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    return this._elements.indexOfInSubsequence(element, offset, size)
  }

  /**
   * @see Collection.prototype.has
   */
  public has(value: Element): boolean {
    return this._elements.has(value)
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): Element {
    return this._elements.first
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): Element {
    return this._elements.last
  }

  /**
   * @see Collection.prototype.forward
   */
  public forward(): ForwardCursor<Element> {
    return this._elements.forward()
  }

  /**
   * @see Collection.prototype.size
   */
  public get size(): number {
    return this._elements.size
  }

  /**
   * @see Heap.prototype.comparator
   */
  public get comparator(): Comparator<Element, Element> {
    return this._comparator
  }

  /**
   * @see StaticCollection.prototype.capacity
   */
  public get capacity(): number {
    return this._elements.capacity
  }

  /**
   * @see ReallocableCollection.prototype.reallocate
   */
  public reallocate(capacity: number): void {
    this._elements.reallocate(capacity)
  }

  /**
   * @see ReallocableCollection.prototype.fit
   */
  public fit(): void {
    this._elements.fit()
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): void {
    this._elements.clear()
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): PackHeap<Element> {
    return new PackHeap<Element>(this._elements.clone(), this._comparator)
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): Sequence<Element> {
    return this._view
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof PackHeap) {
      if (this.size !== other.size) return false

      for (let index = 0, size = this.size; index < size; ++index) {
        if (this.get(index) !== other.get(index)) {
          return false
        }
      }

      return true
    }

    return false
  }

  /**
   * @see ReallocableCollection.prototype.values
   */
  public values(): IterableIterator<Element> {
    return this._elements.values()
  }

  /**
   * @see ReallocableCollection.prototype[Symbol.iterator]
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._elements.values()
  }
}

/**
 * 
 */
export namespace PackHeap {
  /**
   * 
   */
  export function any<Element>(capacity: number, defaultValue: Factory<Element>, comparator: Comparator<Element, Element>): PackHeap<Element> {
    return new PackHeap(Pack.any(capacity, defaultValue), comparator)
  }

  /**
   * 
   */
  export function uint8(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
    return new PackHeap<number>(Pack.uint8(capacity), comparator)
  }

  /**
   * 
   */
  export function uint16(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
    return new PackHeap<number>(Pack.uint16(capacity), comparator)
  }

  /**
   * 
   */
  export function uint32(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
    return new PackHeap<number>(Pack.uint32(capacity), comparator)
  }

  /**
   * 
   */
  export function int8(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
    return new PackHeap<number>(Pack.int8(capacity), comparator)
  }

  /**
   * 
   */
  export function int16(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
    return new PackHeap<number>(Pack.int16(capacity), comparator)
  }

  /**
   * 
   */
  export function int32(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
    return new PackHeap<number>(Pack.int32(capacity), comparator)
  }

  /**
   * 
   */
  export function float32(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
    return new PackHeap<number>(Pack.float32(capacity), comparator)
  }

  /**
   * 
   */
  export function float64(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
    return new PackHeap<number>(Pack.float64(capacity), comparator)
  }

  /**
   * 
   */
  export function fromPack<Element>(pack: Pack<Element>, comparator: Comparator<Element, Element>): PackHeap<Element> {
    return new PackHeap<Element>(pack, comparator)
  }
}
