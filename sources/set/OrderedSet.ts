import { Markable } from '../mark'
import { Sequence } from '../sequence'

import { Set } from './Set'
import { OrderedGroup } from './OrderedGroup'

/**
 * A set is an unordered collection that does not accept duplicates.
 */
export interface OrderedSet<Element> extends Set<Element>, Sequence<Element> {
  /**
   * @see Collection.prototype.view
   */
  view(): OrderedGroup<Element>

  /**
   * @see Clonable.prototype.clone
   */
  clone(): OrderedSet<Element>
}

/**
 * 
 */
export namespace OrderedSet {
  /**
   * Return true if the given collection is a set.
   *
   * @param collection - A collection to assert.
   *
   * @returns True if the given collection is a set.
   */
  export function is<Element>(collection: Markable): collection is OrderedSet<Element> {
    return Set.is(collection) && Sequence.is(collection)
  }
}
