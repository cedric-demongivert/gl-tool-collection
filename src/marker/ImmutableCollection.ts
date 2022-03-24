import { Collection } from "../Collection"

/**
 * 
 */
export interface ImmutableCollection<Element> extends Collection<Element> {
  /**
   * 
   */
  is(marker: ImmutableCollection.MARKER): true
  /**
   * 
   */
  is(marker: symbol): boolean
}

/**
 * 
 */
export namespace ImmutableCollection {
  /**
   * 
   */
  export const MARKER: unique symbol = Symbol('gl-tool-collection/immutable-marker')

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
  export function is<Element>(collection: Collection<Element>): collection is ImmutableCollection<Element> {
    return collection.is(MARKER)
  }
}
