import { Pack } from '../sequence/Pack'

import { Clearable, Factory } from '@cedric-demongivert/gl-tool-utils'

import { Allocator } from './Allocator'

/**
 * 
 */
export class FactoryAllocator<Product extends Clearable> implements Allocator<Product> {
  /**
   * The factory used for creating new instances of the managed type of object.
   */
  private readonly _factory: Factory<Product>

  /**
   * A pack that contains unused instances of the managed type of object.
   */
  private readonly _instances: Pack<Product | null>

  /**
   * Instantiate a new factory allocator for a given type of object.
   *
   * @param factory - The factory to use for allocating new instances of the managed type of object.
   * @param [capacity = 16] - The number of object to pre-allocate.
   */
  public constructor(factory: Factory<Product>, capacity: number = 16) {
    this._factory = factory
    this._instances = Pack.any<Product>(capacity)

    while (this._instances.size < this._instances.capacity) {
      this._instances.push(this._factory())
    }
  }

  /**
   * @see Allocator.allocate
   */
  public allocate(): Product {
    if (this._instances.size > 0) {
      return this._instances.pop()!
    } else {
      return this._factory()
    }
  }

  /**
   * @see Allocator.free
   */
  public free(instance: Product): void {
    instance.clear()
    this._instances.push(instance)
  }

  /**
   * Empty this allocator of all of it's currently pre-allocated instances.
   */
  public clear(): void {
    const instances: Pack<Product | null> = this._instances

    for (let index = 0; index < instances.size; ++index) {
      instances.set(index, null)
    }

    instances.clear()
  }
}

/**
 * 
 */
export namespace FactoryAllocator {
  /**
   *
   */
  export function create<Product extends Clearable>(factory: Factory<Product>, capacity: number = 16): FactoryAllocator<Product> {
    return new FactoryAllocator(factory, capacity)
  }
}
