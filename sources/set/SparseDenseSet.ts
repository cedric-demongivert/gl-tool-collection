import { ReallocableCollection } from '../ReallocableCollection'

import { OrderedGroup } from './OrderedGroup'
import { OrderedSet } from './OrderedSet'
import { PackSparseDenseSet } from './PackSparseDenseSet'

/**
 * 
 */
export interface SparseDenseSet extends OrderedSet<number>, ReallocableCollection {
  /**
  * @see Collection.view
  */
  view(): OrderedGroup<number>

  /**
  * @see Collection.clone
  */
  clone(): SparseDenseSet
}

/**
 * 
 */
export namespace SparseDenseSet {
  /**
  * Instantiate a uint32 sparse-dense set.
  *
  * @param capacity - Capacity of the sparse-dense set to instantiate.
  *
  * @returns A new sparse-dense set of the given capacity.
  */
  export function uint32(capacity: number): SparseDenseSet {
    return PackSparseDenseSet.uint32(capacity)
  }

  /**
  * Instantiate a uint16 sparse-dense set.
  *
  * @param capacity - Capacity of the sparse-dense set to instantiate.
  *
  * @returns A new sparse-dense set of the given capacity.
  */
  export function uint16(capacity: number): SparseDenseSet {
    return PackSparseDenseSet.uint16(capacity)
  }

  /**
  * Instantiate a uint8 sparse-dense set.
  *
  * @param capacity - Capacity of the sparse-dense set to instantiate.
  *
  * @returns A new sparse-dense set of the given capacity.
  */
  export function uint8(capacity: number): SparseDenseSet {
    return PackSparseDenseSet.uint8(capacity)
  }

  /**
  * Instantiate an array sparse-dense set.
  *
  * @param capacity - Capacity of the sparse-dense set to instantiate.
  *
  * @returns A new sparse-dense set of the given capacity.
  */
  // export function any(capacity: number): SparseDenseSet {
  //  return PackSparseDenseSet.any(capacity)
  // }

  /**
  * Instantiate a sparse-dense set that can store numbers up to the given value.
  *
  * @param capacity - Maximum number to be able to store into the resulting sparse-dense set.
  *
  * @returns A new sparse-dense set that can store numbers up to the given value.
  */
  export function upTo(capacity: number): SparseDenseSet {
    return PackSparseDenseSet.upTo(capacity)
  }
}
