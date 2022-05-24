import { Mark } from "./Mark"
import { Markable } from "./Markable"

/**
 * 
 */
export namespace Readonly {
  /**
   * 
   */
  export const MARK: Mark = Symbol('gl-tool-collection/mark/readonly')

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
