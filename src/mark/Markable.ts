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
   * @return True if this instance matches the given mark-like object.
   */
  is(mark: Mark.Alike): boolean
}
