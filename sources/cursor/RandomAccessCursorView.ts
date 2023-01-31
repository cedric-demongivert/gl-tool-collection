import { RandomAccessCursor } from "./RandomAccessCursor"
import { BidirectionalCursorView } from "./BidirectionalCursorView"

/**
 * 
 */
export class RandomAccessCursorView<
  Element,
  Wrappable extends RandomAccessCursor<Element> = RandomAccessCursor<Element>
> extends BidirectionalCursorView<Element, Wrappable> implements RandomAccessCursor<Element> {
  /**
   * @see {@link RandomAccessCursor.clone}
   */
  public clone(): RandomAccessCursorView<Element, Wrappable> {
    return new RandomAccessCursorView(this._cursor)
  }
}

/**
 * 
 */
export function createRandomAccessCursorView<
  Element,
  Wrappable extends RandomAccessCursor<Element> = RandomAccessCursor<Element>
>(cursor: Wrappable): RandomAccessCursorView<Element, Wrappable> {
  return new RandomAccessCursorView(cursor)
}