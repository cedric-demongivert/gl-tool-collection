import { Mark, Markable } from './mark'
import { StaticCollection } from './StaticCollection'

/**
 * A re-allocable collection is a static collection that allows changing its capacity on the fly.
 */
export interface ReallocableCollection extends StaticCollection {
  /**
   * Update the capacity of this collection by reallocating it.
   * 
   * A reallocation may change the internal state of the collection notably if its previous 
   * size exceeds its new capacity. The implementation used MUST discard all extra elements 
   * during the operation.
   *
   * @param capacity - The new capacity to allocate.
   */
  reallocate(capacity: number): void

  /**
   * Reallocate this collection to match its capacity to the number of elements that it contains.
   */
  fit(): void
}

/**
 * 
 */
export namespace ReallocableCollection {

  /**
   * 
   */
  export namespace StaticCollection {
    /**
     * 
     */
    export const MARK: Mark = Symbol('gl-tool-collection/mark/reallocable-collection')

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
     * @return True if the given collection is a sequence.
     */
    export function is(collection: Markable): collection is ReallocableCollection {
      return collection.is(MARK)
    }
  }
}
