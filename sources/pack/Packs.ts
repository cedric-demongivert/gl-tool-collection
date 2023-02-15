import { Pack } from './Pack'

import { createUint8Pack } from './BufferPack'
import { createUint16Pack } from './BufferPack'
import { createUint32Pack } from './BufferPack'
import { createInt8Pack } from './BufferPack'
import { createInt16Pack } from './BufferPack'
import { createInt32Pack } from './BufferPack'
import { createFloat32Pack } from './BufferPack'
import { createFloat64Pack } from './BufferPack'
import { createUintPackUpTo } from './BufferPack'
import { createIntPackUpTo } from './BufferPack'
import { createArrayPack } from './ArrayPack'
import { createInstancePack } from './InstancePack'

/**
 * 
 */
export namespace Packs {
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
  export const uintUpTo = createUintPackUpTo

  /**
   * @see {@link createSignedPackUpTo}
   */
  export const intUpTo = createIntPackUpTo

  /**
   * @see {@link createInstancePack}
   */
  export const instance = createInstancePack
}