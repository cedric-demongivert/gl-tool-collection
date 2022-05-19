import { Collection } from '../Collection'
import { Markable } from '../mark'

/**
 * A group is a read-only, unordered collection that does not accept duplicates.
 */
export interface Group<Element> extends Collection<Element>, Markable {
  /**
   * @see Clonable.prototype.clone
   */
  clone(): Group<Element>

  /**
   * @see Markable.prototype.is
   */
  is(marker: Group.MARK): true
}

/**
 * 
 */
export namespace Group {
  /**
   * 
   */
  export const MARK: unique symbol = Symbol('gl-tool-collection/group-mark')

  /**
   * 
   */
  export type MARK = typeof MARK

  /**
   * @see Markable.protomark
   */
  export const protomark = Markable.protomark(MARK)

  /**
   * Return true if the given collection is a pack.
   *
   * @param collection - A collection to assert.
   *
   * @return True if the given collection is a pack.
   */
  export function is<Element>(collection: Collection<Element>): collection is Group<Element> {
    return collection.is(MARK)
  }
}
