import type { Comparable, Clonable } from '@cedric-demongivert/gl-tool-utils'
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
   * Returns true if the collection contains the requested element.
   * 
   * For more information about the equality relationship used by 
   * this method, look at your collection implementation. 
   *
   * @param element - An element to search for.
   *
   * @returns True if the collection contains the requested element.
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
