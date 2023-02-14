import { EMPTY_ORDERED_GROUP_INSTANCE } from './EmptyOrderedGroup'
import { getEmptyOrderedGroup } from './EmptyOrderedGroup'
import { createOrderedGroupView } from './OrderedGroupView'

/**
 * 
 */
export namespace OrderedGroups {
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
