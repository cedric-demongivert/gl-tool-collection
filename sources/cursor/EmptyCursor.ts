import { Cursor } from "./Cursor"

/**
 * 
 */
export class EmptyCursor<Element> implements Cursor<Element> {
  /**
   * @see Cursor.prototype.isRandomAccess
   */
  public isRandomAccess(): boolean {
    return false
  }

  /**
   * @see Cursor.prototype.isBidirectional
   */
  public isBidirectional(): boolean {
    return false
  }

  /**
   * @see Cursor.prototype.isForward
   */
  public isForward(): boolean {
    return false
  }

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