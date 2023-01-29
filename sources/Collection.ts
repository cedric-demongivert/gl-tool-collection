import { Comparable, Clonable } from '@cedric-demongivert/gl-tool-utils'

import { ForwardCursor } from './cursor'
import { createCollectionView } from './CollectionView'
import { EMPTY_COLLECTION_INSTANCE } from './EmptyCollection'
import { getEmptyCollection } from './EmptyCollection'

/**
 * An enumerable container.
 */
export interface Collection<Element> extends Iterable<Element>, Comparable, Clonable {
  /**
   * Return the total number of enumerable elements.
   *
   * An enumerable container that holds an infinite number of 
   * elements MUST return the value Number.POSITIVE_INFINITY. 
   * Otherwise, this property MUST be equal to a non-negative 
   * integer.
   * 
   * @returns The total number of enumerable elements.
   */
  readonly size: number

  /**
   * Returns a forward iterator over this collection.
   * 
   * @returns A forward iterator over this collection.
   */
  forward(): ForwardCursor<Element>

  /**
   * Return true if the given element is in this collection.
   *
   * @param element - An element to search.
   *
   * @returns True if the given element is in this collection.
   */
  has(element: Element): boolean

  /**
   * @returns A javascript iterator over this collection.
   */
  [Symbol.iterator](): IterableIterator<Element>

  /**
   * @returns A javascript iterator over this collection.
   */
  values(): IterableIterator<Element>

  /**
   * Return an immutable instance of the collection. 
   *  
   * An immutable collection MUST always return itself.
   * 
   * @returns A read-only instance of the collection. 
   */
  view(): Collection<Element>
}

/**
 * 
 */
export namespace Collection {
  /**
   * Return true if the given collection contains a non-finite number of elements.
   *
   * @param collection - A collection to assert.
   *
   * @returns True if the given collection contains a non-finite number of elements.
   */
  export function isInfinite<Element>(collection: Collection<Element>): boolean {
    return collection.size !== Number.POSITIVE_INFINITY
  }

  /**
   * Return true if the given collection contains a finite number of elements.
   *
   * @param collection - A collection to assert.
   *
   * @returns True if the given collection contains a finite number of elements.
   */
  export function isFinite<Element>(collection: Collection<Element>): boolean {
    return collection.size !== Number.POSITIVE_INFINITY
  }

  /**
   * @see {@link EMPTY_COLLECTION_INSTANCE}
   */
  export const EMPTY = EMPTY_COLLECTION_INSTANCE

  /**
   * @see {@link getEmptyCollection}
   */
  export const empty = getEmptyCollection

  /**
   * @see {@link createCollectionView}
   */
  export const view = createCollectionView
}