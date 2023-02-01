import { FloatBuffer } from './FloatBuffer'
import { UnsignedIntegerBuffer } from './UnsignedIntegerBuffer'
import { IntegerBuffer } from './IntegerBuffer'
/**
  * 
  */
export type NativeBuffer = UnsignedIntegerBuffer | IntegerBuffer | FloatBuffer

/**
  * 
  */
export namespace Buffer {
  /**
   * 
   */
  export type Allocator<T> = new (capacity: number) => T

  /**
   * 
   */
  export import float32 = FloatBuffer.float32

  /**
   * 
   */
  export import float64 = FloatBuffer.float64

  /**
   * 
   */
  export import uint8 = UnsignedIntegerBuffer.uint8

  /**
   * 
   */
  export import uint16 = UnsignedIntegerBuffer.uint16

  /**
   * 
   */
  export import uint32 = UnsignedIntegerBuffer.uint32

  /**
   * 
   */
  export import unsignedUpTo = UnsignedIntegerBuffer.upTo

  /**
   * 
   */
  export import int8 = IntegerBuffer.int8

  /**
   * 
   */
  export import int16 = IntegerBuffer.int16

  /**
   * 
   */
  export import int32 = IntegerBuffer.int32

  /**
   * 
   */
  export import signedUpTo = IntegerBuffer.upTo

  /**
   * Reallocate the given buffer.
   *
   * @param buffer - A buffer to reallocate.
   * @param capacity - The new capacity of the buffer.
   *
   * @returns A reallocation of the given buffer.
   */
  export function reallocate<T extends NativeBuffer>(buffer: T, capacity: number): T {
    const result: T = new (buffer.constructor as Buffer.Allocator<T>)(capacity)
    return result
  }
}
