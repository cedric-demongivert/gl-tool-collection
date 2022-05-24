import { Mark, Markable } from '../mark'
import { BidirectionalCursor } from './BidirectionalCursor'
import { EmptyRandomAccessCursor } from './EmptyRandomAccessCursor'
import { RandomAccessCursorView } from './RandomAccessCursorView'

/**
* 
*/
export interface RandomAccessCursor<Element> extends BidirectionalCursor<Element> {
  /**
   * @see Clonable.prototype.clone
   */
  clone(): RandomAccessCursor<Element>

  /**
   * @see Cursor.prototype.view
   */
  view(): RandomAccessCursor<Element>
}

/**
 * 
 */
export namespace RandomAccessCursor {
  /**
   * 
   */
  export const MARK: Mark = Symbol('gl-tool-collection/mark/cursor/random-access')

  /**
   * @see Mark.Container
   */
  export function mark(): Mark {
    return MARK
  }

  /**
   * 
   */
  export function is<Element>(instance: Markable): instance is RandomAccessCursor<Element> {
    return instance.is(MARK)
  }

  /**
   * @see EmptyRandomAccessCursor.INSTANCE
   */
  export const EMPTY = EmptyRandomAccessCursor.INSTANCE

  /**
   * @see EmptyRandomAccessCursor.get
   */
  export const empty = EmptyRandomAccessCursor.get

  /**
   * @see RandomAccessCursorView.wrap
   */
  export const view = RandomAccessCursorView.wrap
}