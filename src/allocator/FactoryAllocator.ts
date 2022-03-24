import { Pack } from '../pack/Pack'

import { Clearable } from '../Clearable'
import { Factory } from '../Factory'

import { Allocator } from './Allocator'

/**
 * 
 */
export class FactoryAllocator<T extends Clearable> implements Allocator<T> {
  /**
   * The factory used for creating new instances of the managed type of object.
   */
  private readonly _factory: Factory<T>

  /**
   * A pack that contains unused instances of the managed type of object.
   */
  private readonly _instances: Pack<T>

  /**
   * Instantiate a new factory allocator for a given type of object.
   *
   * @param factory - The factory to use for allocating new instances of the managed type of object.
   * @param [capacity = 16] - The number of object to pre-allocate.
   */
  public constructor(factory: Factory<T>, capacity: number = 16) {
    this._factory = factory
    this._instances = Pack.any(capacity)

    while (this._instances.size < this._instances.capacity) {
      this._instances.push(this._factory())
    }
  }

  /**
   * @see Allocator.allocate
   */
  public allocate(): T {
    if (this._instances.size > 0) {
      return this._instances.pop()
    } else {
      return this._factory()
    }
  }

  /**
   * @see Allocator.free
   */
  public free(instance: T): void {
    instance.clear()
    this._instances.push(instance)
  }

  /**
   * Empty this allocator of all of it's currently pre-allocated instances.
   */
  public clear(): void {
    const instances: Pack<T> = this._instances

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
  export function create<T extends Clearable>(factory: Factory<T>, capacity: number = 16): FactoryAllocator<T> {
    return new FactoryAllocator(factory, capacity)
  }
}
