import { Markable } from "./Markable"
import { Protomark } from "./Protomark"

/**
 * 
 */
export namespace ReadonlyMark {
  /**
   * 
   */
  export interface Marked extends Markable {

  }

  /**
   * 
   */
  export const MARK: unique symbol = Symbol('gl-tool-collection/readonly-mark')

  /**
   * 
   */
  export type MARK = typeof MARK

  /**
   * 
   */
  export const protomark = Protomark(MARK)

  /**
   * 
   */
  export function is(instance: Markable): instance is Marked {
    return instance.is(MARK)
  }
}
