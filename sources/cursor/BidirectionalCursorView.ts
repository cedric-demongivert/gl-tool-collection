import { BidirectionalCursor } from "./BidirectionalCursor"
import { ForwardCursorView } from "./ForwardCursorView"

/**
 * 
 */
export class BidirectionalCursorView<
  Element,
  Wrappable extends BidirectionalCursor<Element> = BidirectionalCursor<Element>
> extends ForwardCursorView<Element, Wrappable> implements BidirectionalCursor<Element> {
  /**
   * @see {@link BidirectionalCursor.clone}
   */
  public clone(): BidirectionalCursorView<Element, Wrappable> {
    return new BidirectionalCursorView(this._cursor)
  }

  /**
   * @see {@link BidirectionalCursor.at}
   */
  public at(index: number): void {
    this._cursor.at(index)
  }

  /**
   * @see {@link BidirectionalCursor.backward}
   */
  public backward(count: number): void {
    this._cursor.backward(count)
  }

  /**
   * @see {@link BidirectionalCursor.isStart}
   */
  public isStart(): boolean {
    return this._cursor.isStart()
  }

  /**
   * @see {@link BidirectionalCursor.previous}
   */
  public previous(): void {
    return this._cursor.previous()
  }
}
/**
 * 
 */
export function createBidirectionalCursorView<
  Element,
  Wrappable extends BidirectionalCursor<Element> = BidirectionalCursor<Element>
>(cursor: Wrappable): BidirectionalCursorView<Element, Wrappable> {
  return new BidirectionalCursorView(cursor)
}