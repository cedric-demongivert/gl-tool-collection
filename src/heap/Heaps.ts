import { Comparator } from '../Comparator'
import { Packs } from '../pack/Packs'
import { Pack } from '../pack/Pack'

import { ReallocableHeap } from './ReallocableHeap'
import { Heap } from './Heap'
import { PackHeap } from './PackHeap'

export class Heaps {
  static copy <T> (pack : Heap<T>) : Heap<T> {
    if (pack == null) {
      return null
    } else {
      return (pack.constructor as any).copy(pack)
    }
  }

  static any <T> (
    capacity : number,
    comparator : Comparator<T, T>
  ) : ReallocableHeap<T> {
    return new PackHeap<T>(Packs.any(capacity), comparator)
  }

  static uint8 (
    capacity : number,
    comparator : Comparator<number, number>
  ) : ReallocableHeap<number> {
    return new PackHeap<number>(Packs.uint8(capacity), comparator)
  }

  static uint16 (
    capacity : number,
    comparator : Comparator<number, number>
  ) : ReallocableHeap<number> {
    return new PackHeap<number>(Packs.uint16(capacity), comparator)
  }

  static uint32 (
    capacity : number,
    comparator : Comparator<number, number>
  ) : ReallocableHeap<number> {
    return new PackHeap<number>(Packs.uint32(capacity), comparator)
  }

  static int8 (
    capacity : number,
    comparator : Comparator<number, number>
  ) : ReallocableHeap<number> {
    return new PackHeap<number>(Packs.int8(capacity), comparator)
  }

  static int16 (
    capacity : number,
    comparator : Comparator<number, number>
  ) : ReallocableHeap<number> {
    return new PackHeap<number>(Packs.int16(capacity), comparator)
  }

  static int32 (
    capacity : number,
    comparator : Comparator<number, number>
  ) : ReallocableHeap<number> {
    return new PackHeap<number>(Packs.int32(capacity), comparator)
  }

  static float32 (
    capacity : number,
    comparator : Comparator<number, number>
  ) : ReallocableHeap<number> {
    return new PackHeap<number>(Packs.float32(capacity), comparator)
  }

  static float64 (
    capacity : number,
    comparator : Comparator<number, number>
  ) : ReallocableHeap<number> {
    return new PackHeap<number>(Packs.float64(capacity), comparator)
  }

  static fromPack <T> (
    pack : Pack<T>,
    comparator : Comparator<T, T>
  ) : Heap<T> {
    return new PackHeap<T>(pack, comparator)
  }
}
