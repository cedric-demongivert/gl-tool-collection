import { Clearable, Comparator } from '@cedric-demongivert/gl-tool-utils'
import { Sequence } from '../sequence/Sequence'

/**
 * A heap implementation.
 */
export interface Heap<Element> extends Sequence<Element>, Clearable {
  /**
   * @returns The comparator used by this heap.
   */
  comparator: Comparator<Element>

  /**
   * Add a value to the heap.
   *
   * @param value - A value to add into the heap.
   */
  push(value: Element): void

  /**
   * Removes the greatest element from the heap and returns it.
   * 
   * @throws {@link IllegalCallError<EmptyCollectionError>} (MUST) if the heap is empty.
   *
   * @returns The greatest element of the heap.
   */
  pop(): Element

  /**
   * Removes an element from the heap and returns it.
   * 
   * @throws {@link IllegalCallError<EmptyCollectionError>} (MUST) if the heap is empty.
   * @throws {@link IllegalArgumentsError<IllegalSequenceIndexError>} (MUST) if the requested index is out of the bounds of the sequence.
   *
   * @param index - Index of the element to remove.
   * 
   * @returns The requested element of the heap.
   */
  pop(index: number): Element

  /**
   * Removes the greatest element from the heap.
   * 
   * @throws {@link IllegalCallError<EmptyCollectionError>} (MUST) if the heap is empty.
   */
  delete(): void

  /**
   * Removes an element from the heap.
   * 
   * @throws {@link IllegalCallError<EmptyCollectionError>} (MUST) if the heap is empty.
   * @throws {@link IllegalArgumentsError<IllegalSequenceIndexError>} (MUST) if the requested index is out of the bounds of the sequence.
   *
   * @param index - Index of the element to remove.
   */
  delete(index: number): void

  /**
   * @see {@link Collection.clone}
   */
  clone(): Heap<Element>
}
