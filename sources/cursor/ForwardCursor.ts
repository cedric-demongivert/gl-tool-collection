import { Cursor } from './Cursor'

import { EMPTY_FORWARD_CURSOR_INSTANCE } from './EmptyRandomAccessCursor'
import { getEmptyForwardCursor } from './EmptyRandomAccessCursor'
import { createForwardCursorView } from './ForwardCursorView'

/**
 * A cursor over a sequence of values that can only move from an element to its consecutive one.
 */
export interface ForwardCursor<Element> extends Cursor<Element> {
  /**
   * Returns the location of this cursor into its underlying sequence.
   * 
   * @returns Returns the location of this cursor into its underlying sequence.
   */
  readonly index: number

  /**
   * @see {@link Cursor.clone}
   */
  clone(): ForwardCursor<Element>

  /**
   * Moves this cursor forward of the given number of elements.
   *
   * @param count - Number of elements to skip.
   */
  forward(count: number): void

  /**
   * Returns true if this cursor points to the end of its underlying sequence.
   * 
   * @returns True if this cursor points to the end of its underlying sequence.
   */
  isEnd(): boolean

  /**
   * Returns true if this cursor points to an element of its underlying sequence.
   * 
   * @returns True if this cursor points to an element of its underlying sequence.
   */
  isInside(): boolean

  /**
   * Moves this cursor to the next available element or to the end of its underlying sequence.
   */
  next(): void
}

/**
 * 
 */
export namespace ForwardCursor {
  /**
   * @see {@link EMPTY_FORWARD_CURSOR_INSTANCE}
   */
  export const EMPTY: ForwardCursor<any> = EMPTY_FORWARD_CURSOR_INSTANCE

  /**
   * @see {@link getEmptyForwardCursor}
   */
  export const empty = getEmptyForwardCursor

  /**
   * @see {@link createForwardCursorView}
   */
  export const view = createForwardCursorView
}