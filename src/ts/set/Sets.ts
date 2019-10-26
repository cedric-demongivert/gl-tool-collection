import { Pack, Packs } from '../pack/Pack'

import { Set } from './Set'
import { PackSet } from './PackSet'
import { SparseDenseSet } from './SparseDenseSet'
import { PackSparseDenseSet } from './PackSparseDenseSet'

type PackFactory<T> = (capacity : number) => Pack<T>

export class Sets {
  static SparseDense : any = class {
    static copy <T> (pack : SparseDenseSet) : SparseDenseSet {
      return pack == null ? null : (pack.constructor as any).copy(pack)
    }

    static uint32 (capacity : number) : SparseDenseSet {
      return new PackSparseDenseSet(Packs.uint32(capacity))
    }

    static uint16 (capacity : number) : SparseDenseSet {
      return new PackSparseDenseSet(Packs.uint16(capacity))
    }

    static uint8 (capacity : number) : SparseDenseSet {
      return new PackSparseDenseSet(Packs.uint8(capacity))
    }

    static any (capacity : number) : SparseDenseSet {
      return new PackSparseDenseSet(Packs.any(capacity))
    }
  }

  static copy <T> (pack : Set<T>) : Set<T> {
    return pack == null ? null : (pack.constructor as any).copy(pack)
  }

  static fromPack <T> (pack : Pack<T>) : Set<T> {
    return new PackSet<T>(pack)
  }
}
