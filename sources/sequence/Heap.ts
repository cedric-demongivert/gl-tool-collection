import { Clearable, Comparator, Factory } from '@cedric-demongivert/gl-tool-utils'
import { Sequence, Pack } from '../sequence'

import { PackHeap } from './PackHeap'
import { Mark, Markable } from '../mark'

/**
 * A heap implementation.
 */
export interface Heap<Element> extends Sequence<Element>, Clearable {
  /**
   * @returns The comparator used by this heap.
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
   * @returns A comparison number.
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
   * @returns The greatest element of the heap.
   */
  next(): Element

  /**
   * @see Collection.prototype.clone
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
  export const MARK: Mark = Symbol('gl-tool-collection/collection/heap')

  /**
   * @see Mark.Container
   */
  export function mark(): Mark {
    return MARK
  }

  /**
   * Return true if the given collection is a sequence.
   *
   * @param collection - A collection to assert.
   *
   * @returns True if the given collection is a sequence.
   */
  export function is<Element>(collection: Markable): collection is Heap<Element> {
    return collection.is(MARK)
  }

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
