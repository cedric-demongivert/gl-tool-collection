import { Iterator as CollectionIterator } from './Iterator'

export interface BackwardIterator<Element> extends CollectionIterator<Element> {
  /**
  * @return True if this iterator can move backward.
  */
  hasPrevious () : boolean

  /**
  * Move this iterator backward.
  */
  previous () : void

  /**
  * Move backward of the given number of element.
  *
  * @param count - Number of element to skip.
  */
  backward (count : number) : void

  /**
  * Move this iterator to the first element of the collection.
  */
  start () : void
}
