import { Mark, Markable } from "./mark"

/**
 * A static collection is a collection that allocates all the memory it needs to store its element at its 
 * instantiation and does no further allocation after that.
 */
export interface StaticCollection extends Markable {
  /**
   * @returns The maximum number of elements that this collection can store with its current memory allocation.
   */
  readonly capacity: number
}

/**
 * 
 */
export namespace StaticCollection {
  /**
   * 
   */
  export const MARK: Mark = Symbol('gl-tool-collection/mark/static-collection')

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
  export function is(collection: Markable): collection is StaticCollection {
    return collection.is(MARK)
  }
}