import { ForwardCursor } from './ForwardCursor'
import { BidirectionalCursorView } from './BidirectionalCursorView'
import { EmptyBidirectionalCursor } from './EmptyBidirectionalCursor'
import { Cursor } from './Cursor'

/**
* A cursor over a sequence of values that can move from an element to its consecutive or preceding one.
*/
export interface BidirectionalCursor<Element> extends ForwardCursor<Element> {
  /**
   * @see Cursor.prototype.isBidirectional
   */
  isBidirectional(): true

  /**
   * Moves this cursor to the requested element.
   * 
   * @param index - Index of the element to move to.
   * 
   * @returns This cursor instance for chaining purposes.
   */
  at(index: number): void

  /**
   * Moves this cursor backward of the given number of elements.
   *
   * @param count - Number of elements to skip.
   * 
   * @returns This cursor instance for chaining purposes.
   */
  backward(count: number): void

  /**
   * @see Clonable.prototype.clone
   */
  clone(): BidirectionalCursor<Element>

  /**
   * Returns true if this cursor points to the start of its underlying sequence.
   * 
   * @returns True if this cursor points to the start of its underlying sequence.
   */
  isStart(): boolean

  /**
   * Moves this cursor to the previously available element or the start of its underlying sequence.
   * 
   * @returns This cursor instance for chaining purposes.
   */
  previous(): void

  /**
   * @see Cursor.prototype.view
   */
  view(): BidirectionalCursor<Element>
}

/**
 * 
 */
export namespace BidirectionalCursor {
  /**
   * 
   */
  export function is<Element>(instance: Cursor<Element>): instance is BidirectionalCursor<Element> {
    return instance.isBidirectional()
  }

  /**
   * @see EmptyBidirectionalCursor.INSTANCE
   */
  export const EMPTY = EmptyBidirectionalCursor.INSTANCE

  /**
   * @see EmptyBidirectionalCursor.get
   */
  export const empty = EmptyBidirectionalCursor.get

  /**
   * @see BidirectionalCursor.wrap
   */
  export const view = BidirectionalCursorView.wrap
}