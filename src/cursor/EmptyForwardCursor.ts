import { EmptyMark, ReadonlyMark, Protomark } from "../mark"
import { ForwardCursor } from "./ForwardCursor"

/**
 * 
 */
@EmptyMark.protomark
@ReadonlyMark.protomark
@ForwardCursor.protomark
export class EmptyForwardCursor<Element> implements ForwardCursor<Element>, EmptyMark.Marked, ReadonlyMark.Marked {
  /**
   * @see ForwardCursor.prototype.index
   */
  readonly index: number = 0

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): EmptyForwardCursor<Element> {
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
   * @see ForwardCursor.prototype.get
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

    return other instanceof EmptyForwardCursor
  }

  /**
   * @see Protomark.is
   */
  public is = Protomark.is
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