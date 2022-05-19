import { EmptyMark, ReadonlyMark } from "../mark"
import { BidirectionalCursor } from "./BidirectionalCursor"
import { EmptyForwardCursor } from "./EmptyForwardCursor"

/**
 * 
 */
@BidirectionalCursor.protomark
export class EmptyBidirectionalCursor<Element> extends EmptyForwardCursor<Element> implements BidirectionalCursor<Element> {
  /**
   * @see BidirectionalCursor.prototype.at
   */
  public at(index: number): void {

  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): EmptyBidirectionalCursor<Element> {
    return this
  }

  /**
   * @see BidirectionalCursor.prototype.backward
   */
  public backward(count: number): void {

  }

  /**
   * @see BidirectionalCursor.prototype.isStart
   */
  public isStart(): true {
    return true
  }

  /**
   * @see BidirectionalCursor.prototype.previous
   */
  public previous(): void { }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other === this) return true
    if (other == null) return false

    return other instanceof EmptyBidirectionalCursor
  }
}

/**
 * 
 */
export namespace EmptyBidirectionalCursor {
  /**
   * 
   */
  export const INSTANCE: EmptyBidirectionalCursor<any> = new EmptyBidirectionalCursor()

  /**
   * 
   */
  export function get<Element>(): EmptyBidirectionalCursor<Element> {
    return INSTANCE
  }
}