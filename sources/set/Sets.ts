import { createListSet } from './ListSet'
import { createPackSet } from './PackSet'
import { createBitSet } from './BitSet'
import { createNativeSet } from './NativeSet'

/**
 * 
 */
export namespace Sets {
    /**
     * @see {@link createListSet}
     */
    export const fromList = createListSet

    /**
     * @see {@link createPackSet}
     */
    export const fromPack = createPackSet

    /**
     * @see {@link createBitSet}
     */
    export const bitSet = createBitSet

    /**
     * @see {@link createNativeSet}
     */
    export const any = createNativeSet
}