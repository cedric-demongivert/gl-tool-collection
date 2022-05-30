import { Clonable, Comparable } from '@cedric-demongivert/gl-tool-utils'

import { EmptyCursor } from './EmptyCursor'
import { CursorView } from './CursorView'
import { NativeCursor } from './NativeCursor'
import { BidirectionalCursor } from './BidirectionalCursor'
import { ForwardCursor } from './ForwardCursor'
import { RandomAccessCursor } from './RandomAccessCursor'

/**
 * A cursor over a collection.
 */
export interface Cursor<Element> extends Comparable, Clonable {
  /**
   * 
   */
  isBidirectional(): this is BidirectionalCursor<Element>

  /**
   * 
   */
  isForward(): this is ForwardCursor<Element>

  /**
   * 
   */
  isRandomAccess(): this is RandomAccessCursor<Element>

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