import { FloatBuffer } from '@library/buffer/FloatBuffer'
import { UnsignedIntegerBuffer } from '@library/buffer/UnsignedIntegerBuffer'
import { IntegerBuffer } from '@library/buffer/IntegerBuffer'

export type Buffer = UnsignedIntegerBuffer | IntegerBuffer | FloatBuffer

export namespace Buffer {
  export import float32      = FloatBuffer.float32
  export import float64      = FloatBuffer.float64

  export import uint8        = UnsignedIntegerBuffer.uint8
  export import uint16       = UnsignedIntegerBuffer.uint16
  export import uint32       = UnsignedIntegerBuffer.uint32
  export import unsignedUpTo = UnsignedIntegerBuffer.upTo

  export import int8        = IntegerBuffer.int8
  export import int16       = IntegerBuffer.int16
  export import int32       = IntegerBuffer.int32
  export import signedUpTo  = IntegerBuffer.upTo

  /**
  * Reallocate the given buffer.
  *
  * @param buffer - A buffer to reallocate.
  * @param capacity - The new capacity of the buffer.
  *
  * @return A reallocation of the given buffer.
  */
  export function reallocate <T extends Buffer> (buffer : T, capacity : number) : T {
    const result : T = new buffer.constructor(capacity)
    return result
  }
}
