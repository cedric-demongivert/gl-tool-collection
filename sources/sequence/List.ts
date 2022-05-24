import { Clearable, Comparator } from '@cedric-demongivert/gl-tool-utils'
import { Mark, Markable } from '../mark'

import { Sequence } from './Sequence'

/**
 * A mutable sequence of elements.
 */
export interface List<Element> extends Sequence<Element>, Clearable {
  /**
   * Return the number of elements in this sequence or update the current size of this sequence. 
   *
   * An update of the size of a sequence may reallocate it if the new size excess the
   * sequence's internal capacity. For more information about this behavior, take a look 
   * at your sequence implementation. 
   *
   * If the new size exceeds the current size, the sequence will set all-new elements to its
   * implementation default value.
   */
  size: number

  /**
   * Return a new default value of this collection.
   * 
   * A default value is used when a side behavior initializes some item.
   */
  defaultValue(): Element

  /**
   * Remove the last value of the sequence, if any, and return it.
   *
   * If this sequence does not have an ending element, this method
   * MAY throw an error.
   *
   * @returns The removed value of the sequence, if any.
   */
  pop(): Element | undefined

  /**
   * Remove the first value of the sequence, if any, and return it.
   *
   * If this sequence does not have a starting element, this method
   * MAY throw an error.
   *
   * @returns The removed value of the sequence, if any.
   */
  shift(): Element | undefined

  /**
   * Swap two elements of the sequence.
   *
   * @param first - Index of the first element to swap in the sequence.
   * @param second - Index of the second element to swap in the sequence.
   */
  swap(first: number, second: number): void

  /**
   * Update the element at the given index in this sequence.
   *
   * If the given index is greater than the current sequence size, this 
   * operation will increase the size of the sequence. As a consequence, 
   * this sequence may reallocate itself.
   * 
   * For more information about this behavior, take a look at your 
   * sequence implementation.
   *
   * @param index - Index of the element to update.
   * @param value - The element to set at the given location.
   */
  set(index: number, value: Element): void

  /**
   * Replace many elements in the sequence with the same value.
   *
   * If the given index is greater than the current sequence size, this 
   * operation will increase the size of the sequence. As a consequence, 
   * this sequence may reallocate itself.
   * 
   * For more information about this behavior, take a look at your 
   * sequence implementation.
   *
   * @param index - Index of the element to update.
   * @param count - Number of the elements to update.
   * @param value - The element to set at the given location.
   */
  setMany(index: number, count: number, value: Element): void

  /**
   * @see Array.sort
   */
  sort(comparator: Comparator<Element, Element>): void

  /**
   * Like Array.sort but on a subsequence of this sequence of elements.
   *
   * @param offset - Number of elements to ignore from the start of the sequence.
   * @param size - Number of elements to sort.
   * @param comparator - Comparison order to use.
   */
  subsort(offset: number, size: number, comparator: Comparator<Element, Element>): void

  /**
   * Insert the given value at the given location in this sequence.
   *
   * All values after the insertion index will be moved to their next available
   * location. This operation MAY increase the current sequence size and as a
   * consequence this sequence MAY reallocate itself. For more information about
   * this behaviour please take a look at this sequence implementation
   * documentation.
   *
   * @param index - Where to insert the given value.
   * @param value - The value to insert.
   */
  insert(index: number, value: Element): void

  /**
   * Push the given value at the end of this sequence.
   *
   * This operation will increase the current sequence size, and as a consequence, this sequence
   * may reallocate itself. For more information about this behavior, take a look at your sequence 
   * implementation.
   *
   * If this sequence does not have an ending element due to its semi-finite or non-finite status, 
   * this method MUST throw an error.
   */
  push(value: Element): void

  /**
   * Push the given value at the beginning of this sequence.
   *
   * This operation will increase the current sequence size, and as a consequence, 
   * this sequence may reallocate itself. For more information about this behavior, 
   * take a look at your sequence implementation.
   *
   * If this sequence does not have a beginning element due to its semi-finite or
   * non-finite status, this method MUST throw an error.
   *
   * @param value - The value to unshift.
   */
  unshift(value: Element): void

  /**
   * Delete the element at the given index in this sequence.
   *
   * The sequence implementation MUST reorder the following elements by moving 
   * them to the immediate previously available location.
   * 
   * This operation MAY be costly with most of the implementations.
   *
   * @param index - Index of the value to remove.
   */
  delete(index: number): void

  /**
   * Delete the given number of elements from the given index in this sequence.
   *
   * The sequence implementation MUST reorder the following elements by moving 
   * them to the immediate previously available location.
   * 
   * This operation MAY be costly with most of the implementations.
   *
   * @param from - First element to delete.
   * @param count - Number of element to delete.
   */
  deleteMany(from: number, count: number): void

  /**
   * Delete the element at the given location and replace it with a random 
   * element of this sequence.
   *
   * A warp MAY be faster than a deletion, as the implementation can choose any element 
   * of the sequence to replace the removed one. The replacement MAY accelerate the deletion 
   * operation by not shifting left or right each successor of the removed one.
   *
   * @param index - Where to warp out an element.
   */
  warp(index: number): void

  /**
   * Delete the given number of elements from the given index in this sequence.
   *
   * A warp MAY be faster than a deletion, as the implementation can choose any element 
   * of the sequence to replace the removed one. The replacement MAY accelerate the deletion 
   * operation by not shifting left or right each successor of the removed one.
   *
   * @param from - First element to warp.
   * @param count - Number of element to warp.
   */
  warpMany(from: number, count: number): void

  /**
   * Set all elements of this sequence to the given value.
   *
   * @param value - The value to set to all elements of this sequence.
   */
  fill(value: Element): void

  /**
   * @see Collection.clone
   */
  clone(): List<Element>

  /**
   * Append the content of the given sequence at the end of this one.
   *
   * @param toConcat - An existing sequence to concat.
   */
  concat(toConcat: Sequence<Element>): void

  /**
   * Append the content of the given javascript array at the end of this one.
   *
   * @param toConcat - An existing array to concat.
   */
  concatArray(toConcat: Element[]): void

  /**
   * Shallow copy an existing sequence.
   *
   * This method may update the capacity of this sequence and may reallocate 
   * it. For more information about this behavior, take a look at your 
   * sequence implementation.
   *
   * @param toCopy - An existing instance to copy.
   */
  copy(toCopy: Sequence<Element>): void

  /**
   * @see Collection.prototype.view
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
  export const MARK: Mark = Symbol('gl-tool-collection/mark/collection/list')

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
  export function is<Element>(collection: Markable): collection is List<Element> {
    return collection.is(MARK)
  }
}