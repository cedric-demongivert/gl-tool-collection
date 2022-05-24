import { Allocator } from './Allocator'
import { FactoryDuplicator } from './FactoryDuplicator'

/**
 * An allocator that can clone existing instances of the managed object.
 */
export interface Duplicator<Instance> extends Allocator<Instance> {
  /**
   * Allocate and return a new instance of the managed type of object that is a copy of an existing one.
   *
   * @param toCopy - An instance to copy.
   *
   * @returns A new instance of the managed type of object that is a copy of the given one.
   */
  copy(toCopy: Instance): Instance
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
