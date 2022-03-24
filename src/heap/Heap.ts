import { Sequence } from '../Sequence'
import { Comparator } from '../Comparator'
import { Pack } from '../pack/Pack'

import { PackHeap } from './PackHeap'
import { Collection } from '../Collection'

/**
 * A heap implementation.
 */
export interface Heap<Element> extends Sequence<Element> {
  /**
   * @return The comparator used by this heap.
   */
  readonly comparator: Comparator<Element, Element>

  /**
   * @todo Revalidate
   * 
   * Compare the content of two cell of the heap.
   *
   * @param left - Index of the cell to use as a left operand.
   * @param right - Index of the cell to use as a right operand.
   *
   * @return A comparison number.
   */
  compare(left: number, right: number): number

  /**
   * Add a value to the heap.
   *
   * @param value - A value to add into the heap.
   */
  push(value: Element): void

  /**
   * Remove a value from the heap.
   *
   * @param index - Index of the value to remove from the heap.
   */
  delete(index: number): void

  /**
   * Remove the greatest element from the heap and return it.
   *
   * @return The greatest element of the heap.
   */
  next(): Element

  /**
   * @see Sequence.is
   */
  is(marker: Sequence.MARKER): true

  /**
   * @see Collection.is
   */
  is(marker: Heap.MARKER): true

  /**
   * @see Collection.is
   */
  is(marker: symbol): boolean

  /**
   * Empty this heap of its elements.
   */
  clear(): void

  /**
   * @see Collection.clone
   */
  clone(): Heap<Element>
}

/**
 * 
 */
export namespace Heap {
  /**
   * 
   */
  export const MARKER: unique symbol = Symbol('gl-tool-collection/heap-marker')

  /**
   * 
   */
  export type MARKER = typeof MARKER

  /**
   * Return true if the given collection is a sequence.
   *
   * @param collection - A collection to assert.
   *
   * @return True if the given collection is a sequence.
   */
  export function is<Element>(collection: Collection<Element>): collection is Heap<Element> {
    return collection.is(MARKER)
  }

  /**
   * 
   */
  export function copy<T>(pack: Heap<T>): Heap<T> {
    return pack == null ? null : pack.clone()
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
