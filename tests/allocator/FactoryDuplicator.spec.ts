import { Assignable, Clearable } from "@cedric-demongivert/gl-tool-utils"
import { mock } from 'jest-mock-extended'

import { createFactoryDuplicator } from "../../sources/allocator/FactoryDuplicator"

/**
 * 
 */
function duplicableFactory(): Clearable & Assignable<any> {
    return mock<Clearable & Assignable<any>>()
}

/**
 * 
 */
describe('allocator/FactoryDuplicator', function () {
    /**
     * 
     */
    describe('#copy', function () {
        /**
         * 
         */
        it('returns a copy of the given value from the underlying pool if the allocator is not empty', function () {
           
        })

        /**
         * 
         */
        it('instantiates a copy of the given value if the allocator is empty', function () {
           
        })
    })
})

/**
 * 
 */
describe('#createFactoryDuplicator', function () {
    /**
     * 
     */
    it('instantiates a new allocator over the given factory', function () {
        const allocator = createFactoryDuplicator(duplicableFactory)
        expect(allocator.factory).toBe(duplicableFactory)
    })

    /**
     * 
     */
    it('instantiates a new allocator with a default capacity of 16 instances', function () {
        const allocator = createFactoryDuplicator(duplicableFactory)
        expect(allocator.capacity).toBe(16)
    })

    /**
     * 
     */
    it('instantiates a new allocator with the requested capacity', function () {
        const allocator = createFactoryDuplicator(duplicableFactory, 32)
        expect(allocator.capacity).toBe(32)
    })

    /**
     * 
     */
    it('fills the requested allocator with new instances', function () {
        const allocator = createFactoryDuplicator(duplicableFactory, 32)
        expect(allocator.size).toBe(32)
    })
})