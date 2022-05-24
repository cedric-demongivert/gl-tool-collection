import { protomark, Readonly } from "../mark"
import { BidirectionalCursor } from "./BidirectionalCursor"
import { Cursor } from "./Cursor"
import { ForwardCursor } from "./ForwardCursor"

/**
 * 
 */
@protomark(Cursor)
@protomark(ForwardCursor)
@protomark(BidirectionalCursor)
@protomark(Readonly)
export class BidirectionalCursorView<Element> implements BidirectionalCursor<Element> {
  /**
   * 
   */
  private _cursor: BidirectionalCursor<Element>

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
  public constructor(cursor: BidirectionalCursor<Element>) {
    this._cursor = cursor
  }

  /**
   * @see BidirectionalCursor.prototype.clone
   */
  public clone(): BidirectionalCursorView<Element> {
    return new BidirectionalCursorView(this._cursor)
  }

  /**
   * 
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof BidirectionalCursorView) {
      return other._cursor.equals(this._cursor)
    }

    return false
  }

  /**
   * @see BidirectionalCursor.prototype.at
   */
  public at(index: number): void {
    this._cursor.at(index)
  }

  /**
   * @see ForwardCursor.prototype.forward
   */
  public forward(count: number): void {
    this._cursor.forward(count)
  }

  /**
   * @see BidirectionalCursor.prototype.backward
   */
  public backward(count: number): void {
    this._cursor.backward(count)
  }

  /**
   * @see BidirectionalCursor.prototype.isStart
   */
  public isStart(): boolean {
    return this._cursor.isStart()
  }

  /**
   * @see Cursor.prototype.get
   */
  public get(): Element | undefined {
    return this._cursor.get()
  }

  /**
   * @see Cursor.prototype.is
   */
  public is = protomark.is

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
   * @see BidirectionalCursor.prototype.previous
   */
  public previous(): void {
    return this._cursor.previous()
  }

  /**
   * 
   */
  public wrap(cursor: BidirectionalCursor<Element>): void {
    this._cursor = cursor
  }

  /**
   * @see Cursor.prototype.view
   */
  public view(): this {
    return this
  }
}

/**
 * 
 */
export namespace BidirectionalCursorView {
  /**
   * 
   */
  export function wrap<Element>(cursor: BidirectionalCursor<Element>): BidirectionalCursorView<Element> {
    return new BidirectionalCursorView(cursor)
  }
}