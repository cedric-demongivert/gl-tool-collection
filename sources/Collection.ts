import { Comparable, Clonable } from '@cedric-demongivert/gl-tool-utils'

import { ForwardCursor } from './cursor'
import { Mark, Markable } from './mark'

/**
 * A collection is a container of elements.
 */
export interface Collection<Element> extends Iterable<Element>, Comparable, Clonable, Markable {
  /**
   * Return the number of elements in this collection.
   *
   * A container may hold an infinite number of elements, and for such cases, 
   * this property MUST return the value Number.POSITIVE_INFINITY. Otherwise, 
   * this property MUST return a non-negative integer equal to the number of 
   * elements in the collection.
   * 
   * @returns The number of elements in this collection.
   */
  readonly size: number

  /**
   * @see Clonable.prototype.clone
   */
  clone(): Collection<Element>

  /**
   * @see Comparable.prototype.equals
   */
  equals(other: unknown): boolean

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
   * 
   */
  export const MARK: Mark = Symbol('gl-tool-collection/mark/collection')

  /**
   * @see Mark.Container
   */
  export function mark(): Mark {
    return MARK
  }

  /**
   * Return true if the given collection is a sequence.
   *
   * @param collection - A collection to assert.
   *
   * @returns True if the given collection is a sequence.
   */
  export function is<Element>(collection: Markable): collection is Collection<Element> {
    return collection.is(MARK)
  }

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
}

import { CollectionView } from './CollectionView'
import { EmptyCollection } from './EmptyCollection'


/**
 * 
 */
export namespace Collection {
  /**
   * @see EmptyCollection.INSTANCE
   */
  export const EMPTY = EmptyCollection.INSTANCE

  /**
   * @see EmptyCollection.get
   */
  export const empty = EmptyCollection.get

  /**
   * @see CollectionView.wrap
   */
  export const view = CollectionView.wrap
}