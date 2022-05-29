import { Empty, Readonly, protomark, Mark } from "../mark"
import { Cursor } from "./Cursor"

/**
 * 
 */
@protomark(Empty)
@protomark(Readonly)
@protomark(Cursor)
export class EmptyCursor<Element> implements Cursor<Element> {
  /**
   * @see Clonable.prototype.clone
   */
  public clone(): this {
    return this
  }

  /**
   * @see Cursor.prototype.get
   */
  public get(): undefined {
    return undefined
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other === this) return true
    if (other == null) return false

    return other instanceof EmptyCursor
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
export namespace EmptyCursor {
  /**
   * 
   */
  export const INSTANCE: EmptyCursor<any> = new EmptyCursor()

  /**
   * 
   */
  export function get<Element>(): EmptyCursor<Element> {
    return INSTANCE
  }
}