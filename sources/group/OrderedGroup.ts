import { Collection } from '../Collection'
import { Sequence } from '../sequence/Sequence'
import { Group } from './Group'
import { EMPTY_ORDERED_GROUP_INSTANCE } from './EmptyOrderedGroup'
import { getEmptyOrderedGroup } from './EmptyOrderedGroup'
import { createOrderedGroupView } from './OrderedGroupView'

/**
 * 
 */
export interface OrderedGroup<Element> extends Group<Element>, Sequence<Element> {
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
   * @see {@link EMPTY_ORDERED_GROUP_INSTANCE}
   */
  export const EMPTY = EMPTY_ORDERED_GROUP_INSTANCE

  /**
   * @see {@link getEmptyOrderedGroup}
   */
  export const empty = getEmptyOrderedGroup

  /**
   * @see {@link createOrderedGroupView}
   */
  export const view = createOrderedGroupView
}
