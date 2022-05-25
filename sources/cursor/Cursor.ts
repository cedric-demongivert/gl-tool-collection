import { Clonable, Comparable } from '@cedric-demongivert/gl-tool-utils'

import { Mark, Markable } from '../mark'
import { CursorView } from './CursorView'
import { EmptyCursor } from './EmptyCursor'
import { NativeCursor } from './NativeCursor'

/**
 * A cursor over a collection.
 */
export interface Cursor<Element> extends Comparable, Clonable, Markable {
  /**
   * @see Clonable.prototype.clone
   */
  clone(): Cursor<Element>

  /**
   * Resolves and returns the element pointed by this cursor.
   * 
   * @returns The element pointed by this cursor.
   */
  get(): Element | undefined

  /**
   * Return an immutable instance of the cursor. 
   * 
   * An immutable cursor MUST always return itself.
   * 
   * @returns A read-only instance of the cursor. 
   */
  view(): Cursor<Element>
}


/**
 * 
 */
export namespace Cursor {
  /**
   * 
   */
  export const MARK: Mark = Symbol('gl-tool-collection/mark/cursor')

  /**
   * @see Mark.Container
   */
  export function mark(): Mark {
    return MARK
  }

  /**
   * 
   */
  export function is<Element>(instance: Markable): instance is Cursor<Element> {
    return instance.is(MARK)
  }

  /**
   * @see EmptyForwardCursor.INSTANCE
   */
  export const EMPTY = EmptyCursor.INSTANCE

  /**
   * @see EmptyForwardCursor.get
   */
  export const empty = EmptyCursor.get

  /**
   * @see CursorView.wrap
   */
  export const view = CursorView.wrap

  /**
   * @see NativeCursor.from
   */
  export const fromIterator = NativeCursor.from
}
