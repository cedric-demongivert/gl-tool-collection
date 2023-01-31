import { areEquallyConstructed } from "../areEquallyConstructed"

import { Cursor } from "./Cursor"

/**
 * 
 */
export class CursorView<
  Element, 
  Wrappable extends Cursor<Element> = Cursor<Element>
> implements Cursor<Element> {
  /**
   * 
   */
  protected _cursor: Wrappable

  /**
   * Create a view over the given cursor.
   * 
   * @param cursor - A cursor instance to wrap.
   */
  public constructor(cursor: Wrappable) {
    this._cursor = cursor
  }

  /**
   * @see {@link Cursor.clone}
   */
  public clone(): CursorView<Element, Wrappable> {
    return new CursorView(this._cursor)
  }

  /**
   * @see {@link Cursor.equals}
   */
  public equals(other: unknown): boolean {
    if (other === this) return true

    if (areEquallyConstructed(other, this)) {
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
  public setCursor(cursor: Wrappable): void {
    this._cursor = cursor
  }

  /**
   * 
   */
  public hasCursor(cursor: unknown): boolean {
    return this._cursor === cursor
  }
}

/**
 * 
 */
export function createCursorView<
  Element, 
  Wrappable extends Cursor<Element> = Cursor<Element>
>(cursor: Wrappable): CursorView<Element, Wrappable> {
  return new CursorView(cursor)
}