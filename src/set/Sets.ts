import { Pack } from '../pack/Pack'
import { Packs } from '../pack/Packs'

import { Set } from './Set'
import { PackSet } from './PackSet'
import { SparseDenseSet } from './SparseDenseSet'
import { PackSparseDenseSet } from './PackSparseDenseSet'
import { IdentifierSet } from './IdentifierSet'

export class Sets {
  static SparseDense = class {
    static copy (pack : SparseDenseSet) : SparseDenseSet {
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

    static adaptative (capacity : number) : SparseDenseSet {
      if (capacity <= 0xff) {
        return new PackSparseDenseSet(Packs.uint8(capacity))
      } else if (capacity <= 0xffff) {
        return new PackSparseDenseSet(Packs.uint16(capacity))
      } else {
        return new PackSparseDenseSet(Packs.uint32(capacity))
      }
    }
  }

  static copy <T> (pack : Set<T>) : Set<T> {
    return pack == null ? null : (pack.constructor as any).copy(pack)
  }

  static fromPack <T> (pack : Pack<T>) : Set<T> {
    return new PackSet<T>(pack)
  }

  static identifier (capacity : number) : IdentifierSet {
    return new IdentifierSet(capacity)
  }
}
