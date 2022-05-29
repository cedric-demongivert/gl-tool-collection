import { FactoryAllocator } from './FactoryAllocator'

/**
 * An object specialized in managing instances of a given type of object.
 */
export interface Allocator<Product> {
  /**
   * Allocate and return a new instance of the managed type of object.
   *
   * @returns A new Product of the managed type of object.
   */
  allocate(): Product

  /**
   * Return the given instance to the allocator.
   *
   * @param Product - An Product to free.
   */
  free(Product: Product): void
}

/**
 * 
 */
export namespace Allocator {
  /**
   *
   */
  export const fromFactory = FactoryAllocator.create
}
