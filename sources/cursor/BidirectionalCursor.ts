import { ForwardCursor } from './ForwardCursor'
import { createBidirectionalCursorView } from './BidirectionalCursorView'
import { EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE } from './EmptyRandomAccessCursor'

/**
* A cursor over a sequence of values that can move from an element to its consecutive or preceding one.
*/
export interface BidirectionalCursor<Element> extends ForwardCursor<Element> {
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
   * @see {@link ForwardCursor.clone}
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
   * @see {@link ForwardCursor.view}
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
  export const EMPTY: BidirectionalCursor<any> = EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE

  /**
   * 
   */
  export function empty<T>(): BidirectionalCursor<T> {
    return EMPTY
  }

  /**
   * @see {@link createBidirectionalCursorView}
   */
  export const view = createBidirectionalCursorView
}