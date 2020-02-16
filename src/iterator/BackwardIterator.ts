import { CollectionIterator } from '@library/iterator/CollectionIterator'

/**
* Forward iterators are iterators that can move from element to element by
* following a sequence from its last element to its first element.
*/
export interface BackwardIterator<Element> extends CollectionIterator<Element> {
  /**
  * @return True if this iterator can move backward.
  */
  hasPrevious () : boolean

  /**
  * Move this iterator to the previous element.
  */
  previous () : void

  /**
  * Move backward of the given number of element.
  *
  * @param count - Number of element to skip.
  */
  backward (count : number) : void

  /**
  * @see CollectionIterator#clone
  */
  clone () : BackwardIterator<Element>

  /**
  * Move this iterator to the first element of the collection.
  *
  * If the parent collection does not have a starting element, this iterator
  * must throw an error.
  */
  start () : void
}
