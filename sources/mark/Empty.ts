import { Mark } from "./Mark"
import { Markable } from "./Markable"

/**
 * 
 */
export namespace Empty {

  /**
   * 
   */
  export const MARK: Mark = Symbol('gl-tool-collection/mark/empty')

  /**
   * @see Mark.Container
   */
  export function mark(): Mark {
    return MARK
  }

  /**
   * 
   */
  export function is(instance: Markable): boolean {
    return instance.is(MARK)
  }
}
