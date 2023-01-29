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
   * @see {@link Collection.isPack}
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
   * @see {@link Collection.clone}
   */
  clone(): Pack<Element>

  /**
   * @see {@link Collection.view}
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
   * @see {@link ArrayPack.allocate}
   */
  export const any = ArrayPack.allocate

  /**
   * @see {@link BufferPack.uint8}
   */
  export const uint8 = BufferPack.uint8

  /**
   * @see {@link BufferPack.uint16}
   */
  export const uint16 = BufferPack.uint16

  /**
   * @see {@link BufferPack.uint32}
   */
  export const uint32 = BufferPack.uint32

  /**
   * @see {@link BufferPack.int8}
   */
  export const int8 = BufferPack.int8

  /**
   * @see {@link BufferPack.int16}
   */
  export const int16 = BufferPack.int16

  /**
   * @see {@link BufferPack.int32}
   */
  export const int32 = BufferPack.int32

  /**
   * @see {@link BufferPack.float32}
   */
  export const float32 = BufferPack.float32

  /**
   * @see {@link BufferPack.float64}
   */
  export const float64 = BufferPack.float64

  /**
   * @see {@link BufferPack.unsignedUpTo}
   */
  export const unsignedUpTo = BufferPack.unsignedUpTo

  /**
   * @see {@link BufferPack.signedUpTo}
   */
  export const signedUpTo = BufferPack.signedUpTo

  /**
   * @see {@link InstancePack.allocate}
   */
  export const instance = InstancePack.allocate

  /**
   * @see {@link InstancePack.circular}
   */
  export const circular = CircularPack.fromPack

  /**
   * 
   */
  export type Allocator<Element> = (size: number) => Pack<Element>
}