import { Comparator } from '@library/Comparator'
import { MutableSequence } from '@library/MutableSequence'
import { ReallocableCollection } from '@library/ReallocableCollection'

import { UnsignedIntegerBuffer } from '@library/native/UnsignedIntegerBuffer'
import { IntegerBuffer } from '@library/native/IntegerBuffer'

import { PackIterator } from '@library/pack/PackIterator'
import { BufferPack } from '@library/pack/BufferPack'
import { ArrayPack } from '@library/pack/ArrayPack'

export interface Pack<Element>
         extends MutableSequence<Element>, ReallocableCollection
{
  /**
  * @see Array.sort
  */
  sort (comparator : Comparator<Element, Element>) : void

  /**
  * Like Array.sort but on a given range of this pack.
  *
  * @param offset - Number of elements to ignore from the start of the pack.
  * @param size - Number of elements to sort.
  * @param comparator - Comparison order to use.
  */
  subsort (
    offset : number,
    size : number,
    comparator : Comparator<Element, Element>
  ) : void

  /**
  * Shallow copy the given pack.
  *
  * This operation may update the size of this pack, and as a consequence this
  * pack may reallocate itself. For more information about this behaviour please
  * take a look at the size property documentation.
  *
  * @param toCopy - A pack instance to copy.
  */
  copy (toCopy : Pack<Element>) : void

  /**
  * @see Collection.clone
  */
  clone () : Pack<Element>

  /**
  * @see Collection.iterator
  */
  iterator () : PackIterator<Element>
}

export namespace Pack {
  /**
  * Shallow copy the given instance and return it.
  *
  * @param toCopy - An instance to shallow copy.
  *
  * @return A new instance, shallow copy of the given one.
  */
  export function copy <T> (toCopy : Pack<T>) : Pack<T> {
    return toCopy == null ? null : toCopy.clone()
  }
  
  /**
  * Instantiate a new pack that wrap an array of the given type of instance.
  *
  * @param capacity - Capacity of the array to allocate.
  *
  * @return A new pack that wrap an array of the given type of instance.
  */
  export function any <T> (capacity : number) : ArrayPack<T> {
    return ArrayPack.allocate(capacity)
  }

  /**
  * Instantiate a new pack that wrap a unsigned byte buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a unsigned byte buffer of the given capacity.
  */
  export function uint8 (capacity : number) : BufferPack<Uint8Array> {
    return new BufferPack<Uint8Array>(new Uint8Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a unsigned short buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a unsigned short buffer of the given capacity.
  */
  export function uint16 (capacity : number) : BufferPack<Uint16Array> {
    return new BufferPack<Uint16Array>(new Uint16Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a unsigned integer buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a unsigned integer buffer of the given capacity.
  */
  export function uint32 (capacity : number) : BufferPack<Uint32Array> {
    return new BufferPack<Uint32Array>(new Uint32Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a byte buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a byte buffer of the given capacity.
  */
  export function int8 (capacity : number) : BufferPack<Int8Array> {
    return new BufferPack<Int8Array>(new Int8Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a short buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a short buffer of the given capacity.
  */
  export function int16 (capacity : number) : BufferPack<Int16Array> {
    return new BufferPack<Int16Array>(new Int16Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a integer buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a integer buffer of the given capacity.
  */
  export function int32 (capacity : number) : BufferPack<Int32Array> {
    return new BufferPack<Int32Array>(new Int32Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a float buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a float buffer of the given capacity.
  */
  export function float32 (capacity : number) : BufferPack<Float32Array> {
    return new BufferPack<Float32Array>(new Float32Array(capacity))
  }

  /**
  * Instantiate a new pack that wrap a double buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return A new pack that wrap a double buffer of the given capacity.
  */
  export function float64 (capacity : number) : BufferPack<Float64Array> {
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
  export function unsignedUpTo (
    maximum : number, capacity : number
  ) : BufferPack<UnsignedIntegerBuffer> {
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
  export function signedUpTo (
    maximum : number, capacity : number
  ) : BufferPack<IntegerBuffer> {
    return new BufferPack(IntegerBuffer.upTo(maximum, capacity))
  }
}
