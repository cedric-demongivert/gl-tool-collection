import { Collection } from '../Collection'

/**
* A collection of elements without order and that does not allows duplicates of
* elements.
*/
export interface Set<Element> extends Collection<Element> {
  /**
  * Add a new element to the collection.
  *
  * @param value - Elementhe value to add to the collection.
  */
  add (value : Element) : void

  /**
  * Remove an element from the collection.
  *
  * @param value - Elementhe value to remove from the collection.
  */
  delete (value : Element) : void

  /**
  * Empty the collection.
  */
  clear () : void
}
