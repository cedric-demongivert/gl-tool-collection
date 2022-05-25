import { Markable } from '../mark'
import { Sequence } from '../sequence'
import { EmptyOrderedGroup } from './EmptyOrderedGroup'
import { Group } from './Group'
import { OrderedGroupView } from './OrderedGroupView'

/**
 * 
 */
export interface OrderedGroup<Element> extends Group<Element>, Sequence<Element> {
  /**
   * @see Clonable.prototype.clone
   */
  clone(): OrderedGroup<Element>

  /**
   * @see Collection.prototype.view
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
  export function is<Element>(collection: Markable): collection is OrderedGroup<Element> {
    return Group.is(collection) && Sequence.is(collection)
  }

  /**
   * @see EmptyOrderedGroup.INSTANCE
   */
  export const EMPTY = EmptyOrderedGroup.INSTANCE

  /**
   * @see EmptyOrderedGroup.get
   */
  export const empty = EmptyOrderedGroup.get

  /**
   * @see OrderedGroupView.wrap
   */
  export const view = OrderedGroupView.wrap
}
