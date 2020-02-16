export type IntegerBuffer = Int8Array | Int16Array | Int32Array

export namespace IntegerBuffer {
  /**
  * Instantiate a byte buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to instantiate.
  *
  * @return A byte buffer of the given capacity.
  */
  export function int8 (capacity : number) : Int8Array {
    return new Int8Array(capacity)
  }

  /**
  * Instantiate a short buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to instantiate.
  *
  * @return A short buffer of the given capacity.
  */
  export function int16 (capacity : number) : Int16Array {
    return new Int16Array(capacity)
  }

  /**
  * Instantiate an integer buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to instantiate.
  *
  * @return An integer buffer of the given capacity.
  */
  export function int32 (capacity : number) : Int32Array {
    return new Int32Array(capacity)
  }

  /**
  * Instantiate an integer buffer that can store values up to the given maximum (included).
  *
  * @param maximum - Maximum value that can be stored into the resulting buffer (included).
  * @param capacity - Capacity of the buffer to allocate.
  *
  * @return An integer buffer that can store values up to the given maximum (included).
  */
  export function upTo (maximum : number, capacity : number) : IntegerBuffer {
    if (maximum <= 0x7f) {
      return new Int8Array(capacity)
    } else if (maximum <= 0x7fff) {
      return new Int16Array(capacity)
    } else {
      return new Int32Array(capacity)
    }
  }
}
