import { Mark } from './Mark'

/**
 * A type of object that stores marks that describe different behaviors.
 */
export interface Markable {
  /**
   * Returns true if this instance matches a given mark.
   *
   * @see Mark
   * 
   * @param mark - A mark-like object to check.
   * 
   * @returns True if this instance matches the given mark-like object.
   */
  is(mark: Mark.Alike): boolean
}

/**
 * 
 */
export namespace Markable {
  /**
   * 
   */
  export type Predicate = (mark: Mark.Alike) => boolean

  /**
   * 
   */
  export const MARK: Mark = Symbol('gl-tool-collection/mark')

  /**
   * @see Mark.Container
   */
  export function mark(): Mark {
    return MARK
  }

  /**
   * 
   */
  export function isAlike(instance: unknown): instance is { is: unknown } {
    return typeof instance === 'object' && 'is' in instance
  }

  /**
   * 
   */
  export function is(instance: unknown): instance is Markable {
    return isAlike(instance) && typeof instance.is === 'function' && instance.is(Markable)
  }
}
