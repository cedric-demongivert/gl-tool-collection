import { ForwardCursor } from "./ForwardCursor"
import { CursorView } from "./CursorView"

/**
 * 
 */
export class ForwardCursorView<
  Element, 
  Wrappable extends ForwardCursor<Element> = ForwardCursor<Element>
> extends CursorView<Element, Wrappable> implements ForwardCursor<Element> {
  /**
   * @see {@link ForwardCursor.index}
   */
  public get index(): number {
    return this._cursor.index
  }

  /**
   * @see {@link ForwardCursor.clone}
   */
  public clone(): ForwardCursorView<Element, Wrappable> {
    return new ForwardCursorView(this._cursor)
  }

  /**
   * @see {@link ForwardCursor.equals}
   */
  public equals(other: unknown): boolean {
    if (other === this) return true

    if (isForwardCursorView(other)) {
      return other._cursor === this._cursor
    }

    return false
  }

  /**
   * @see {@link ForwardCursor.forward}
   */
  public forward(count: number): void {
    this._cursor.forward(count)
  }

  /**
   * @see {@link ForwardCursor.isEnd}
   */
  public isEnd(): boolean {
    return this._cursor.isEnd()
  }

  /**
   * @see {@link ForwardCursor.isInside}
   */
  public isInside(): boolean {
    return this._cursor.isInside()
  }

  /**
   * @see {@link ForwardCursor.next}
   */
  public next(): void {
    this._cursor.next()
  }
}

/**
 * 
 */
export function isForwardCursorView<Element>(candidate: unknown): candidate is ForwardCursorView<Element, never> {
  return candidate != null && candidate.constructor === ForwardCursorView
}

/**
 * 
 */
export function createForwardCursorView<
  Element,
  Wrappable extends ForwardCursor<Element> = ForwardCursor<Element>
>(cursor: Wrappable): ForwardCursorView<Element, Wrappable> {
  return new ForwardCursorView(cursor)
}