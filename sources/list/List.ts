import { Clearable, Comparator } from '@cedric-demongivert/gl-tool-utils'
import { Collection } from '../Collection'

import { Sequence } from '../sequence/Sequence'
import { SortableSequence } from '../sequence/SortableSequence'

/**
 * A mutable sequence of elements.
 */
export interface List<Element> extends SortableSequence<Element>, Clearable {
  /**
   * Returns the number of elements in the list if read and updates the number of elements in the list if wrote. 
   *
   * It MAY reallocate the list if the new size exceeds its internal capacity. For more 
   * information about this behavior, look at your list implementation. 
   *
   * If the requested size exceeds the current size, the list MUST grow to the requested size 
   * by pushing new default values or resetting existing ones to the default value.
   * 
   * If the requested size is smaller than the current size, the list MUST shrink to the 
   * requested size by discarding or ignoring enough values.
   */
  size: number

  /**
   * Returns a new default value.
   * 
   * The list uses default values to initialize or reset new elements. 
   * 
   * @returns A new default value instance.
   */
  defaultValue(): Element

  /**
   * Removes the last element of the list and returns it.
   *
   * @throws {@link IllegalCallError<EmptyCollectionError>} (MUST) if the list is empty.
   *
   * @returns The last element of the list before the mutation.
   */
  pop(): Element

  /**
   * Removes the first element of the list and returns it.
   *
   * @throws {@link IllegalCallError<EmptyCollectionError>} (MUST) if the list is empty.
   *
   * @returns The first element of the list before the mutation.
   */
  shift(): Element

  /**
   * Updates an element of the list.
   *
   * This operation expands the list if the element to update is out of its current 
   * bounds. As a consequence, it MAY reallocate the list if its new size overflows
   * its current capacity. For more information about this behavior, look at your 
   * list implementation.
   * 
   * @throws {@link IllegalArgumentsError<NegativeSequenceIndexError>} (MUST) if the given index is negative.
   *
   * @param index - Index of the element to update.
   * @param value - The element to set at the given location.
   */
  set(index: number, value: Element): void

  /**
   * Updates a subsequence of the list.
   *
   * This operation expands the list if the subsequence to update is out of its current 
   * bounds. As a consequence, it MAY reallocate the list if the subsequence update overflows
   * its current capacity. For more information about this behavior, look at your 
   * list implementation.
   * 
   * The set method MUST allow its users to define the subsequence to update in any order.
   *
   * @throws {@link IllegalArgumentsError<NegativeSequenceIndexError>} (MUST) if startOrEnd is negative.
   * @throws {@link IllegalArgumentsError<NegativeSequenceIndexError>} (MUST) if endOrStart is negative.
   * 
   * @param index - Index of the element to update.
   * @param value - The element to set at the given location.
   */
  set(startOrEnd: number, endOrStart: number, value: Element): void

  /**
   * Sorts the list by using the requested comparator.
   * 
   * By default, a list MUST order itself from its first element to its last 
   * one by using the Comparator.compareWithOperator comparator. 
   * 
   * @see {@link Comparator.compareWithOperator}
   * 
   * This method allows sorting a subsequence of elements. It MUST allow 
   * its user to define the boundaries of the subsequence to sort in any order.
   * 
   * This operation does nothing if the given boundaries define a valid empty sequence.
   * 
   * @throws {@link IllegalArgumentsError<IllegalSubsequenceError>} (MUST) if the requested subsequence is out of the bounds of the collection.
   *
   * @param [comparator] - The comparator to use for sorting the list.
   * @param [startOrEnd] - Index of the first element to sort (inclusive).
   * @param [endOrStart] - Index of the last element to sort (exclusive).
   * 
   * @see {@link Array.sort}
   */
  sort(comparator?: Comparator<Element, Element>, startOrEnd?: number, endOrStart?: number): void

  /**
   * Removes duplicates from the list by using the requested comparator.
   * 
   * This method preserves the ordering of the list and as a result MAY be 
   * costly in time. For more information about this behavior, look at your 
   * list implementation.
   * 
   * By default, a list MUST removes its duplicates from its first element to 
   * its last one by using the Comparator.compareWithOperator comparator. 
   * 
   * @see {@link Comparator.compareWithOperator}
   * 
   * This method allows removing duplicates from a subsequence of elements. It MUST allow 
   * its user to define the boundaries of a subsequence in any order.
   * 
   * This operation does nothing if the given boundaries define a valid empty sequence.
   * 
   * @throws {@link IllegalArgumentsError<IllegalSubsequenceError>} (MUST) if the requested subsequence is out of the bounds of the collection.
   *
   * @param [comparator] - The comparator to use.
   * @param [startOrEnd] - Index of the first element to process (inclusive).
   * @param [endOrStart] - Index of the last element to process (exclusive).
   * 
   * @see {@link Array.sort}
   */
  unique(comparator?: Comparator<Element, Element>, startOrEnd?: number, endOrStart?: number): void

