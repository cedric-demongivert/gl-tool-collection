import { Collection } from "../Collection"

/**
 * 
 */
export interface EmptyCollection<Element> extends Collection<Element> {
  /**
   * 
   */
  is(marker: EmptyCollection.MARKER): true
  /**
   * 
   */
  is(marker: symbol): boolean
}

/**
 * 
 */
export namespace EmptyCollection {
  /**
   * 
   */
  export const MARKER: unique symbol = Symbol('gl-tool-collection/empty-marker')

  /**
   * 
   */
  export type MARKER = typeof MARKER

  /**
   * Return true if the given collection is immutable.
   *
   * @param collection - A collection to assert.
   *
   * @return True if the given collection is immutable.
   */
  export function is<Element>(collection: Collection<Element>): collection is EmptyCollection<Element> {
    return collection.is(MARKER)
  }
}
