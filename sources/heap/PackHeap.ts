import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { Sequence } from '../sequence/Sequence'
import { createSequenceView } from '../sequence/SequenceView'

import { Pack } from '../pack/Pack'

import { ForwardCursor } from '../cursor/ForwardCursor'
import { join } from '../algorithm/join'

import { Heap } from './Heap'

/**
 * An object that uses a Pack instance as a Heap.
 */
export class PackHeap<Element> implements Heap<Element>
{
  /**
   * The underlying pack instance.
   */
  private _elements: Pack<Element>

  /**
   * @see {@link Heap.first}
   */
  public get first(): Element {
    return this._elements.first
  }

  /**
   * @see {@link Heap.last}
   */
  public get last(): Element {
    return this._elements.last
  }

  /**
   * @see {@link Heap.size}
   */
  public get size(): number {
    return this._elements.size
  }

  /**
   * 
   */
  public get capacity(): number {
    return this._elements.capacity
  }

  /**
   * The comparison operator used by the heap.
   */
  private _comparator: Comparator<Element>

  /**
   * @see {@link Heap.comparator}
   */
  public get comparator(): Comparator<Element> {
    return this._comparator
  }

  /**
   * @see {@link Heap.comparator}
   */
  public set comparator(nextComparator: Comparator<Element>) {
    this._comparator = nextComparator
    PackHeap.heapify(this._elements, nextComparator)
  }

  /**
   * Instantiate a new empty heap.
   *
   * @param elements - Pack to use as a heap.
   * @param comparator - A comparator to use for sorting the heap.
   */
  public constructor(elements: Pack<Element>, comparator: Comparator<Element, Element>) {
    this._comparator = comparator
    this._elements = elements
    
    PackHeap.heapify(elements, comparator)
  }

  /**
   * @see {@link Heap.pop}
   */
  public pop(index: number = 0): Element {
    return PackHeap.pop(this._elements, this._comparator, index)
  }

  /**
   * @see {@link Heap.push}
   */
  public push(value: Element): void {
    PackHeap.push(this._elements, this._comparator, value)
  }

  /**
   * @see {@link Heap.delete}
   */
  public delete(index: number = 0): void {
    PackHeap.remove(this._elements, this._comparator, index)
  }

  /**
   * @see {@link Heap.compare}
   */
  public compare(left: number, right: number): number {
    const elements: Pack<Element> = this._elements
    return this._comparator(elements.get(left)!, elements.get(right)!)
  }

  /**
   * @see {@link Heap.get}
   */
  public get(index: number): Element {
    return this._elements.get(index)
  }

  /**
   * @see {@link Heap.indexOf}
   */
  public indexOf(element: Element, startOrEnd: number = 0, endOrStart: number = this.size): number {
    return this._elements.indexOf(element, startOrEnd, endOrStart)
  }

  /**
   * @see {@link Heap.has}
   */
  public has(element: Element, startOrEnd: number = 0, endOrStart: number = this.size): boolean {
    return this._elements.has(element, startOrEnd, endOrStart)
  }

  /**
   * @see {@link Heap.search}
   */
  public search<Key>(key: Key, comparator: Comparator<Key, Element>, startOrEnd: number = 0, endOrStart: number = 0): number {
    return this._elements.search(key, comparator, startOrEnd, endOrStart)
  }

  /**
   * @see {@link Heap.forward}
   */
  public forward(): ForwardCursor<Element> {
    return this._elements.forward()
  }

  /**
   * 
   */
  public reallocate(capacity: number): void {
    this._elements.reallocate(capacity)
  }

  /**
   * 
   */
  public fit(): void {
    this._elements.fit()
  }

  /**
   * @see {@link Heap.clear}
   */
  public clear(): void {
    this._elements.clear()
  }

  /**
   * @see {@link Heap.clone}
   */
  public clone(): PackHeap<Element> {
    return new PackHeap<Element>(this._elements.clone(), this._comparator)
  }

  /**
   * @see {@link Heap.stringify}
   */
  public stringify(): string {
    return '[' + join(this) + ']'
  }

  /**
   * @see {@link Heap.view}
   */
  public view(): Sequence<Element> {
    return createSequenceView(this)
  }

  /**
   * @see {@link Heap.equals}
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
   * @see {@link Heap.values}
   */
  public values(): IterableIterator<Element> {
    return this._elements.values()
  }

  /**
   * @see {@link Heap[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._elements.values()
  }
}

/**
 * 
 */
export function wrapAsPackHeap<Element>(pack: Pack<Element>, comparator: Comparator<Element, Element>): PackHeap<Element> {
  return new PackHeap(pack, comparator)
}

/**
 * 
 */
export namespace PackHeap {
  /**
   * 
   */
  export function heapify<Element>(target: Pack<Element>, comparator: Comparator<Element>): void {
    for (let index = 0, size = target.size; index < size; ++index) {
        upliftAsPossible(target, comparator, index)
    }
  }

  /**
   * 
   */
  export function pop<Element>(target: Pack<Element>, comparator: Comparator<Element>, index: number = 0): Element {
    const result: Element = target.get(index)
    remove(target, comparator, index)
    return result
  }

  /**
   * Removes an element from the heap.
   *
   * @param index - Index of the element to remove.
   */
  export function remove<Element>(target: Pack<Element>, comparator: Comparator<Element>, index: number): void {
    const size: number = target.size    
    target.swap(index, target.size - 1)
    target.delete(target.size - 1)

    if (index < size) {
        rearrange(target, comparator, index)
    }
  }

  /**
   * 
   */
  export function rearrange<Element>(target: Pack<Element>, comparator: Comparator<Element>, index: number): number {
    return diveAsPossible(target, comparator, upliftAsPossible(target, comparator, index))
  }

  /**
   * Moves the value at the given index up in the tree while it violates the order of the heap.
   *
   * @param index - Index of the value to move up.
   *
   * @returns The new index of the given value.
   */
  export function push<Element>(target: Pack<Element>, comparator: Comparator<Element>, value: Element): void {
    target.push(value)
    upliftAsPossible(target, comparator, target.size - 1)
  }

  /**
   * Moves the value at the given index up in the tree while it violates the order of the heap.
   *
   * @param index - Index of the value to move up.
   *
   * @returns The new index of the given value.
   */
  export function upliftAsPossible<Element>(target: Pack<Element>, comparator: Comparator<Element>, index: number): number {
    let cell = index
    let parent = (cell - 1) >> 1

    while (cell > 0 && comparator(target.get(cell), target.get(parent)) > 0) {
        target.swap(cell, parent)
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
  export function diveAsPossible<Element>(target: Pack<Element>, comparator: Comparator<Element>, index: number): number {
    const size: number = target.size
    let cell: number = index
    let next: number = (cell << 1) + 1

    while (next < size) {
        if (next + 1 < size && comparator(target.get(cell), target.get(next + 1)) < 0) {
            if (comparator(target.get(next), target.get(next + 1)) < 0) {
                target.swap(cell, next + 1)
                cell = next + 1
            } else {
                target.swap(cell, next)
                cell = next
            }
        } else if (comparator(target.get(cell), target.get(next)) < 0) {
            target.swap(cell, next)
            cell = next
        } else {
            break
        }

        next = (cell << 1) + 1
    }

    return cell
  }
}