  /**
   * Inserts a value at the given location in the sequence.
   *
   * All values after the insertion index will be moved to their next available
   * location. 
   * 
   * This operation expands the list if the insertion index is out of its current 
   * bounds. As a consequence, it MAY reallocate the list if its new size overflows
   * its current capacity. For more information about this behavior, look at your 
   * list implementation.
   * 
   * @throws {@link IllegalArgumentsError<NegativeSequenceIndexError>} (MUST) if the insertion index is negative.
   *
   * @param index - Where to insert the given value.
   * @param value - The value to insert.
   */
  insert(index: number, value: Element): void

  /**
   * Appends the given value at the end of the sequence.
   *
   * This operation increases the size of the list. As a consequence, it MAY reallocate 
   * the list if its new size overflows its current capacity. For more information about 
   * this behavior, look at your list implementation.
   *
   * If this sequence does not have an ending element due to its semi-finite or non-finite status, 
   * this method MUST throw an error. @TODO Better define this error
   */
  push(value: Element): void
  
  /**
   * Rotates the sequence by the given offset.
   * 
   * This method accepts negative offsets.
   * 
   * @param offset - The offset to use.
   */
  rotate(offset: number): void

  /**
   * Appends the given value at the beginning of the list.
   *
   * This operation increases the size of the list. As a consequence, it MAY reallocate 
   * the list if its new size overflows its current capacity. For more information about 
   * this behavior, look at your list implementation.
   *
   * If this sequence does not have a beginning element due to its semi-finite or
   * non-finite status, this method MUST throw an error.
   *
   * @param value - The value to unshift.
   */
  unshift(value: Element): void

  /**
   * Removes the element at the given index in the list or removes a subsequence of elements from the list.
   * 
   * The delete operation preserves the ordering of each element in the list, as a result, this operation MAY
   * be costly in time. For more information about this behavior, look at your list implementation.
   * 
   * This method MUST allows defining the boundaries of the subsequence to remove in any order.
   *
   * @throws {@link IllegalArgumentsError<IllegalSubsequenceError>} (MUST) if the requested subsequence is out of the bounds of the collection.
   * 
   * @param startOrEnd - Index of the element to delete or index of the first element to delete (inclusive).
   * @param [endOrStart] - Index of the last element to delete (exclusive).
   */
  delete(startOrEnd: number, endOrStart?: number): void

  /**
   * Removes the element at the given index in the list or removes a subsequence of elements from the list.
   *
   * The warp operation does not preserve the ordering of each element in the list, as a result, this operation MAY
   * be faster than an equivalent call to delete. For more information about this behavior, look at your list implementation.
   *
   * This method MUST allows defining the boundaries of the subsequence to remove in any order.
   *
   * @throws {@link IllegalArgumentsError<IllegalSubsequenceError>} (MUST) if the requested subsequence is out of the bounds of the collection.
   * 
   * @param index - Where to warp out an element.
   */
  warp(startOrEnd: number, endOrStart?: number): void

  /**
   * Updates all elements of the list to the given value.
   *
   * @param value - The value to set to all elements of this sequence.
   */
  fill(value: Element): void

  /**
   * @see {@link Collection.clone}
   */
  clone(): List<Element>

  /**
   * Appends the content of the given sequence at the end of the list.
   *
   * This operation increases the size of the list. As a consequence, it MAY reallocate 
   * the list if its new size overflows its current capacity. For more information about 
   * this behavior, look at your list implementation.
   * 
   * @param toConcat - An existing sequence to concat.
   */
  concat(toConcat: Sequence<Element>): void

  /**
   * Appends the content of the given array at the end of the list.
   * 
   * This operation increases the size of the list. As a consequence, it MAY reallocate 
   * the list if its new size overflows its current capacity. For more information about 
   * this behavior, look at your list implementation.
   * 
   * @param toConcat - An existing array to concat.
   */
  concatArray(toConcat: Element[]): void

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
  copy(toCopy: Sequence<Element>, startOrEnd?: number, endOrStart?: number,): void

  /**
   * @see {@link Sequence.view}
   */
  view(): Sequence<Element>
}

/**
 * 
 */
export namespace List {
  /**
   * 
   */
  export type Allocator<Element> = () => List<Element>
}