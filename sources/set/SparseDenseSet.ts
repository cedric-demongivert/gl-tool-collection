import { Sequence } from '../Sequence'
import { ReallocableCollection } from '../ReallocableCollection'

import { MutableSet } from './MutableSet'
import { PackSparseDenseSet } from './PackSparseDenseSet'

export interface SparseDenseSet
  extends Sequence<number>, MutableSet<number>, ReallocableCollection {
  /**
  * @see Collection.view
  */
  view(): Sequence<number>

  /**
  * @see Collection.clone
  */
  clone(): SparseDenseSet
}

export namespace SparseDenseSet {
  /**
  * Copy an existing sparse-dense set instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @returns A copy of the given instance.
  */
  export function copy(toCopy: SparseDenseSet): SparseDenseSet {
    return toCopy == null ? null : toCopy.clone()
  }

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
  export function any(capacity: number): SparseDenseSet {
    return PackSparseDenseSet.any(capacity)
  }

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
