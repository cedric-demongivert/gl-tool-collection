import { createUint32PackSparseDenseSet } from './PackSparseDenseSet'
import { createUint16PackSparseDenseSet } from './PackSparseDenseSet'
import { createUint8PackSparseDenseSet } from './PackSparseDenseSet'
import { createAnyPackSparseDenseSet } from './PackSparseDenseSet'
import { createPackSparseDenseSetUpTo } from './PackSparseDenseSet'

/**
 * 
 */
export namespace SparseDenseSets {
    /**
     * @see {@link createUint32PackSparseDenseSet}
     */
    export const uint32 = createUint32PackSparseDenseSet
  
    /**
     * @see {@link createUint16PackSparseDenseSet}
     */
    export const uint16 = createUint16PackSparseDenseSet
  
    /**
     * @see {@link createUint8PackSparseDenseSet}
     */
    export const uint8 = createUint8PackSparseDenseSet
  
    /**
     * @see {@link createAnyPackSparseDenseSet}
     */
    export const any = createAnyPackSparseDenseSet
  
    /**
     * @see {@link createPackSparseDenseSetUpTo}
     */
    export const upTo = createPackSparseDenseSetUpTo
  }
  