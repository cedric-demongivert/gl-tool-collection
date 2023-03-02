
import { Clearable, Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { Pack } from '../pack/Pack'
import { createArrayPack } from '../pack/ArrayPack'

import { Allocator } from './Allocator'

/**
 * 
 */
export class FactoryAllocator<Product extends Clearable> implements Allocator<Product> {
  /**
   * The factory used for creating new instances of the managed type of object.
   */
  public readonly factory: Factory<Product>

  /**
   * A pack that contains unused instances of the managed type of object.
   */
  private readonly _instances: Pack<Product | null>

  /**
   * 
   */
  public get capacity(): number {
    return this._instances.capacity
  }

  /**
   * 
   */
  public get size(): number {
    return this._instances.size
  }

  /**
   * Instantiate a new factory allocator for a given type of object.
   *
   * @param factory - The factory to use for allocating new instances of the managed type of object.
   * @param [capacity = 16] - The number of object to pre-allocate.
   */
  public constructor(factory: Factory<Product>, capacity: number = 16) {
    this.factory = factory
    const instances = createArrayPack<Product | null>(Empty.nullptr, capacity)

    while (instances.size < instances.capacity) {
      instances.push(factory())
    }

    this._instances = instances
  }

  /**
   * @see {@link Allocator.allocate}
   */
  public allocate(): Product {
    const instances = this._instances

    if (instances.size > 0) {
      return instances.pop()!
    } else {
      return this.factory()
    }
  }

  /**
   * @see {@link Allocator.rollback}
   */
  public rollback(instance: Product): void {
    instance.clear()
  }

  /**
   * @see {@link Allocator.free}
   */
  public free(instance: Product): void {
    instance.clear()
    this._instances.push(instance)
  }

  /**
   * @see {@link Allocator.clear}
   */
  public clear(): void {
    const instances = this._instances

    for (let index = 0; index < instances.size; ++index) {
      instances.set(index, null)
    }

    instances.clear()
  }
}

/**
 *
 */
export function createFactoryAllocator<Product extends Clearable>(factory: Factory<Product>, capacity: number = 16): FactoryAllocator<Product> {
  return new FactoryAllocator(factory, capacity)
}
