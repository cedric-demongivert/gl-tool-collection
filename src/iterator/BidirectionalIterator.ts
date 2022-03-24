import { ForwardIterator } from './ForwardIterator'
import { BackwardIterator } from './BackwardIterator'

/**
* Bidirectional iterators are iterators that can move from element to element by
* following a sequence in any order.
*/
export interface BidirectionalIterator<Element> extends ForwardIterator<Element>, BackwardIterator<Element> {
  /**
   * @return True if this iterator can move backward.
   */
  hasPrevious(): boolean

  /**
   * Move this iterator to the previous element.
   */
  previous(): void

  /**
   * Move backward of the given number of element.
   *
   * @param count - Number of element to skip.
   */
  backward(count: number): void

  /**
   * Move this iterator to the first element of the collection.
   *
   * If the parent collection does not have a starting element, this iterator
   * must throw an error.
   */
  start(): void

  /**
   * Go to the given location in the parent sequence.
   *
   * @param index - Index of the element to go to.
   */
  go(index: number): void

  /**
   * @see CollectionIterator#clone
   */
  clone(): BidirectionalIterator<Element>
}
