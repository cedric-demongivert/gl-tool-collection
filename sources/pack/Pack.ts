import { Sequence } from '../sequence/Sequence'
import { List } from '../list/List'

import { ReallocableCollection } from '../ReallocableCollection'

import { createUint8Pack } from './BufferPack'
import { createUint16Pack } from './BufferPack'
import { createUint32Pack } from './BufferPack'
import { createInt8Pack } from './BufferPack'
import { createInt16Pack } from './BufferPack'
import { createInt32Pack } from './BufferPack'
import { createFloat32Pack } from './BufferPack'
import { createFloat64Pack } from './BufferPack'
import { createUnsignedPackUpTo } from './BufferPack'
import { createSignedPackUpTo } from './BufferPack'
import { createArrayPack } from './ArrayPack'
import { createInstancePack } from './InstancePack'

import { CircularPack } from './CircularPack'

/**
 * A pack is a re-allocable mutable sequence of values.
 */
export interface Pack<Element> extends List<Element>, ReallocableCollection {
  /**
   * Allocate a new empty pack similar to this one with the given capacity.
   *
   * @param capacity - The capacity of the new pack to allocate.
   *
   * @returns A new empty pack similar to this one.
   */
  allocate(capacity: number): Pack<Element>

  /**
   * @see {@link List.clone}
   */
  clone(): Pack<Element>

  /**
   * @see {@link List.view}
   */
  view(): Sequence<Element>
}

/**
 * 
 */
export namespace Pack {
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
   * @see {@link createArrayPack}
   */
  export const any = createArrayPack

  /**
   * @see {@link createUint8Pack}
   */
  export const uint8 = createUint8Pack

  /**
   * @see {@link createUint16Pack}
   */
  export const uint16 = createUint16Pack

  /**
   * @see {@link createUint32Pack}
   */
  export const uint32 = createUint32Pack

  /**
   * @see {@link createInt8Pack}
   */
  export const int8 = createInt8Pack

  /**
   * @see {@link createInt16Pack}
   */
  export const int16 = createInt16Pack

  /**
   * @see {@link createInt32Pack}
   */
  export const int32 = createInt32Pack

  /**
   * @see {@link createFloat32Pack}
   */
  export const float32 = createFloat32Pack

  /**
   * @see {@link createFloat64Pack}
   */
  export const float64 = createFloat64Pack

  /**
   * @see {@link createUnsignedPackUpTo}
   */
  export const unsignedUpTo = createUnsignedPackUpTo


  /**
   * @see {@link createSignedPackUpTo}
   */
  export const signedUpTo = createSignedPackUpTo

  /**
   * @see {@link createInstancePack}
   */
  export const instance = createInstancePack

  /**
   * @see {@link InstancePack.circular}
   */
  export const circular = CircularPack.fromPack

  /**
   * 
   */
  export type Allocator<Element> = (size: number) => Pack<Element>
}