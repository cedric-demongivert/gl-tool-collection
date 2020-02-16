export type UnsignedIntegerBuffer = Uint8Array | Uint16Array | Uint32Array

export namespace UnsignedIntegerBuffer {
  /**
  * Instantiate a unsigned byte buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to instantiate.
  *
  * @return A unsigned byte buffer of the given capacity.
  */
  export function uint8 (capacity : number) : Uint8Array {
    return new Uint8Array(capacity)
  }

  /**
  * Instantiate a unsigned short buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to instantiate.
  *
  * @return A unsigned short buffer of the given capacity.
  */
  export function uint16 (capacity : number) : Uint16Array {
    return new Uint16Array(capacity)
  }

  /**
  * Instantiate a unsigned integer buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to instantiate.
  *
  * @return A unsigned integer buffer of the given capacity.
  */
  export function uint32 (capacity : number) : Uint32Array {
    return new Uint32Array(capacity)
  }

  /**
  * Instantiate an unsigned integer buffer that can store values up to the given
  * maximum (included).
  *
  * @param maximum - Maximum value that can be stored into the resulting buffer (included).
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return An unsigned integer buffer that can store values up to the given maximum (included).
  */
  export function upTo (maximum : number, capacity : number) : UnsignedIntegerBuffer {
    if (maximum <= 0xff) {
      return new Uint8Array(capacity)
    } else if (maximum <= 0xffff) {
      return new Uint16Array(capacity)
    } else {
      return new Uint32Array(capacity)
    }
  }
}
