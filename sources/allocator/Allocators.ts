import { createFactoryAllocator } from "./FactoryAllocator"
import { createFactoryDuplicator } from "./FactoryDuplicator"

/**
 * 
 */
export namespace Allocators {
    /**
     * @see {@link createFactoryAllocator}
     */
    export const createAllocatorFromFactory = createFactoryAllocator

    /**
     * @see {@link createFactoryDuplicator}
     */
    export const createDuplicatorFromFactory = createFactoryDuplicator
}