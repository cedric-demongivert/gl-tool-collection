import { Sequence } from '../sequence/Sequence'
import { List } from '../list/List'


/**
 * A pack is a re-allocable mutable sequence of values.
 */
export interface Pack<Element> extends List<Element> {
  /**
   * @returns The maximum number of elements that this collection can store with its current memory allocation.
   */
  readonly capacity: number

  /**
   * Allocates a new empty pack similar to the instance with the requested capacity.
   *
   * @param capacity - The capacity of the new pack to allocate.
   *
   * @returns A new empty pack similar to this one.
   */
  allocate(capacity: number): Pack<Element>

  /**
   * Updates the capacity of the pack by reallocating it.
   * 
   * This method truncates the sequence to the requested capacity if its size exceeds it.
   *
   * @param capacity - The new capacity to allocate.
   */
  reallocate(capacity: number): void

  /**
   * Reallocates this pack to its current size.
   */
  fit(): void

  /**
   * @see {@link List.clone}
   */
  clone(): Pack<Element>

  /**
   * @see {@link List.view}
   */
  view(): Sequence<Element>
}

/**
 * 
 */
export namespace Pack {
  /**
   * 
   */
  export type Allocator<Element> = (size: number) => Pack<Element>
}