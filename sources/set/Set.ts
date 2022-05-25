import { Clearable, Clonable } from '@cedric-demongivert/gl-tool-utils'
import { Mark, Markable } from '../mark'
import { Group } from './Group'

/**
 * A set is an unordered collection that does not accept duplicates.
 */
export interface Set<Element> extends Group<Element>, Clearable, Clonable {
  /**
   * Add a new element to the set.
   *
   * @param value - Elementhe value to add to the set.
   */
  add(value: Element): void

  /**
   * Remove an element from the set.
   *
   * @param value - Elementhe value to remove from the set.
   */
  delete(value: Element): void

  /**
   * Shallow copy an existing set instance.
   *
   * @param toCopy - An existing set instance to shallow copy.
   */
  copy(toCopy: Group<Element>): void

  /**
   * @see Collection.prototype.view
   */
  view(): Group<Element>

  /**
   * @see Clonable.prototype.clone
   */
  clone(): Set<Element>
}

/**
 * 
 */
export namespace Set {
  /**
   * 
   */
  export const MARK: Mark = Symbol('gl-tool-collection/mark/collection/set')

  /**
   * @see Mark.Container
   */
  export function mark(): Mark {
    return MARK
  }

  /**
   * Return true if the given collection is a set.
   *
   * @param collection - A collection to assert.
   *
   * @returns True if the given collection is a set.
   */
  export function is<Element>(collection: Markable): collection is Set<Element> {
    return collection.is(MARK)
  }
}
