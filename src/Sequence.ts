import { Collection } from './Collection'

import { EmptySequence } from './sequence/EmptySequence'

/**
* A sequence is an ordered collection of elements in wich repetitions are
* allowed. A sequence can contains a non-finite number of element.
*
* @see Collection#isSequence
*/
export interface Sequence<Element> extends Collection<Element> {
  /**
  * Return the element at the given index in this sequence of element.
  *
  * A sequence may not be randomly accessible. Randomly acessing elements of a
  * non randomly accessible sequence may result in poor performances.
  *
  * @param index - Index of the element to return in this sequence of element.
  *
  * @return The element at the given index in this sequence of element.
  *
  * @see https://en.wikipedia.org/wiki/Random_access
  */
  get (index : number) : Element

  /**
  * Return the last element of this sequence of element.
  *
  * A sequence may not be randomly accessible, and, in such cases, this method
  * may iterate over the entire collection to retrieve the last element.
  *
  * If this sequence does not have a last element because it describe a
  * semi-finite or an infinite sequence of element this method MUST return
  * undefined.
  *
  * @return The last element of this sequence of element if any.
  */
  readonly last : Element

  /**
  * Return the index of the last element of this sequence of element.
  *
  * If this sequence does not have a last element because it describe a
  * semi-finite or an infinite sequence of element this method MUST return
  * undefined.
  *
  * @return The index of the last element of this sequence of element if any.
  */
  readonly lastIndex : number

  /**
  * Return the first element of this sequence of element.
  *
  * A sequence may not be randomly accessible, and, in such cases, this method
  * may iterate over the entire collection to retrieve the first element.
  *
  * If this sequence does not have a first element because it describe a
  * semi-finite or an infinite sequence of element this method MUST return
  * undefined.
  *
  * @return The first element of this sequence of element.
  */
  readonly first : Element

  /**
  * Return the index of the first element of this sequence of element.
  *
  * If this sequence does not have a first element because it describe a
  * semi-finite or an infinite sequence of element this method MUST return
  * undefined.
  *
  * @return The index of the first element of this sequence of element if any.
  */
  readonly firstIndex : number

  /**
  * Return the index of first element equal to the given one in this sequence of
  * element.
  *
  * If the given element does not exists into this collection, this method will
  * return an index equal to firstIndex - 1.
  *
  * A collection may not be randomly accessible, and, in such cases, this method
  * may use the iterator exposed by this collection to find the requested
  * element. Randomly acessing elements of a non randomly accessible collection
  * may result in poor performances.
  *
  * @param element - An element to search for.
  *
  * @return The index of the first element equal to the given one in this
  *         sequence of element.
  */
  indexOf (element : Element) : number

  /**
  * @see Sequence.indexOf
  *
  * Act like indexOf but only over the given subsequence of element.
  *
  * @param element - An element to search for.
  * @param offset - Number of element to skip from the begining of this sequence.
  * @param size - Number of element to search.
  *
  * @return The index of the first element equal to the given one in this
  *         sequence of element.
  */
  indexOfInSubsequence (element : Element, offset : number, size : number) : number

  /**
  * @see Sequence.has
  *
  * Act like has but only over the given subsequence of element.
  *
  * @param element - An element to search for.
  * @param offset - Number of element to skip from the begining of this sequence.
  * @param size - Number of element to search.
  *
  * @return True if the described subsequence contains the given element.
  */
  hasInSubsequence (element : Element, offset : number, size : number) : boolean

  /**
  * @see Collection#clone
  */
  clone () : Sequence<Element>

  /**
  * @return A javascript iterator over this sequence of elements.
  */
  [Symbol.iterator] () : Iterator<Element>
}

export namespace Sequence {
  /**
  * A sequence marker to export in a namespace.
  */
  export const SEQUENCE : symbol = Symbol()

  /**
  * Return true if the given collection is a sequence.
  *
  * @param collection - A collection to assert.
  *
  * @return True if the given collection is a sequence.
  */
  export function isSequence <Element> (collection : Collection<Element>) : boolean {
    return SEQUENCE in Object.getPrototypeOf(collection).constructor
  }

  /**
  * @return An instance of sequence that represent a static empty sequence.
  */
  export function empty <Element> () : Sequence<Element> {
    return EmptySequence.of()
  }
}
