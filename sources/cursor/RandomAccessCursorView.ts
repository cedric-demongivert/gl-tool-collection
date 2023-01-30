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

  /**
   * 
   */
  public equals(other: unknown): boolean {
    if (other === this) return true

    if (isRandomAccessCursorView(other)) {
      return other._cursor === this._cursor
    }

    return false
  }
}

/**
 * 
 */
export function isRandomAccessCursorView<Element>(candidate: unknown): candidate is RandomAccessCursorView<Element, never> {
  return candidate != null && candidate.constructor === RandomAccessCursorView
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