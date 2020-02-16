export type FloatBuffer = Float32Array | Float64Array

export namespace FloatBuffer {
  /**
  * Instantiate a float buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to instantiate.
  *
  * @return A float buffer of the given capacity.
  */
  export function float32 (capacity : number) : Float32Array {
    return new Float32Array(capacity)
  }

  /**
  * Instantiate a double buffer of the given capacity.
  *
  * @param capacity - Capacity of the buffer to instantiate.
  *
  * @return A double buffer of the given capacity.
  */
  export function float64 (capacity : number) : Float64Array {
    return new Float64Array(capacity)
  }
}
