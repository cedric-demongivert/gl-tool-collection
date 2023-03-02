import { Clearable, Factory, Assignable } from '@cedric-demongivert/gl-tool-utils'

import { FactoryAllocator } from './FactoryAllocator'
import { Duplicator } from './Duplicator'

export class FactoryDuplicator<Product extends Clearable & Assignable<Product>> extends FactoryAllocator<Product> implements Duplicator<Product> {
  /**
   * @see {@link Allocator.copy}
   */
  public copy(toCopy: Product): Product {
    return this.allocate().copy(toCopy)
  }

  /**
   * @see {@link Duplicator.copy}
   */
  public move(origin: Product, target: Product): void {
    target.copy(origin)
  }
}

/**
 *
 */
export function createFactoryDuplicator<Product extends Clearable & Assignable<Product>>(factory: Factory<Product>, capacity: number = 16): FactoryDuplicator<Product> {
  return new FactoryDuplicator(factory, capacity)
}