import { Clonable, Comparable } from '@cedric-demongivert/gl-tool-utils'

/**
 * A cursor over a collection.
 */
export interface Cursor<Element> extends Comparable, Clonable {
  /**
   * @see Clonable.prototype.clone
   */
  clone(): Cursor<Element>

  /**
   * @return The element pointed by this cursor.
   */
  get(): Element | undefined
}
