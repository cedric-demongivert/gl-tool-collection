import { Group } from './Group'

/**
 * A set is an unordered collection that does not accept duplicates.
 */
export interface Set<Element> extends Group<Element> {
  /**
   * Add a new element to the set.
   *
   * @param value - Elementhe value to add to the set.
   */
  add(value: Element): void

  /**
   * Remove an element from the set.
   *
   * @param value - Elementhe value to remove from the set.
   */
  delete(value: Element): void

  /**
   * Shallow copy an existing set instance.
   *
   * @param toCopy - An existing set instance to shallow copy.
   */
  copy(toCopy: Group<Element>): void

  /**
   * @see Collection.clone
   */
  clone(): Set<Element>

  /**
   * Empty the set.
   */
  clear(): void
}
