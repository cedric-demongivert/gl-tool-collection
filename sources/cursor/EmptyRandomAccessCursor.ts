import { areEquallyConstructed } from "../areEquallyConstructed"
import { BidirectionalCursor } from "./BidirectionalCursor"
import { Cursor } from "./Cursor"
import { ForwardCursor } from "./ForwardCursor"
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

    return areEquallyConstructed(other, this)
  }

  /**
   * @see {@link RandomAccessCursor.values}
   */
  public * values(): IterableIterator<Element> {
  }

  /**
   * @see {@link RandomAccessCursor[Symbol.iterator]}
   */
  public * [Symbol.iterator](): IterableIterator<Element> {
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

/**
 * 
 */
export const EMPTY_BIDIRECTIONAL_CURSOR: BidirectionalCursor<any> = EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE

/**
 * 
 */
export function getEmptyBidirectionalCursor<Element>(): BidirectionalCursor<Element> {
  return EMPTY_BIDIRECTIONAL_CURSOR
}

/**
 * 
 */
export const EMPTY_FORWARD_CURSOR_INSTANCE: ForwardCursor<any> = EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE

/**
 * 
 */
export function getEmptyForwardCursor<Element>(): ForwardCursor<Element> {
  return EMPTY_FORWARD_CURSOR_INSTANCE
}

/**
 * 
 */
export const EMPTY_CURSOR_INSTANCE: Cursor<any> = EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE

/**
 * 
 */
export function getEmptyCursor<Element>(): Cursor<Element> {
  return EMPTY_CURSOR_INSTANCE
}