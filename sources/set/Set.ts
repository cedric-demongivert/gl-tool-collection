import { Clearable, Clonable } from '@cedric-demongivert/gl-tool-utils'
import { Collection } from '../Collection'
import { Group } from './Group'

/**
 * A set is an unordered collection that does not accept duplicates.
 */
export interface Set<Element> extends Group<Element>, Clearable, Clonable {
  /**
   * @see {@link Collection.isSet}
   */
  isSet(): true

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
   * @see {@link Collection.view}
   */
  view(): Group<Element>

  /**
   * @see {@link Clonable.clone}
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
  export function is<Element>(collection: Collection<Element>): collection is Set<Element> {
    return collection.isSet()
  }
}
