import { Mark, protomark, Readonly } from "../mark"
import { Cursor } from "./Cursor"
import { ForwardCursor } from "./ForwardCursor"

/**
 * 
 */
@protomark(Cursor)
@protomark(ForwardCursor)
@protomark(Readonly)
export class ForwardCursorView<Element> implements ForwardCursor<Element> {
  /**
   * 
   */
  private _cursor: ForwardCursor<Element>

  /**
   * @see ForwardCursor.prototype.index
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
   * @see ForwardCursor.prototype.clone
   */
  public clone(): ForwardCursorView<Element> {
    return new ForwardCursorView(this._cursor)
  }

  /**
   * 
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof ForwardCursorView) {
      return other._cursor.equals(this._cursor)
    }

    return false
  }

  /**
   * @see ForwardCursor.prototype.forward
   */
  public forward(count: number): void {
    this._cursor.forward(count)
  }

  /**
   * @see Cursor.prototype.get
   */
  public get(): Element | undefined {
    return this._cursor.get()
  }

  /**
   * @see ForwardCursor.prototype.isEnd
   */
  public isEnd(): boolean {
    return this._cursor.isEnd()
  }

  /**
   * @see ForwardCursor.prototype.isInside
   */
  public isInside(): boolean {
    return this._cursor.isInside()
  }

  /**
   * @see ForwardCursor.prototype.next
   */
  public next(): void {
    this._cursor.next()
  }

  /**
   * 
   */
  public wrap(cursor: ForwardCursor<Element>): void {
    this._cursor = cursor
  }

  /**
   * @see Cursor.prototype.view
   */
  public view(): this {
    return this
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
export namespace ForwardCursorView {
  /**
   * 
   */
  export function wrap<Element>(cursor: ForwardCursor<Element>): ForwardCursorView<Element> {
    return new ForwardCursorView(cursor)
  }
}