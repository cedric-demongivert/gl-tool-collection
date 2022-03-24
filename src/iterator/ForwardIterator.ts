import { CollectionIterator } from './CollectionIterator'

/**
 * Forward iterators can move from element to element by following a 
 * sequence from its first element to its last one.
 */
export interface ForwardIterator<Element> extends CollectionIterator<Element> {
  /**
   * @return True if this iterator can move forward.
   */
  hasNext(): boolean

  /**
   * Move this iterator to the next available element.
   */
  next(): void

  /**
   * Move forward of the given number of elements.
   *
   * @param count - Number of elements to skip.
   */
  forward(count: number): void

  /**
   * @see CollectionIterator.clone
   */
  clone(): ForwardIterator<Element>

  /**
   * Move this iterator to the last element of the collection.
   *
   * If the parent collection does not have a final element, this iterator must
   * throw an error.
   */
  end(): void
}
