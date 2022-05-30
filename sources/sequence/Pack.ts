import { Sequence } from '../sequence/Sequence'
import { List } from '../sequence/List'

import { ReallocableCollection } from '../ReallocableCollection'

import { BufferPack } from './BufferPack'
import { ArrayPack } from './ArrayPack'
import { InstancePack } from './InstancePack'
import { CircularPack } from './CircularPack'
import { Collection } from '../Collection'

/**
 * A pack is a re-allocable mutable sequence of values.
 */
export interface Pack<Element> extends List<Element>, ReallocableCollection {
  /**
   * @see Collection.prototype.isPack
   */
  isPack(): true

  /**
   * Allocate a new empty pack similar to this one with the given capacity.
   *
   * @param capacity - The capacity of the new pack to allocate.
   *
   * @returns A new empty pack similar to this one.
   */
  allocate(capacity: number): Pack<Element>

  /**
   * @see Collection.prototype.clone
   */
  clone(): Pack<Element>

  /**
   * @see Collection.prototype.view
   */
  view(): Sequence<Element>
}

/**
 * 
 */
export namespace Pack {
  /**
   * 
   */
  export function is<Element>(collection: Collection<Element>): collection is Pack<Element> {
    return collection.isPack()
  }

  /**
   * Instantiate a new pack that wrap an array of the given type of instance.
   *
   * @param pack - Instance of the type of pack to instantiate.
   * @param capacity - Capacity of the array to allocate.
   *
   * @returns A new pack that wrap an array of the given type of instance.
   */
  export function like<Element>(pack: Pack<Element>, capacity: number): Pack<Element> {
    return pack.allocate(capacity)
  }

  /**
   * @see ArrayPack.allocate
   */
  export const any = ArrayPack.allocate

  /**
   * @see BufferPack.uint8
   */
  export const uint8 = BufferPack.uint8

  /**
   * @see BufferPack.uint16
   */
  export const uint16 = BufferPack.uint16

  /**
   * @see BufferPack.uint32
   */
  export const uint32 = BufferPack.uint32

  /**
   * @see BufferPack.int8
   */
  export const int8 = BufferPack.int8

  /**
   * @see BufferPack.int16
   */
  export const int16 = BufferPack.int16

  /**
   * @see BufferPack.int32
   */
  export const int32 = BufferPack.int32

  /**
   * @see BufferPack.float32
   */
  export const float32 = BufferPack.float32

  /**
   * @see BufferPack.float64
   */
  export const float64 = BufferPack.float64

  /**
   * @see BufferPack.unsignedUpTo
   */
  export const unsignedUpTo = BufferPack.unsignedUpTo

  /**
   * @see BufferPack.signedUpTo
   */
  export const signedUpTo = BufferPack.signedUpTo

  /**
   * @see InstancePack.allocate
   */
  export const instance = InstancePack.allocate

  /**
   * @see InstancePack.circular
   */
  export const circular = CircularPack.fromPack
}