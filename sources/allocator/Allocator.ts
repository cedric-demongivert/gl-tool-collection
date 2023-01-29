import { Clearable } from '@cedric-demongivert/gl-tool-utils'

import { createFactoryAllocator } from './FactoryAllocator'

/**
 * An object specialized in managing instances of a given type.
 */
export interface Allocator<Product> extends Clearable {
  /**
   * Allocate and return a new instance of the managed type of object.
   *
   * @returns A new instance of the managed type of object.
   */
  allocate(): Product

  /**
   * Return the given instance to the allocator.
   *
   * @param instance - An instance to free.
   */
  free(instance: Product): void

  /**
   * Empty this allocator of all of it's currently pre-allocated instances.
   */
  clear(): void
}

/**
 * 
 */
export namespace Allocator {
  /**
   *
   */
  export const fromFactory = createFactoryAllocator
}
