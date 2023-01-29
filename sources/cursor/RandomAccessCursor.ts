import { BidirectionalCursor } from './BidirectionalCursor'
import { EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE, getEmptyRandomAccessCursor } from './EmptyRandomAccessCursor'
import { createRandomAccessCursorView } from './RandomAccessCursorView'

/**
* 
*/
export interface RandomAccessCursor<Element> extends BidirectionalCursor<Element> {
  /**
   * @see {@link Clonable.clone}
   */
  clone(): RandomAccessCursor<Element>

  /**
   * @see {@link Cursor.view}
   */
  view(): RandomAccessCursor<Element>
}

/**
 * 
 */
export namespace RandomAccessCursor {
  /**
   * @see {@link EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE}
   */
  export const EMPTY = EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE

  /**
   * @see {@link getEmptyRandomAccessCursor}
   */
  export const empty = getEmptyRandomAccessCursor

  /**
   * @see {@link createRandomAccessCursorView}
   */
  export const view = createRandomAccessCursorView
}