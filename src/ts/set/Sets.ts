import { Pack } from '../pack/Pack'

import { Set } from './Set'
import { PackSet } from './PackSet'
import { SparseDenseSet } from './SparseDenseSet'
import { PackSparseDenseSet } from './PackSparseDenseSet'

export class Sets {
  static SparseDense : any = class {
    static copy <T> (pack : SparseDenseSet) : SparseDenseSet {
      if (pack == null) {
        return null
      } else {
        return (pack.constructor as any).copy(pack)
      }
    }

    static fromPack (
      pack : Pack<number>,
      capacity : number
    ) : SparseDenseSet {
      return new PackSparseDenseSet(pack, capacity)
    }
  }

  static copy <T> (pack : Set<T>) : Set<T> {
    if (pack == null) {
      return null
    } else {
      return (pack.constructor as any).copy(pack)
    }
  }

  static fromPack <T> (pack : Pack<T>) : Set<T> {
    return new PackSet<T>(pack)
  }
}
