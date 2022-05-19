import { BidirectionalCursor } from './BidirectionalCursor'

/**
* A cursor over a sequence of values that can move from an element to its consecutive or preceding one.
*/
export interface RandomAccessCursor<Element> extends BidirectionalCursor<Element> {
  /**
   * @see Clonable.prototype.clone
   */
  clone(): RandomAccessCursor<Element>
}
