import { Collection } from '../Collection'

/**
 * A group is a read-only, unordered collection that does not accept duplicates.
 */
export interface Group<Element> extends Collection<Element> {
  /**
   * @see {@link Collection.view}
   */
  view(): Group<Element>

  /**
   * @see {@link Collection.clone}
   */
  clone(): Group<Element>
}