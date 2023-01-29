import { Collection } from '../Collection'
import { Sequence } from '../sequence'
import { EmptyOrderedGroup } from './EmptyOrderedGroup'
import { Group } from './Group'
import { OrderedGroupView } from './OrderedGroupView'

/**
 * 
 */
export interface OrderedGroup<Element> extends Group<Element>, Sequence<Element> {
  /**
   * @see {@link Collection.isSequence}
   */
  isSequence(): true

  /**
   * @see {@link Collection.isGroup}
   */
  isGroup(): true

  /**
   * @see {@link Clonable.clone}
   */
  clone(): OrderedGroup<Element>

  /**
   * @see {@link Collection.view}
   */
  view(): OrderedGroup<Element>
}


/**
 * 
 */
export namespace OrderedGroup {
  /**
   * Return true if the given collection is a group.
   *
   * @param collection - A collection to assert.
   *
   * @returns True if the given collection is a group.
   */
  export function is<Element>(collection: Collection<Element>): collection is OrderedGroup<Element> {
    return Group.is(collection) && Sequence.is(collection)
  }

  /**
   * @see {@link EmptyOrderedGroup.INSTANCE}
   */
  export const EMPTY = EmptyOrderedGroup.INSTANCE

  /**
   * @see {@link EmptyOrderedGroup.get}
   */
  export const empty = EmptyOrderedGroup.get

  /**
   * @see {@link OrderedGroupView.wrap}
   */
  export const view = OrderedGroupView.wrap
}
