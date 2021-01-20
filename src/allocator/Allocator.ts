import { FactoryAllocator } from './FactoryAllocator'

/**
* An object specialized in managing instances of a given type of object.
*/
export interface Allocator<Instance> {
  /**
  * Allocate and return a new instance of the managed type of object.
  *
  * @return A new instance of the managed type of object.
  */
  allocate(): Instance

  /**
  * Free the given instance and return it to the allocator.
  *
  * Once freed, an object returned to the allocator must not be referenced by
  * any other object than the allocator itself.
  *
  * @param instance - An instance to free.
  */
  free(instance: Instance): void
}

export namespace Allocator {
  /**
  *
  */
  export const fromFactory = FactoryAllocator.create
}
