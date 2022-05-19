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
   * @see ForwardCursor.prototype.forward
   */
  public get index(): number {
    return this._cursor.index
  }

  /**
   * Create a view of the given cursor.
   */
  public constructor(cursor: ForwardCursor<Element>) {
    this._cursor = cursor
  }

  /**
   * @see ForwardCursor.prototype.clone
   */
  public clone(): ForwardCursorView<Element> {
    return new ForwardCursorView(this._cursor.clone())
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
   * 
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
  public setCursor(cursor: ForwardCursor<Element>): void {
    this._cursor = cursor
  }
}
