import { ReallocableCollection } from '../ReallocableCollection'
import { MutableSequence } from '../MutableSequence'
import { Pack } from '../pack/Pack'

import { PackCircularBuffer } from '../circular/PackCircularBuffer'
import { CircularBufferIterator } from '../circular/CircularBufferIterator'

/**
* A circular buffer that continuously drop the first inserted item when an
* element is added beyond of its own capacity.
*/
export interface CircularBuffer<Element>
         extends ReallocableCollection, MutableSequence<Element>
{
  /**
  * @see Collection.clone
  */
  clone () : CircularBuffer<Element>

  /**
  * @see Collection.iterator
  */
  iterator () : CircularBufferIterator<Element>
}

export namespace CircularBuffer {
  /**
  * Return a shallow copy the given circular buffer.
  *
  * @param buffer - An existing buffer instance to copy.
  *
  * @return A shallow copy the given circular buffer.
  */
  export function copy <T> (buffer : CircularBuffer<T>) : CircularBuffer<T> {
    return buffer == null ? null : buffer.clone()
  }

  /**
  * Return a circular buffer that wraps the given pack.
  *
  * @param pack - An existing pack instance to wrap.
  *
  * @return A circular buffer that wraps the given pack.
  */
  export function fromPack <T> (pack : Pack<T>) : PackCircularBuffer<T> {
    return new PackCircularBuffer<T>(pack)
  }

  /**
  * Instantiate a new circular buffer that wrap a pack of the given type of instance.
  *
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return A new buffer that wrap a pack of the given type of instance.
  */
  export function any <T> (capacity : number) : PackCircularBuffer<T> {
    return new PackCircularBuffer<T>(Pack.any(capacity))
  }

  /**
  * Instantiate a new circular buffer that wrap a unsigned byte pack of the given capacity.
  *
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return A new circular buffer that wrap a unsigned byte pack of the given capacity.
  */
  export function uint8 (capacity : number) : PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.uint8(capacity))
  }

  /**
  * Instantiate a new circular buffer that wrap a unsigned short pack of the given capacity.
  *
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return A new circular buffer that wrap a unsigned short pack of the given capacity.
  */
  export function uint16 (capacity : number) : PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.uint16(capacity))
  }

  /**
  * Instantiate a new circular buffer that wrap a unsigned integer pack of the given capacity.
  *
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return A new circular buffer that wrap a unsigned integer pack of the given capacity.
  */
  export function uint32 (capacity : number) : PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.uint32(capacity))
  }

  /**
  * Instantiate a new circular buffer that wrap a byte pack of the given capacity.
  *
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return A new circular buffer that wrap a byte pack of the given capacity.
  */
  export function int8 (capacity : number) : PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.int8(capacity))
  }

  /**
  * Instantiate a new circular buffer that wrap a short pack of the given capacity.
  *
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return A new circular buffer that wrap a short pack of the given capacity.
  */
  export function int16 (capacity : number) : PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.int16(capacity))
  }

  /**
  * Instantiate a new circular buffer that wrap a integer pack of the given capacity.
  *
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return A new circular buffer that wrap a integer pack of the given capacity.
  */
  export function int32 (capacity : number) : PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.int32(capacity))
  }

  /**
  * Instantiate a new circular buffer that wrap a float pack of the given capacity.
  *
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return A new circular buffer that wrap a float pack of the given capacity.
  */
  export function float32 (capacity : number) : PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.float32(capacity))
  }

  /**
  * Instantiate a new circular buffer that wrap a double pack of the given capacity.
  *
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return A new circular buffer that wrap a double pack of the given capacity.
  */
  export function float64 (capacity : number) : PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.float64(capacity))
  }

  /**
  * Instantiate a new pack that wrap a unsigned integer pack that can store
  * values in range [0, maximum] and that is of the given capacity.
  *
  * @param maximum - Maximum value that can be stored.
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return A new pack that wrap a unsigned integer pack that can store values
  *         in range [0, maximum] and that is of the given capacity.
  */
  export function unsignedUpTo (maximum : number, capacity : number) : PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.unsignedUpTo(maximum, capacity))
  }

  /**
  * Instantiate a new circular buffer that wrap a signed integer pack that can store
  * values in range [-maximum, maximum] and that is of the given capacity.
  *
  * @param maximum - Maximum value that can be stored.
  * @param capacity - Capacity of the pack to allocate.
  *
  * @return A new circular buffer that wrap a signed integer pack that can store values
  *         in range [-maximum, maximum] and that is of the given capacity.
  */
  export function signedUpTo (maximum : number, capacity : number) : PackCircularBuffer<number> {
    return new PackCircularBuffer<number>(Pack.signedUpTo(maximum, capacity))
  }
}
