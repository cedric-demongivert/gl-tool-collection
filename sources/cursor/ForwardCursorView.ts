import { ForwardCursor } from "./ForwardCursor"

/**
 * 
 */
export class ForwardCursorView<Element> implements ForwardCursor<Element> {
  /**
   * 
   */
  private _cursor: ForwardCursor<Element>

  /**
   * @see {@link ForwardCursor.index}
   */
  public get index(): number {
    return this._cursor.index
  }

  /**
   * Create a view over the given cursor.
   * 
   * @param cursor - A cursor instance to wrap.
   */
  public constructor(cursor: ForwardCursor<Element>) {
    this._cursor = cursor
  }

  /**
   * @see {@link ForwardCursor.clone}
   */
  public clone(): ForwardCursorView<Element> {
    return new ForwardCursorView(this._cursor)
  }

  /**
   * @see {@link ForwardCursor.equals}
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof ForwardCursorView) {
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
   * @see {@link Cursor.get}
   */
  public get(): Element | undefined {
    return this._cursor.get()
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

  /**
   * 
   */
  public setCursor(cursor: ForwardCursor<Element>): void {
    this._cursor = cursor
  }

  /**
   * 
   */
  public hasCursor(cursor: ForwardCursor<Element>): boolean {
    return this._cursor === cursor
  }

  /**
   * @see {@link Cursor.view}
   */
  public view(): this {
    return this
  }
}

/**
 * 
 */
export function createForwardCursorView<Element>(cursor: ForwardCursor<Element>): ForwardCursorView<Element> {
  return new ForwardCursorView(cursor)
}