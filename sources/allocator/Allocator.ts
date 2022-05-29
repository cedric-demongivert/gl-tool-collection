import { FactoryAllocator } from './FactoryAllocator'

/**
 * An object specialized in managing instances of a given type of object.
 */
export interface Allocator<Product> {
  /**
   * Allocate and return a new Product of the managed type of object.
   *
   * @returns A new Product of the managed type of object.
   */
  allocate(): Product

  /**
   * Free the given Product and return it to the allocator.
   *
   * Once freed, an object returned to an allocator must not be referenced by
   * any other object than the allocator itself.
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
