import { Collection } from './Collection'
import { StaticCollection } from './StaticCollection'

/**
 * A re-allocable collection is a static collection that allows changing its capacity on the fly.
 */
export interface ReallocableCollection extends StaticCollection {
  /**
   * Update the capacity of this collection by reallocating it.
   * 
   * A reallocation may change the internal state of the collection notably if its previous 
   * size exceeds its new capacity. The implementation used MUST discard all extra elements 
   * during the operation.
   *
   * @param capacity - The new capacity to allocate.
   */
  reallocate(capacity: number): void

  /**
   * Reallocate this collection to match its capacity to the number of elements that it contains.
   */
  fit(): void
}

/**
 * 
 */
export namespace ReallocableCollection {
  /**
   * 
   */
  type FactoryParameters<
    Element,
    BaseCollection extends Collection<Element>,
    BaseFactory extends () => BaseCollection
    > = [...Parameters<BaseFactory>, number?]

  /**
   * 
   */
  export type Factory<
    Element,
    BaseCollection extends Collection<Element>,
    BaseFactory extends () => BaseCollection
    > = (...args: FactoryParameters<Element, BaseCollection, BaseFactory>) => ReallocableCollection & BaseCollection
}
