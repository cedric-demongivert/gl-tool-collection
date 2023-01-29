import { Clonable, Comparable } from '@cedric-demongivert/gl-tool-utils'

import { EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE } from './EmptyRandomAccessCursor'
import { createCursorView } from './CursorView'
import { NativeCursor } from '../native/NativeCursor'

/**
 * A cursor over a collection.
 */
export interface Cursor<Element> extends Comparable, Clonable {
  /**
   * Returns the element pointed by this cursor.
   * 
   * @returns The element pointed by this cursor.
   */
  get(): Element | undefined

  /**
   * Returns a readonly instance of the cursor. 
   * 
   * A readonly cursor MUST always return itself.
   * 
   * @returns A read-only instance of the cursor. 
   */
  view(): Cursor<Element>
  
  /**
   * @see {@link Clonable.clone}
   */
  clone(): Cursor<Element>
}

/**
 * 
 */
export namespace Cursor {
  /**
   * 
   */
  export const EMPTY: Cursor<any> = EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE

  /**
   * 
   */
  export function empty<T>(): Cursor<T> {
    return EMPTY
  }

  /**
   * @see {@link createCursorView}
   */
  export const view = createCursorView

  /**
   * @see {@link NativeCursor.from}
   */
  export const fromIterator = NativeCursor.from
}