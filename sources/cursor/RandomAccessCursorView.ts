import { RandomAccessCursor } from "./RandomAccessCursor"

/**
 * 
 */
export class RandomAccessCursorView<Element> implements RandomAccessCursor<Element> {
  /**
   * 
   */
  private _cursor: RandomAccessCursor<Element>

  /**
   * @see {@link RandomAccessCursor.index}
   */
  public get index(): number {
    return this._cursor.index
  }

  /**
   * Create a view over the given cursor.
   * 
   * @param cursor - A cursor instance to wrap.
   */
  public constructor(cursor: RandomAccessCursor<Element>) {
    this._cursor = cursor
  }

  /**
   * @see {@link RandomAccessCursor.clone}
   */
  public clone(): RandomAccessCursorView<Element> {
    return new RandomAccessCursorView(this._cursor)
  }

  /**
   * 
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof RandomAccessCursorView) {
      return other._cursor === this._cursor
    }

    return false
  }

  /**
   * @see {@link RandomAccessCursor.at}
   */
  public at(index: number): void {
    this._cursor.at(index)
  }

  /**
   * @see {@link RandomAccessCursor.forward}
   */
  public forward(count: number): void {
    this._cursor.forward(count)
  }

  /**
   * @see {@link RandomAccessCursor.backward}
   */
  public backward(count: number): void {
    this._cursor.backward(count)
  }

  /**
   * @see {@link RandomAccessCursor.isStart}
   */
  public isStart(): boolean {
    return this._cursor.isStart()
  }

  /**
   * @see {@link RandomAccessCursor.get}
   */
  public get(): Element | undefined {
    return this._cursor.get()
  }

  /**
   * @see {@link RandomAccessCursor.isEnd}
   */
  public isEnd(): boolean {
    return this._cursor.isEnd()
  }

  /**
   * @see {@link RandomAccessCursor.isInside}
   */
  public isInside(): boolean {
    return this._cursor.isInside()
  }

  /**
   * @see {@link RandomAccessCursor.next}
   */
  public next(): void {
    this._cursor.next()
  }

  /**
   * @see {@link RandomAccessCursor.previous}
   */
  public previous(): void {
    return this._cursor.previous()
  }

  /**
   * 
   */
  public setCursor(cursor: RandomAccessCursor<Element>): void {
    this._cursor = cursor
  }

  /**
   * 
   */
  public hasCursor(cursor: RandomAccessCursor<Element>): boolean {
    return this._cursor === cursor
  }

  /**
   * @see {@link RandomAccessCursor.view}
   */
  public view(): this {
    return this
  }
}

/**
 * 
 */
export function createRandomAccessCursorView<Element>(cursor: RandomAccessCursor<Element>): RandomAccessCursorView<Element> {
  return new RandomAccessCursorView(cursor)
}