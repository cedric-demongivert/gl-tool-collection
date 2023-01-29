import { Sequence } from '../sequence'

import { Set } from './Set'
import { OrderedGroup } from './OrderedGroup'
import { Collection } from '../Collection'

/**
 * A set is an unordered collection that does not accept duplicates.
 */
export interface OrderedSet<Element> extends OrderedGroup<Element>, Set<Element> {
  /**
   * @see {@link Collection.isSequence}
   */
  isSequence(): true

  /**
   * @see {@link Collection.isSet}
   */
  isSet(): true

  /**
   * @see {@link Collection.view}
   */
  view(): OrderedGroup<Element>

  /**
   * @see {@link Clonable.clone}
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
  export function is<Element>(collection: Collection<Element>): collection is OrderedSet<Element> {
    return Set.is(collection) && Sequence.is(collection)
  }
}
