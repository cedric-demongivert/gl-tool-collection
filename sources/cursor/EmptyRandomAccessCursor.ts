import { RandomAccessCursor } from "./RandomAccessCursor"

/**
 * 
 */
export class EmptyRandomAccessCursor<Element> implements RandomAccessCursor<Element> {
  /**
   * @see {@link RandomAccessCursor.index}
   */
  readonly index: number = 0

  /**
   * @see {@link RandomAccessCursor.get}
   */
  public get(): undefined {
    return undefined
  }

  /**
   * @see {@link RandomAccessCursor.forward}
   */
  public forward(count: number): void { }

  /**
   * @see {@link RandomAccessCursor.isEnd}
   */
  public isEnd(): true {
    return true
  }

  /**
   * @see {@link RandomAccessCursor.isInside}
   */
  public isInside(): false {
    return false
  }

  /**
   * @see {@link RandomAccessCursor.next}
   */
  public next(): void { }

  /**
   * @see {@link RandomAccessCursor.at}
   */
  public at(index: number): void {

  }

  /**
   * @see {@link RandomAccessCursor.backward}
   */
  public backward(count: number): void {

  }

  /**
   * @see {@link RandomAccessCursor.isStart}
   */
  public isStart(): true {
    return true
  }

  /**
   * @see {@link RandomAccessCursor.previous}
   */
  public previous(): void { }


  /**
   * @see {@link RandomAccessCursor.clone}
   */
  public clone(): this {
    return this
  }

  /**
   * @see {@link RandomAccessCursor.view}
   */
  public view(): this {
    return this
  }

  /**
   * @see {@link RandomAccessCursor.equals}
   */
  public equals(other: unknown): boolean {
    if (other === this) return true
    if (other == null) return false

    return other instanceof EmptyRandomAccessCursor
  }
}

/**
 * 
 */
export const EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE: EmptyRandomAccessCursor<any> = new EmptyRandomAccessCursor()

/**
 * 
 */
export function getEmptyRandomAccessCursor<Element>(): EmptyRandomAccessCursor<Element> {
  return EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE
}