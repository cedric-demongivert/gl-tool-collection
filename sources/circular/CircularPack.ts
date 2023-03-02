import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { Sequence } from '../sequence/Sequence'
import { SortableSequence } from '../sequence/SortableSequence'

/**
 * A circular pack is a sequence with a predefined capacity that continuously drops its oldest element when overflowed with new ones.
 */
export interface CircularPack<Element> extends SortableSequence<Element> {
  /**
   * @returns The maximum number of elements that this pack can store with its current memory allocation.
   */
  readonly capacity: number

  /**
   * Updates the capacity of the circular pack by reallocating it.
   * 
   * This method truncates the sequence from its start to the requested capacity if its size exceeds it.
   *
   * @param capacity - The new capacity to allocate.
   */
  reallocate(capacity: number): void

  /**
   * @see List.defaultValue
   */
  defaultValue(): Element

  /**
   * Reallocates this circular pack to its current size.
   */
  fit(): void

  /**
   * @see List.pop
   */
  pop(): Element

  /**
   * @see List.shift
   */
  shift(): Element

  /**
   * @see List.sort
   */
  sort(comparator?: Comparator<Element, Element>, startOrEnd?: number, endOrStart?: number): void

  /**
   * 
   */
  set(index: number, value: Element): void

  /**
   * 
   */
  push(value: Element, index?: number): void

  /**
   * 
   */
  unshift(value: Element, index?: number): void

  /**
   * @see List.delete
   */
  delete(startOrEnd: number, endOrStart?: number): void

  /**
   * @see List.warp
   */
  warp(startOrEnd: number, endOrStart?: number): void

  /**
   * @see List.fill
   */
  fill(value: Element): void

  /**
   * @see {@link Collection.clone}
   */
  clone(): CircularPack<Element>

  /**
   * Appends the content of the given sequence at the end of the pack.
   *
   * This operation increases the size of the pack. As a consequence, it MAY discard
   * tailing elements. For more information about this behavior, look at your list implementation.
   * 
   * @param toConcat - An existing sequence to concat.
   */
  pushSequence(toConcat: Sequence<Element>): void

  /**
   * Appends the content of the given array at the end of the pack.
   *
   * This operation increases the size of the pack. As a consequence, it MAY discard
   * tailing elements. For more information about this behavior, look at your list implementation.
   * 
   * @param toConcat - An existing array to concat.
   */
  pushArray(toConcat: Element[]): void

  /**
   * Appends the content of the given sequence at the end of the pack.
   *
   * This operation increases the size of the pack. As a consequence, it MAY discard
   * tailing elements. For more information about this behavior, look at your list implementation.
   * 
   * @param toConcat - An existing sequence to concat.
   */
  unshiftSequence(toConcat: Sequence<Element>): void

  /**
   * Appends the content of the given array at the end of the pack.
   *
   * This operation increases the size of the pack. As a consequence, it MAY discard
   * tailing elements. For more information about this behavior, look at your list implementation.
   * 
   * @param toConcat - An existing array to concat.
   */
  unshiftArray(toConcat: Element[]): void

  /**
   * Shallow copy an existing sequence or shallow copy a subsequence of an existing sequence.
   *
   * This method MAY reallocate the sequence to fit the content of the
   * sequence to copy. For more information about this behavior, take a 
   * look at your sequence implementation.
   * 
   * This method MUST allows defining the boundaries of the subsequence to copy in any order.
   *
   * @throws {@link IllegalArgumentsError<IllegalSubsequenceError>} (MUST) if the subsequence to copy is out of the bounds of the collection.
   * 
   * @param toCopy - An existing instance to copy.
   */
  copy(toCopy: Sequence<Element>, startOrEnd?: number, endOrStart?: number): void

  /**
   * @see {@link Sequence.view}
   */
  view(): Sequence<Element>
}