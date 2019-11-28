import { Iterator as CollectionIterator } from './Iterator'

export interface ForwardIterator<Element> extends CollectionIterator<Element> {
  /**
  * @return True if this iterator can move forward.
  */
  hasNext () : boolean

  /**
  * Move this iterator forward.
  */
  next () : void

  /**
  * Move forward of the given number of element.
  *
  * @param count - Number of element to skip.
  */
  forward (count : number) : void

  /**
  * Move this iterator to the last element of the collection.
  */
  end () : void
}
