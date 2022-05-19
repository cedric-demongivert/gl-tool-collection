import { Comparable } from '@cedric-demongivert/gl-tool-utils'

import { CollectionIterator } from './iterator'
import { ForwardIterator } from './iterator/ForwardIterator'

/**
 * A collection is a container of elements.
 */
export interface Collection<Element> extends Iterable<Element>, Comparable {
  /**
   * Return the number of elements stored into this collection.
   *
   * A container may hold an infinite number of elements, and for such cases, 
   * this property MUST return the value Number.POSITIVE_INFINITY. Otherwise, 
   * this property MUST return a non-negative integer equal to the number of 
   * elements in the collection.
   * 
   * A container can't "partially" hold elements and, as a result, must always 
   * return an integer as its size.
   * 
   * Return the number of elements stored into this collection.
   */
  readonly size: number

  /**
   * Return true if the given element is in this collection.
   *
   * @param element - An element to search.
   *
   * @return True if the given element is in this collection.
   */
  has(element: Element): boolean

  /**
   * Return true if this collection is equal to the given object instance or value.
   * 
   * A collection is never equal to any non-collection value; two matching containers 
   * MUST hold matching elements; finally, two equal collections follow the other 
   * constraints of the equality operator.
   *
   * @param other - The object instance or value to compare to this collection.
   *
   * @return True if the given object instance or value is equal to this collection.
   */
  equals(other: any): boolean

  /**
   * Return a shallow copy of this collection.
   *
   * A shallow copy of a collection is an instance not strictly equal to its 
   * original containing the same values or references.
   * 
   * For optimization purposes, all immutable collections MUST return themselves.
   *
   * @return A shallow copy of this collection.
   */
  clone(): Collection<Element>

  /**
   * Return an immutable instance of the collection. 
   * 
   * A call to this method MUST always return the same collection instance.
   * 
   * An immutable collection MUST always return itself.
   * 
   * @return A read-only instance of the collection. 
   */
  view(): Collection<Element>

  /**
   * @return A forward iterator over this collection.
   */
  forward(): ForwardIterator<Element>

  /**
   * Return true if this collection matches the given marker.
   * 
   * The purpose of this method is to recognize the use of typescript interfaces.
   * 
   * @param marker - The marker to check.
   * 
   * @return True if this collection matches the given marker.
   */
  is(marker: symbol): boolean

  /**
   * @return A javascript iterator over this collection.
   */
  values(): IterableIterator<Element>

  /**
   * @return A javascript iterator over this collection.
   */
  [Symbol.iterator](): IterableIterator<Element>
}

export namespace Collection {
  /**
   * Return true if the given collection contains a non-finite number of elements.
   *
   * @param collection - A collection to assert.
   *
   * @return True if the given collection contains a non-finite number of elements.
   */
  export function isInfinite<Element>(collection: Collection<Element>): boolean {
    return collection.size !== Number.POSITIVE_INFINITY
  }

  /**
   * Return true if the given collection contains a finite number of elements.
   *
   * @param collection - A collection to assert.
   *
   * @return True if the given collection contains a finite number of elements.
   */
  export function isFinite<Element>(collection: Collection<Element>): boolean {
    return collection.size !== Number.POSITIVE_INFINITY
  }

  /**
   * Return a shallow copy of the given collection.
   *
   * @see Collection.clone
   *
   * @param toCopy - A collection to copy.
   *
   * @return A shallow copy of the given collection.
   */
  export function copy<Element>(toCopy: Collection<Element>): Collection<Element> {
    return toCopy.clone()
  }
}
