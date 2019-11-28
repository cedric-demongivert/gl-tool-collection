import { Iterator as CollectionIterator } from './iterator/Iterator'

/**
* A collection of values.
*/
export interface Collection<Element> extends Iterable<Element> {
  /**
  * @return True if this collection is a set.
  */
  readonly isSet : boolean

  /**
  * @see Sequence
  */
  readonly isSequence : boolean

  /**
  * @see RandomlyAccessibleCollection
  */
  readonly isRandomlyAccessible : boolean

  /**
  * @see SequentiallyAccessibleCollection
  */
  readonly isSequentiallyAccessible : boolean

  /**
  * @see StaticCollection
  */
  readonly isStatic : boolean

  /**
  * @see ReallocableCollection
  */
  readonly isReallocable : boolean

  /**
  * Return the number of elements stored into this collection.
  *
  * A collection may be non-finite and for such cases this getter MUST return
  * Number.POSITIVE_INFINITY. For finite collections, this getter will return
  * an integer equal to the number of elements that it currently store.
  *
  * @see InfiniteCollection
  * @see FiniteCollection
  *
  * @return The number of elements stored into this collection.
  */
  readonly size : number

  /**
  * Return the element at the given index in the sequence of element described
  * by the iterator of this collection.
  *
  * A collection may not be randomly accessible, and, in such cases, this method
  * may use the iterator exposed by this collection to access the requested
  * element. Randomly acessing elements of a non randomly accessible collection
  * may result in poor performances.
  *
  * @param index - Index of the element to return in the sequence of element
  *                described by the iterator of this collection
  *
  * @return The element at the given index in the sequence of element described
  *         by the iterator of this collection.
  *
  * @see https://en.wikipedia.org/wiki/Random_access
  */
  get (index : number) : Element

  /**
  * Return the last element of the sequence of element described by the
  * iterator of this collection.
  *
  * A collection may not be randomly accessible, and, in such cases, this method
  * may iterate over the entire collection to retrieve the last element.
  *
  * If this collection contains a non-finite number of elements this method
  * MUST return undefined.
  *
  * @return The last element of the sequence of element described by the
  *         iterator of this collection.
  */
  last () : Element

  /**
  * Return the first element of the sequence of element described by the
  * iterator of this collection.
  *
  * A collection may not be randomly accessible, and, in such cases, this method
  * may iterate over the entire collection to retrieve the first element.
  *
  * If this collection contains a non-finite number of elements this method
  * MAY return undefined.
  *
  * @return The first element of the sequence of element described by the
  *         iterator of this collection.
  */
  first () : Element

  /**
  * Return true if this collection contains the given element.
  *
  * @param element - An element to search for.
  *
  * @return True if the given element exists into this collection.
  */
  has (element : Element) : boolean

  /**
  * Return the index of first element equal to the given one in the sequence of
  * element described by the iterator of this collection.
  *
  * If the given element does not exists into this collection, this method will
  * return a negative index.
  *
  * A collection may not be randomly accessible, and, in such cases, this method
  * may use the iterator exposed by this collection to find the requested
  * element. Randomly acessing elements of a non randomly accessible collection
  * may result in poor performances.
  *
  * @param element - An element to search for.
  *
  * @return The index of first element equal to the given one in the sequence of
  *         element described by the iterator of this collection.
  */
  indexOf (element : Element) : number

  /**
  * Return true if both instances are equals.
  *
  * @param other - Object instance to compare to this one.
  */
  equals (other : any) : boolean

  /**
  * @return An iterator over this collection.
  */
  iterator () : CollectionIterator<Element>

  /**
  * @return An iterator over each elements of this collection.
  */
  [Symbol.iterator] () : Iterator<Element>
}
