/**
 * A type that allows is instances to store marks that describe different behaviors.
 */
export interface Markable {
  /**
   * Returns true if this instance matches the given mark.
   * 
   * Markers assert the implementation of registerable interfaces or
   * the existence of a behavior.
   * 
   * @param mark - A mark to check.
   * 
   * @return True if this instance matches the given mark.
   */
  is(mark: symbol): boolean
}
