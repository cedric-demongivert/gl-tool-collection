import { OrderedGroup } from '../group/OrderedGroup'

import { OrderedSet } from './OrderedSet'

/**
 * 
 */
export interface SparseDenseSet extends OrderedSet<number> {
  /**
  * @see {@link Collection.view}
  */
  view(): OrderedGroup<number>

  /**
  * @see {@link Collection.clone}
  */
  clone(): SparseDenseSet
}
