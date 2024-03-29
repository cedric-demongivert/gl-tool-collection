import { Comparator } from '@cedric-demongivert/gl-tool-utils'
import { Collection } from '../Collection'

/**
 * An ordered collection of elements in which repetitions are allowed.
 * 
 * A sequence MAY contain a non-finite number of elements.
 */
export interface Sequence<Element> extends Collection<Element> {
  /**
   * Returns the element at the given index in the sequence.
   *
   * A sequence MAY not be randomly accessible. Randomly accessing elements of a 
   * non randomly accessible sequence MAY result in poor performances. For more 
   * information about this behavior, look at your sequence implementation. 
   * 
   * @see {@link https://en.wikipedia.org/wiki/Random_access}
   * 
   * @throws {@link IllegalArgumentsError<IllegalSequenceIndexError>} (MUST) if the requested index is out of the bounds of the sequence.
   * 
   * @param index - Index of the element to return.
   *
   * @returns The element at the given index.
   */
  get(index: number): Element

  /**
   * Returns the last element of the sequence.
   *
   * A sequence MAY not be randomly accessible, and, in such cases, this 
   * method MAY iterate over the entire collection to retrieve the last 
   * element. For more information about this behavior, look at your sequence 
   * implementation.
   * 
   * @see {@link https://en.wikipedia.org/wiki/Random_access}
   *
   * @throws {@link IllegalCallError<EmptyCollectionError>} (MUST) if the sequence is empty.
   * @throws {@link IllegalCallError<InfiniteCollectionError>} (MUST) if the sequence does not have a last element.
   *
   * @returns The last element of this sequence of elements if any.
   */
  last: Element

  /**
   * Returns the first element of the sequence.
   *
   * A sequence MAY not be randomly accessible, and, in such cases, this 
   * method MAY iterate over the entire collection to retrieve the first 
   * element. For more information about this behavior, look at your sequence 
   * implementation.
   * 
   * @see {@link https://en.wikipedia.org/wiki/Random_access}
   *
   * @throws {@link IllegalCallError<EmptyCollectionError>} (MUST) if the sequence is empty.
   *
   * @returns The first element of this sequence of elements.
   */
  first: Element 

  /**
   * Returns the index of the first element equal to the searched one or a negative 
   * integer if the given value does not exist in the sequence.
   *
   * A sequence MAY not be randomly accessible. In such cases, this method MAY iterate 
   * over the entire collection to retrieve the requested element. For more information 
   * about this behavior, look at your sequence implementation.
   * 
   * This method allows searching for an element in a given subsequence. It MUST allow 
   * defining the boundaries of a subsequence in any order.
   * 
   * @throws {@link IllegalArgumentsError<IllegalSubsequenceError>} (MUST) if the requested subsequence is out of the bounds of the collection.
   *
   * @param element - An element to search for.
   * @param [startOrEnd=0] - Index of starting element (inclusive) or index of the last element (exclusive) of the subsequence to search.
   * @param [endOrStart=this.size] - Index of starting element (inclusive) or index of the last element (exclusive) of the subsequence to search.
   *
   * @returns The index of the first element equal to the given one in this sequence or a negative integer if the given value does not exist in this sequence of elements.
   */
  indexOf(element: Element, startOrEnd?: number, endOrStart?: number): number

  /**
   * @see {@link Collection.has}
   *
   * A sequence MAY not be randomly accessible. In such cases, this method MAY iterate 
   * over the entire collection to retrieve the requested element. For more information 
   * about this behavior, look at your sequence implementation.
   * 
   * By default, a sequence implementation MUST search from its first element to its
   * last one by applying the {@link Comparator.compareWithOperator} comparator.
   * 
   * This method MUST allow its user to define the boundaries of the subsequence to search in any order.
   * 
   * @throws {@link IllegalArgumentsError<IllegalSubsequenceError>} (MUST) if the requested subsequence is out of the bounds of the collection.
   *
   * @param element - An element to search for.
   * @param [startOrEnd=0] - Index of starting element (inclusive) or index of the last element (exclusive) of the subsequence to search.
   * @param [endOrStart=this.size] - Index of starting element (inclusive) or index of the last element (exclusive) of the subsequence to search.
   *
   * @returns True if the requested element exists in the collection.
   */
  has(element: Element, startOrEnd?: number, endOrStart?: number): boolean

  /**
   * @throws {@link IllegalArgumentsError<IllegalSubsequenceError>} (MUST) if the requested subsequence is out of the bounds of the collection.
   *
   * @param key - An key to search for.
   * @param comparator - A comparison operation to use for the search.
   * @param [startOrEnd=0] - Index of starting element (inclusive) or index of the last element (exclusive) of the subsequence to search.
   * @param [endOrStart=this.size] - Index of starting element (inclusive) or index of the last element (exclusive) of the subsequence to search.
   *
   * @returns The index of the first element equal to the key in this sequence or a negative integer if the given key does not match any element of this sequence.
   */
  search<Key>(key: Key, comparator: Comparator<Key, Element>, startOrEnd?: number, endOrStart?: number): number

  /**
   * @see {@link Collection.clone}
   */
  clone(): Sequence<Element>

  /**
   * @see {@link Collection.view}
   */
  view(): Sequence<Element>
}
