import { ForwardCursor } from './cursor/ForwardCursor'

import { Collection } from './Collection'
import { areEquallyConstructed } from './areEquallyConstructed'
import { Comparator } from '@cedric-demongivert/gl-tool-utils'

/**
 * An empty collection, e.g., a collection of zero elements.
 */
export class EmptyCollection<Element> implements Collection<Element> {
  /**
   * @see {@link Collection.size}
   */
  public get size(): number {
    return 0
  }

  /**
   * @see {@link Collection.has}
   */
  public has(element: Element): false {
    return false
  }

  /**
   * @see {@link Clonable.clone}
   */
  public clone(): this {
    return this
  }

  /**
   * @see {@link Collection.view}
   */
  public view(): this {
    return this
  }

  /**
   * @see {@link Collection.forward}
   */
  public forward(): ForwardCursor<Element> {
    return ForwardCursor.empty()
  }

  /**
   * @see {@link Collection.values}
   */
  public *values(): IterableIterator<Element> {

  }

  /**
   * @see {@link Collection[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this.values()
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: unknown): boolean {
    if (other === this) return true

    return areEquallyConstructed(other, this)
  }

  /**
   * 
   */
  public stringify(): string {
    return EMPTY_COLLECTION_STRING
  }
}

/**
 * 
 */
export const EMPTY_COLLECTION_STRING: string = '∅'


/**
 * 
 */
export const EMPTY_COLLECTION_INSTANCE: EmptyCollection<any> = new EmptyCollection<any>()


/**
 * 
 */
export function getEmptyCollection<Element>(): EmptyCollection<Element> {
  return EMPTY_COLLECTION_INSTANCE
}