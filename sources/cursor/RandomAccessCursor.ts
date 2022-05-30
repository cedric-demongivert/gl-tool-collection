import { BidirectionalCursor } from './BidirectionalCursor'
import { Cursor } from './Cursor'
import { EmptyRandomAccessCursor } from './EmptyRandomAccessCursor'
import { RandomAccessCursorView } from './RandomAccessCursorView'

/**
* 
*/
export interface RandomAccessCursor<Element> extends BidirectionalCursor<Element> {
  /**
   * @see Cursor.prototype.isRandomAccess
   */
  isRandomAccess(): true

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
  export function is<Element>(instance: Cursor<Element>): instance is RandomAccessCursor<Element> {
    return instance.isRandomAccess()
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