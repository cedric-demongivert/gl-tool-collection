import { Mark, protomark, Readonly } from "../mark"
import { Cursor } from "./Cursor"

/**
 * 
 */
@protomark(Readonly)
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
   * @see ForwardCursor.prototype.clone
   */
  public clone(): CursorView<Element> {
    return new CursorView(this._cursor)
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof CursorView) {
      return other._cursor.equals(this._cursor)
    }

    return false
  }

  /**
   * @see Cursor.prototype.get
   */
  public get(): Element | undefined {
    return this._cursor.get()
  }

  /**
   * @see Cursor.prototype.view
   */
  public view(): this {
    return this
  }

  /**
   * 
   */
  public wrap(cursor: Cursor<Element>): void {
    this._cursor = cursor
  }

  /**
   * @see Markable.prototype.is
   */
  public is(markLike: Mark.Alike): boolean {
    return protomark.is(this.constructor, markLike)
  }
}

/**
 * 
 */
export namespace CursorView {
  /**
   * 
   */
  export function wrap<Element>(cursor: Cursor<Element>): CursorView<Element> {
    return new CursorView(cursor)
  }
}