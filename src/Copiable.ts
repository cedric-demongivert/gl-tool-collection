/**
 * An object that is able to copy instances of a particular type of object.
 */
export interface Copiable<T> {
  /**
   * Copy the given instance.
   *
   * @param toCopy - An instance to copy.
   */
  copy(toCopy: T): void
}
