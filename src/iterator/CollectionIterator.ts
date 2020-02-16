import { Collection } from '@library/Collection'

/**
* An iterator over a collection of element.
*
* @see https://en.wikipedia.org/wiki/Iterator_pattern
*/
export interface CollectionIterator<Element> {
  /**
  * @return The parent collection of this iterator.
  */
  collection () : Collection<Element>

  /**
  * Move this iterator to the location described by the given iterator instance.
  *
  * This method MAY throw an error if both iterator are not of the same type.
  * This method MAY throw an error if both iterator have different parent collection.
  * This method MUST throw an error if the described element can't be reached.
  *
  * @param iterator - An iterator that describe an element to reach.
  */
  move (iterator : CollectionIterator<Element>) : void

  /**
  * @return The element at the current location in the parent collection.
  */
  get () : Element

  /**
  * Return a shallow-copy of this iterator.
  *
  * A shallow-copy *b* of an iterator *a* is an instance that follow both
  * properties :
  *  - b !== a
  *  - b.equals(a)
  *
  * @return A shallow-copy of this iterator.
  */
  clone () : CollectionIterator<Element>

  /**
  * @see Object#equals
  *
  * Compare both instance and return true if they are both iterators that
  * describe the same element of the same collection.
  *
  * @param other - Another object instance to compare to this iterator.
  *
  * @return True if both instances are equals.
  */
  equals (other : any) : boolean
}
