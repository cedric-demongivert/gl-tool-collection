import { Pack } from './Pack'
import { BufferPack } from './BufferPack'
import { ArrayPack } from './ArrayPack'
import { UintArray } from '../native/UintArray'
import * as UintArrays from '../native/UintArrays'

export class Packs {
  static copy <T> (pack : Pack<T>) : Pack<T> {
    if (pack == null) {
      return null
    } else {
      return (pack.constructor as any).copy(pack)
    }
  }

  static create <T, Collection extends Pack<T>> (
    pack : Collection,
    capacity : number
  ) : Collection {
    if (pack == null) {
      return null
    } else {
      return (pack as any).instantiate(capacity)
    }
  }

  static like <T> (existing : Pack<T>, capacity : number) : Pack<T> {
    return existing.allocate(capacity)
  }

  static any <T> (capacity : number) : Pack<T> {
    return new ArrayPack<T>(capacity)
  }

  static uint8 (capacity : number) : BufferPack<Uint8Array> {
    return new BufferPack<Uint8Array>(new Uint8Array(capacity))
  }

  static uint16 (capacity : number) : BufferPack<Uint16Array> {
    return new BufferPack<Uint16Array>(new Uint16Array(capacity))
  }

  static uint32 (capacity : number) : BufferPack<Uint32Array> {
    return new BufferPack<Uint32Array>(new Uint32Array(capacity))
  }

  static upTo (maximum : number, capacity : number) : BufferPack<UintArray> {
    return new BufferPack<UintArray>(UintArrays.upTo(maximum, capacity))
  }

  static int8 (capacity : number) : BufferPack<Int8Array> {
    return new BufferPack<Int8Array>(new Int8Array(capacity))
  }

  static int16 (capacity : number) : BufferPack<Int16Array> {
    return new BufferPack<Int16Array>(new Int16Array(capacity))
  }

  static int32 (capacity : number) : BufferPack<Int32Array> {
    return new BufferPack<Int32Array>(new Int32Array(capacity))
  }

  static float32 (capacity : number) : BufferPack<Float32Array> {
    return new BufferPack<Float32Array>(new Float32Array(capacity))
  }

  static float64 (capacity : number) : BufferPack<Float64Array> {
    return new BufferPack<Float64Array>(new Float64Array(capacity))
  }
}
