/**
 * 
 */
export type TypedArray = UintArray | IntArray | FloatArray

/**
 * 
 */
export type IntArray = Int8Array | Int16Array | Int32Array

/**
 * 
 */
export type UintArray = Uint8Array | Uint16Array | Uint32Array

/**
 * 
 */
export type FloatArray = Float32Array | Float64Array

/**
 * 
 */
export namespace TypedArray {
  /**
   * 
   */
  export type Allocator<T extends TypedArray> = new (capacity: number) => T
}

/**
 * Allocates a float buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to instantiate.
 *
 * @returns A float buffer of the given capacity.
 */
export function createFloat32Array(capacity: number): Float32Array {
  return new Float32Array(capacity)
}

/**
 * Allocates a double buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to instantiate.
 *
 * @returns A double buffer of the given capacity.
 */
export function createFloat64Array(capacity: number): Float64Array {
  return new Float64Array(capacity)
}

/**
 * Allocates a byte buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to instantiate.
 *
 * @returns A byte buffer of the given capacity.
 */
export function createInt8Array(capacity: number): Int8Array {
  return new Int8Array(capacity)
}

/**
 * Allocates a short buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to instantiate.
 *
 * @returns A short buffer of the given capacity.
 */
export function createInt16Array(capacity: number): Int16Array {
  return new Int16Array(capacity)
}

/**
 * Allocates an integer buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to instantiate.
 *
 * @returns An integer buffer of the given capacity.
 */
export function createInt32Array(capacity: number): Int32Array {
  return new Int32Array(capacity)
}

/**
 * 
 */
export const INT8_MAX_VALUE = 0x7f

/**
 * 
 */
export const INT16_MAX_VALUE = 0x7fff

/**
 * Allocates an integer buffer that can store values up to the given maximum (included).
 *
 * @param maximum - Maximum value that can be stored into the resulting buffer (included).
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns An integer buffer that can store values up to the given maximum (included).
 */
export function createIntArrayUpTo(maximum: number, capacity: number): IntArray {
  if (maximum <= INT8_MAX_VALUE) {
    return new Int8Array(capacity)
  } else if (maximum <= INT16_MAX_VALUE) {
    return new Int16Array(capacity)
  } else {
    return new Int32Array(capacity)
  }
}

/**
 * Allocates an unsigned byte buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to instantiate.
 *
 * @returns A unsigned byte buffer of the given capacity.
 */
export function createUint8Array(capacity: number): Uint8Array {
  return new Uint8Array(capacity)
}

/**
 * Allocates an unsigned short buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to instantiate.
 *
 * @returns A unsigned short buffer of the given capacity.
 */
export function createUint16Array(capacity: number): Uint16Array {
  return new Uint16Array(capacity)
}

/**
 * Allocates an unsigned integer buffer of the given capacity.
 *
 * @param capacity - Capacity of the buffer to instantiate.
 *
 * @returns A unsigned integer buffer of the given capacity.
 */
export function createUint32Array(capacity: number): Uint32Array {
  return new Uint32Array(capacity)
}

/**
 * 
 */
export const UINT8_MAX_VALUE = 0xff

/**
 * 
 */
export const UINT16_MAX_VALUE = 0xffff

/**
 * Allocates an unsigned integer buffer that can store values up to the given maximum (included).
 *
 * @param maximum - Maximum value that can be stored into the resulting buffer (included).
 * @param capacity - Capacity of the buffer to allocate.
 *
 * @returns An unsigned integer buffer that can store values up to the given maximum (included).
 */
export function createUintArrayUpTo(maximum: number, capacity: number): UintArray {
  if (maximum <= UINT8_MAX_VALUE) {
    return new Uint8Array(capacity)
  } else if (maximum <= UINT16_MAX_VALUE) {
    return new Uint16Array(capacity)
  } else {
    return new Uint32Array(capacity)
  }
}

/**
 * Allocates a new typed array of the same type as the one given.
 *
 * @param typedArray - A typed array to match.
 * @param capacity - The capacity to allocate.
 *
 * @returns A new typed array of the same type as the one given.
 */
export function allocateSameTypedArray<T extends TypedArray>(typedArray: T, capacity: number): T {
  return new (typedArray.constructor as TypedArray.Allocator<T>)(capacity)
}
