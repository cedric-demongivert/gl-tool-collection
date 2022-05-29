import { Allocator } from './Allocator'
import { FactoryDuplicator } from './FactoryDuplicator'

/**
 * An allocator that can clone existing instances of the managed object.
 */
export interface Duplicator<Product> extends Allocator<Product> {
  /**
   * Allocate and return a new Product of the managed type of object that is a copy of an existing one.
   *
   * @param toCopy - An Product to copy.
   *
   * @returns A new Product of the managed type of object that is a copy of the given one.
   */
  copy(toCopy: Product): Product
}

/**
 * 
 */
export namespace Duplicator {
  /**
   *
   */
  export const fromFactory = FactoryDuplicator.create
}
