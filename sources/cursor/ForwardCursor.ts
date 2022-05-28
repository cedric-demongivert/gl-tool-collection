import { Markable, Mark } from '../mark'
import { Cursor } from './Cursor'

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
   * @see CollectionIterator.clone
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
   * Moves this cursor to the next available element or the end of its underlying sequence.
   */
  next(): void

  /**
   * @see Cursor.prototype.view
   */
  view(): ForwardCursor<Element>
}

/**
 * 
 */
export namespace ForwardCursor {
  /**
   * 
   */
  export const MARK: Mark = Symbol('gl-tool-collection/mark/cursor/forward')

  /**
   * @see Mark.Container
   */
  export function mark(): Mark {
    return MARK
  }

  /**
   * 
   */
  export function is<Element>(instance: Markable): instance is ForwardCursor<Element> {
    return instance.is(MARK)
  }
}

import { EmptyForwardCursor } from './EmptyForwardCursor'
import { ForwardCursorView } from './ForwardCursorView'

/**
 * 
 */
export namespace ForwardCursor {
  /**
   * @see EmptyForwardCursor.INSTANCE
   */
  export const EMPTY = EmptyForwardCursor.INSTANCE

  /**
   * @see EmptyForwardCursor.get
   */
  export const empty = EmptyForwardCursor.get

  /**
   * @see ForwardCursorView.wrap
   */
  export const view = ForwardCursorView.wrap
}