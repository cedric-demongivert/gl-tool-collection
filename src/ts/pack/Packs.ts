import { Pack } from './Pack'
import { TypedArrayPack } from './TypedArrayPack'
import { ArrayPack } from './ArrayPack'
import { PackCircularBuffer } from '../circular/PackCircularBuffer'

export class Packs {
  static copy <T> (pack : Pack<T>) : Pack<T> {
    if (pack == null) {
      return null
    } else {
      return (pack.constructor as any).copy(pack)
    }
  }

  static any <T> (capacity : number) : Pack<T> {
    return new ArrayPack<T>(capacity)
  }

  static uint8 (capacity : number) : Pack<number> {
    return new TypedArrayPack(Uint8Array, capacity)
  }

  static uint16 (capacity : number) : Pack<number> {
    return new TypedArrayPack(Uint16Array, capacity)
  }

  static uint32 (capacity : number) : Pack<number> {
    return new TypedArrayPack(Uint32Array, capacity)
  }

  static int8 (capacity : number) : Pack<number> {
    return new TypedArrayPack(Int8Array, capacity)
  }

  static int16 (capacity : number) : Pack<number> {
    return new TypedArrayPack(Int16Array, capacity)
  }

  static int32 (capacity : number) : Pack<number> {
    return new TypedArrayPack(Int32Array, capacity)
  }

  static float32 (capacity : number) : Pack<number> {
    return new TypedArrayPack(Float32Array, capacity)
  }

  static float64 (capacity : number) : Pack<number> {
    return new TypedArrayPack(Float64Array, capacity)
  }

  static circular <T> (pack : Pack<T>) : PackCircularBuffer<T> {
    return new PackCircularBuffer(pack)
  }
}
