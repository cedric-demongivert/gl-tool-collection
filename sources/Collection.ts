import type { Comparable, Clonable, Comparator } from '@cedric-demongivert/gl-tool-utils'
import type { ForwardCursor } from './cursor/ForwardCursor'

/**
 * An enumerable container.
 */
export interface Collection<Element> extends Iterable<Element>, Comparable, Clonable {
  /**
   * Returns the number of elements in the collection.
   *
   * An enumerable container that holds an infinite number of elements MUST return 
   * the value Number.POSITIVE_INFINITY. Otherwise, this property MUST be equal to 
   * a non-negative integer.
   * 
   * @returns The number of elements in the collection.
   */
  readonly size: number

  /**
   * Returns a forward iterator over this collection.
   * 
   * @returns A forward iterator over this collection.
   */
  forward(): ForwardCursor<Element>

  /**
   * Returns true if an element of this collection is equal to the given key.
   * 
   * By default, a collection will compare the given key with the {@link Comparator.compareWithOperator} comparator.
   *
   * @param key - A key to search for.
   * @param [comparator=Comparator.compareWithOperator] - A comparison procedure between the key and the elements of the collection.
   *
   * @returns True if the given element is in this collection.
   */
  has<Key = Element>(key: Key, comparator?: Comparator<Key, Element>): boolean

  /**
   * @returns A javascript iterator over this collection.
   */
  [Symbol.iterator](): IterableIterator<Element>

  /**
   * @returns A javascript iterator over this collection.
   */
  values(): IterableIterator<Element>

  /**
   * Returns a readonly instance of the collection. 
   *  
   * A readonly collection MUST always return itself.
   * 
   * @returns A read-only instance of the collection. 
   */
  view(): Collection<Element>

  /**
   * @returns A string representation of the collection.
   */
  stringify(): string
}
