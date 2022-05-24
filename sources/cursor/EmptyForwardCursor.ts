import { protomark } from "../mark"
import { ForwardCursor } from "./ForwardCursor"
import { EmptyCursor } from "./EmptyCursor"

/**
 * 
 */
@protomark(ForwardCursor)
export class EmptyForwardCursor<Element> extends EmptyCursor<Element> implements ForwardCursor<Element> {
  /**
   * @see ForwardCursor.prototype.index
   */
  readonly index: number = 0

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): this {
    return this
  }

  /**
   * @see ForwardCursor.prototype.forward
   */
  public forward(count: number): void { }

  /**
   * @see ForwardCursor.prototype.isEnd
   */
  public isEnd(): true {
    return true
  }

  /**
   * @see ForwardCursor.prototype.isInside
   */
  public isInside(): false {
    return false
  }

  /**
   * @see ForwardCursor.prototype.next
   */
  public next(): void { }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other === this) return true
    if (other == null) return false

    return other instanceof EmptyForwardCursor
  }

  /**
   * @see protomark.is
   */
  public is = protomark.is

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
export namespace EmptyForwardCursor {
  /**
   * 
   */
  export const INSTANCE: EmptyForwardCursor<any> = new EmptyForwardCursor()

  /**
   * 
   */
  export function get<Element>(): EmptyForwardCursor<Element> {
    return INSTANCE
  }
}