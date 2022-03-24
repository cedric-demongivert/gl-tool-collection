import { Duplicator } from '../allocator/Duplicator'
import { Sequence } from '../sequence/Sequence'
import { List } from '../sequence/List'

import { UnsignedIntegerBuffer } from '../native/UnsignedIntegerBuffer'
import { IntegerBuffer } from '../native/IntegerBuffer'

import { ReallocableCollection } from '../ReallocableCollection'
import { Collection } from '../Collection'

import { BufferPack } from './BufferPack'
import { ArrayPack } from './ArrayPack'
import { InstancePack } from './InstancePack'

/**
 * A pack is a re-allocable mutable sequence of values.
 */
export interface Pack<Element> extends List<Element>, ReallocableCollection {
  /**
   * Allocate a new empty pack similar to this one with the given capacity.
   *
   * @param capacity - The capacity of the new pack to allocate.
   *
   * @return A new empty pack similar to this one.
   */
  allocate(capacity: number): Pack<Element>

  /**
   * @see Collection.clone
   */
  clone(): Pack<Element>

  /**
   * @see Collection.view
   */
  view(): Sequence<Element>

  /**
   * @see Collection.view
   */
  is(marker: Pack.MARKER): true

  /**
   * @see Collection.view
   */
  is(marker: Sequence.MARKER): true

  /**
   * @see Collection.view
   */
  is(marker: Symbol): boolean
}

export namespace Pack {
  /**
   * 
   */
  export type Factory<Element> = (capacity?: number) => Pack<Element>

  /**
   * 
   */
  export const MARKER: unique symbol = Symbol('gl-tool-collection/pack-marker')

  /**
   * 
   */
  export type MARKER = typeof MARKER

  /**
   * Return true if the given collection is a pack.
   *
   * @param collection - A collection to assert.
   *
   * @return True if the given collection is a pack.
   */
  export function is<Element>(collection: Collection<Element>): collection is Pack<Element> {
    return collection.is(MARKER)
  }

  /**
   * Shallow copy the given instance and return it.
   *
   * @param toCopy - An instance to shallow copy.
   *
   * @return A new instance that is a shallow copy of the given one.
   */
  export function copy<T>(toCopy: Pack<T>): Pack<T> {
    return toCopy == null ? null : toCopy.clone()
  }

  /**
   * Instantiate a new pack that wrap an array of the given type of instance.
   *
   * @param pack - Instance of the type of pack to instantiate.
   * @param capacity - Capacity of the array to allocate.
   *
   * @return A new pack that wrap an array of the given type of instance.
   */
  export function like<T>(pack: Pack<T>, capacity: number): Pack<T> {
    return pack.allocate(capacity)
  }

  /**
   * Instantiate a new pack that wrap an array of the given type of instance.
   *
   * @param capacity - Capacity of the array to allocate.
   *
   * @return A new pack that wrap an array of the given type of instance.
   */
  export function any<T>(capacity: number): ArrayPack<T> {
    return ArrayPack.allocate(capacity)
  }


  /**
   * Instantiate a new pack that wrap a unsigned byte buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @return A new pack that wrap a unsigned byte buffer of the given capacity.
   */
  export function uint8(capacity: number): BufferPack<Uint8Array> {
    return new BufferPack<Uint8Array>(new Uint8Array(capacity))
  }

  /**
   * Instantiate a new pack that wrap a unsigned short buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @return A new pack that wrap a unsigned short buffer of the given capacity.
   */
  export function uint16(capacity: number): BufferPack<Uint16Array> {
    return new BufferPack<Uint16Array>(new Uint16Array(capacity))
  }

  /**
   * Instantiate a new pack that wrap a unsigned integer buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @return A new pack that wrap a unsigned integer buffer of the given capacity.
   */
  export function uint32(capacity: number): BufferPack<Uint32Array> {
    return new BufferPack<Uint32Array>(new Uint32Array(capacity))
  }

  /**
   * Instantiate a new pack that wrap a byte buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @return A new pack that wrap a byte buffer of the given capacity.
   */
  export function int8(capacity: number): BufferPack<Int8Array> {
    return new BufferPack<Int8Array>(new Int8Array(capacity))
  }

  /**
   * Instantiate a new pack that wrap a short buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @return A new pack that wrap a short buffer of the given capacity.
   */
  export function int16(capacity: number): BufferPack<Int16Array> {
    return new BufferPack<Int16Array>(new Int16Array(capacity))
  }

  /**
   * Instantiate a new pack that wrap a integer buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @return A new pack that wrap a integer buffer of the given capacity.
   */
  export function int32(capacity: number): BufferPack<Int32Array> {
    return new BufferPack<Int32Array>(new Int32Array(capacity))
  }

  /**
   * Instantiate a new pack that wrap a float buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @return A new pack that wrap a float buffer of the given capacity.
   */
  export function float32(capacity: number): BufferPack<Float32Array> {
    return new BufferPack<Float32Array>(new Float32Array(capacity))
  }

  /**
   * Instantiate a new pack that wrap a double buffer of the given capacity.
   *
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @return A new pack that wrap a double buffer of the given capacity.
   */
  export function float64(capacity: number): BufferPack<Float64Array> {
    return new BufferPack<Float64Array>(new Float64Array(capacity))
  }

  /**
   * Instantiate a new pack that wrap a unsigned integer buffer that can store
   * values in range [0, maximum] and that is of the given capacity.
   *
   * @param maximum - Maximum value that can be stored.
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @return A new pack that wrap a unsigned integer buffer that can store values
   *         in range [0, maximum] and that is of the given capacity.
   */
  export function unsignedUpTo(maximum: number, capacity: number): BufferPack<UnsignedIntegerBuffer> {
    return new BufferPack(UnsignedIntegerBuffer.upTo(maximum, capacity))
  }

  /**
   * Instantiate a new pack that wrap a signed integer buffer that can store
   * values in range [-maximum, maximum] and that is of the given capacity.
   *
   * @param maximum - Maximum value that can be stored.
   * @param capacity - Capacity of the buffer to allocate.
   *
   * @return A new pack that wrap a signed integer buffer that can store values
   *         in range [-maximum, maximum] and that is of the given capacity.
   */
  export function signedUpTo(maximum: number, capacity: number): BufferPack<IntegerBuffer> {
    return new BufferPack(IntegerBuffer.upTo(maximum, capacity))
  }

  /**
   * Instantiate a new pack that store non-null instances of the given allocator.
   * 
   * @param duplicator - Allocator to use.
   * @param capacity - Capacity of the pack to allocate.
   */
  export function instance<Element>(duplicator: Duplicator<Element>, capacity: number): InstancePack<Element> {
    return new InstancePack<Element>(duplicator, capacity)
  }
}
