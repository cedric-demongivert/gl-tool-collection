import { RandomlyAccessibleCollection } from '../RandomlyAccessibleCollection'
import { StaticSet } from './StaticSet'

export interface SparseDenseSet
         extends StaticSet<number>,
                 RandomlyAccessibleCollection<number>
{ }

export namespace SparseDenseSet {
  export function copy (pack : SparseDenseSet) : SparseDenseSet {
    return pack == null ? null : (pack.constructor as any).copy(pack)
  }

  export function uint32 (capacity : number) : SparseDenseSet {
    return new PackSparseDenseSet(Packs.uint32(capacity))
  }

  export function uint16 (capacity : number) : SparseDenseSet {
    return new PackSparseDenseSet(Packs.uint16(capacity))
  }

  export function uint8 (capacity : number) : SparseDenseSet {
    return new PackSparseDenseSet(Packs.uint8(capacity))
  }

  export function any (capacity : number) : SparseDenseSet {
    return new PackSparseDenseSet(Packs.any(capacity))
  }

  export function adaptative (capacity : number) : SparseDenseSet {
    if (capacity <= 0xff) {
      return new PackSparseDenseSet(Packs.uint8(capacity))
    } else if (capacity <= 0xffff) {
      return new PackSparseDenseSet(Packs.uint16(capacity))
    } else {
      return new PackSparseDenseSet(Packs.uint32(capacity))
    }
  }
}
