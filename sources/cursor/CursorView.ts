import { Cursor } from "./Cursor"

/**
 * 
 */
export class CursorView<Element> implements Cursor<Element> {
  /**
   * 
   */
  private _cursor: Cursor<Element>

  /**
   * Create a view over the given cursor.
   * 
   * @param cursor - A cursor instance to wrap.
   */
  public constructor(cursor: Cursor<Element>) {
    this._cursor = cursor
  }

  /**
   * @see {@link Cursor.clone}
   */
  public clone(): CursorView<Element> {
    return new CursorView(this._cursor)
  }

  /**
   * @see {@link Cursor.equals}
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof CursorView) {
      return other._cursor === this._cursor
    }

    return false
  }

  /**
   * @see {@link Cursor.get}
   */
  public get(): Element | undefined {
    return this._cursor.get()
  }

  /**
   * @see {@link Cursor.view}
   */
  public view(): this {
    return this
  }

  /**
   * 
   */
  public setCursor(cursor: Cursor<Element>): void {
    this._cursor = cursor
  }

  /**
   * 
   */
  public hasCursor(cursor: Cursor<Element>): boolean {
    return this._cursor === cursor
  }
}

/**
 * 
 */
export function createCursorView<Element>(cursor: Cursor<Element>): CursorView<Element> {
  return new CursorView(cursor)
}