import { BidirectionalCursor } from "./BidirectionalCursor"

/**
 * 
 */
export class BidirectionalCursorView<Element> implements BidirectionalCursor<Element> {
  /**
   * 
   */
  private _cursor: BidirectionalCursor<Element>

  /**
   * @see {@link BidirectionalCursor.index}
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
   * @see {@link BidirectionalCursor.clone}
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
      return other._cursor === this._cursor
    }

    return false
  }

  /**
   * @see {@link BidirectionalCursor.at}
   */
  public at(index: number): void {
    this._cursor.at(index)
  }

  /**
   * @see {@link BidirectionalCursor.forward}
   */
  public forward(count: number): void {
    this._cursor.forward(count)
  }

  /**
   * @see {@link BidirectionalCursor.backward}
   */
  public backward(count: number): void {
    this._cursor.backward(count)
  }

  /**
   * @see {@link BidirectionalCursor.isStart}
   */
  public isStart(): boolean {
    return this._cursor.isStart()
  }

  /**
   * @see {@link Cursor.get}
   */
  public get(): Element | undefined {
    return this._cursor.get()
  }

  /**
   * @see {@link BidirectionalCursor.isEnd}
   */
  public isEnd(): boolean {
    return this._cursor.isEnd()
  }

  /**
   * @see {@link BidirectionalCursor.isInside}
   */
  public isInside(): boolean {
    return this._cursor.isInside()
  }

  /**
   * @see {@link BidirectionalCursor.next}
   */
  public next(): void {
    this._cursor.next()
  }

  /**
   * @see {@link BidirectionalCursor.previous}
   */
  public previous(): void {
    return this._cursor.previous()
  }

  /**
   * 
   */
  public setCursor(cursor: BidirectionalCursor<Element>): void {
    this._cursor = cursor
  }

  /**
   * 
   */
  public hasCursor(cursor: BidirectionalCursor<Element>): boolean {
    return this._cursor === cursor
  }

  /**
   * @see {@link BidirectionalCursor.view}
   */
  public view(): this {
    return this
  }
}

/**
 * 
 */
export function createBidirectionalCursorView<Element>(cursor: BidirectionalCursor<Element>): BidirectionalCursorView<Element> {
  return new BidirectionalCursorView(cursor)
}