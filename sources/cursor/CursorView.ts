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
   * @see Cursor.prototype.isRandomAccess
   */
  public isRandomAccess(): false {
    return false
  }

  /**
   * @see Cursor.prototype.isBidirectional
   */
  public isBidirectional(): false {
    return false
  }

  /**
   * @see Cursor.prototype.isForward
   */
  public isForward(): false {
    return false
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