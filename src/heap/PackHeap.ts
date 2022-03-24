import { ReallocableCollection } from '../ReallocableCollection'
import { Comparator } from '../Comparator'
import { Sequence } from '../Sequence'

import { Pack } from '../pack/Pack'
import { BidirectionalIterator } from '../iterator/BidirectionalIterator'
import { SequenceView } from '../view/SequenceView'

import { Heap } from './Heap'

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
   * Instantiate a new empty heap.
   *
   * @param elements - Pack to use as a heap.
   * @param comparator - A comparator to use for sorting the heap.
   */
  public constructor(elements: Pack<Element>, comparator: Comparator<Element, Element>) {
    this._comparator = comparator
    this._elements = elements
  }

  /**
   * @see Heap.next
   */
  public next(): Element {
    const result: Element = this._elements.get(0)
    this.delete(0)
    return result
  }

  /**
   * @see Heap.add
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
   * @return The new index of the given value.
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
   * @return The new index of the given value.
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
   * @see Heap.delete
   */
  public delete(index: number): void {
    const size: number = this._elements.size

    this._elements.warp(index)

    if (index < size) {
      this.diveAsPossible(this.upliftAsPossible(index))
    }
  }

  /**
   * @see Heap.compare
   */
  public compare(left: number, right: number): number {
    const elements: Pack<Element> = this._elements
    return this._comparator(elements.get(left), elements.get(right))
  }

  /**
   * @see Sequence.get
   */
  public get(index: number): Element {
    return this._elements.get(index)
  }

  /**
   * @see Sequence.indexOf
   */
  public indexOf(value: Element): number {
    return this._elements.indexOf(value)
  }

  /**
   * @see Sequence.hasInSubsequence
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this._elements.hasInSubsequence(element, offset, size)
  }

  /**
   * @see Sequence.indexOfInSubsequence
   */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    return this._elements.indexOfInSubsequence(element, offset, size)
  }

  /**
   * @see Collection.has
   */
  public has(value: Element): boolean {
    return this._elements.has(value)
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
    return this._elements.firstIndex
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
   * @see Collection.iterator
   */
  public iterator(): BidirectionalIterator<Element> {
    return this._elements.iterator()
  }

  /**
   * @see Collection.get size
   */
  public get size(): number {
    return this._elements.size
  }

  /**
   * @see Heap.get comparator
   */
  public get comparator(): Comparator<Element, Element> {
    return this._comparator
  }

  /**
   * @see StaticCollection.get capacity
   */
  public get capacity(): number {
    return this._elements.capacity
  }

  /**
   * @see ReallocableCollection.reallocate
   */
  public reallocate(capacity: number): void {
    this._elements.reallocate(capacity)
  }

  /**
   * @see ReallocableCollection.fit
   */
  public fit(): void {
    this._elements.fit()
  }

  /**
   * @see Sequence.is
   */
  public is(marker: Sequence.MARKER): true

  /**
   * @see Heap.is
   */
  public is(marker: Heap.MARKER): true
  /**
   * @see Collection.is
   */
  public is(marker: Symbol): boolean
  /**
   * @see Sequence.is
   */
  public is(marker: Symbol): boolean {
    return marker === Heap.MARKER || marker === Sequence.MARKER
  }

  /**
   * @see Heap.clear
   */
  public clear(): void {
    this._elements.clear()
  }

  /**
  * @see Collection.clone
  */
  public clone(): PackHeap<Element> {
    return new PackHeap<Element>(Pack.copy(this._elements), this._comparator)
  }

  /**
  * @see Collection.view
  */
  public view(): Sequence<Element> {
    return SequenceView.wrap(this)
  }

  /**
  * @see Collection.equals
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
  * @see ReallocableCollection.iterator
  */
  public *[Symbol.iterator]() {
    yield* this._elements
  }
}

/**
 * 
 */
export namespace PackHeap {
  /**
   * Copy an existing heap instance.
   *
   * @param toCopy - An heap instance to copy.
   *
   * @return A copy of the given heap instance.
   */
  export function copy<Element>(toCopy: PackHeap<Element>): PackHeap<Element> {
    return toCopy == null ? null : toCopy.clone()
  }

  /**
   * 
   */
  export function any<T>(capacity: number, comparator: Comparator<T, T>): PackHeap<T> {
    return new PackHeap<T>(Pack.any(capacity), comparator)
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
  export function fromPack<T>(pack: Pack<T>, comparator: Comparator<T, T>): PackHeap<T> {
    return new PackHeap<T>(pack, comparator)
  }
}
