import { Collection } from '../Collection'

/**
* An iterator over a collection of element.
*
* @see https://en.wikipedia.org/wiki/Iterator_pattern
*/
export interface Iterator<Element> {
  /**
  * @return The itered collection.
  */
  getCollection() : Collection<Element>

  /**
  * Move this iterator to the given location.
  *
  * @param iterator - An iterator that contains the location to access.
  */
  move (iterator : Iterator<Element> | Symbol) : void

  /**
  * @return The element at the given iterator location.
  */
  get () : Element

  /**
  * @see Object#equals
  *
  * Compare two objects and return true if the given one is an iterator of
  * the same collection and at the same location.
  *
  * @param other - Another object to compare to this one.
  *
  * @return True if both object are equals.
  */
  equals (other : any) : boolean
}
