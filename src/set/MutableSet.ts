import { Set } from './Set'

export interface MutableSet<Element> extends Set<Element> {
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
  copy(toCopy: Set<Element>): void

  /**
   * @see Collection.clone
   */
  clone(): MutableSet<Element>

  /**
   * Empty the set.
   */
  clear(): void
}
