import { Clonable, Comparable } from '@cedric-demongivert/gl-tool-utils'

import { Markable } from '../mark'

/**
 * A cursor over a collection.
 */
export interface Cursor<Element> extends Comparable, Clonable, Markable {
  /**
   * @see Clonable.prototype.clone
   */
  clone(): Cursor<Element>

  /**
   * @return The element pointed by this cursor.
   */
  get(): Element | undefined
}
