import { protomark } from "../mark"
import { EmptyBidirectionalCursor } from "./EmptyBidirectionalCursor"
import { RandomAccessCursor } from "./RandomAccessCursor"

/**
 * 
 */
@protomark(RandomAccessCursor)
export class EmptyRandomAccessCursor<Element> extends EmptyBidirectionalCursor<Element> implements RandomAccessCursor<Element> {
  /**
   * @see Clonable.prototype.clone
   */
  public clone(): this {
    return this
  }

  /**
   * @see Cursor.prototype.view
   */
  public view(): this {
    return this
  }

  /**
   * @see Comparable.prototype.equals
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
export namespace EmptyRandomAccessCursor {
  /**
   * 
   */
  export const INSTANCE: EmptyRandomAccessCursor<any> = new EmptyRandomAccessCursor()

  /**
   * 
   */
  export function get<Element>(): EmptyRandomAccessCursor<Element> {
    return INSTANCE
  }
}