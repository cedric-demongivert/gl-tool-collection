import { Clearable } from "@cedric-demongivert/gl-tool-utils"
import { mock } from 'jest-mock-extended'

import { FactoryAllocator } from "../../sources/allocator/FactoryAllocator"
import { createFactoryAllocator } from "../../sources/allocator/FactoryAllocator"

/**
 * 
 */
function clearableFactory(): Clearable {
    return mock<Clearable>()
}

/**
 * 
 */
describe('FactoryAllocator', function () {
    /**
     * 
     */
    describe('#constructor', function () {
        /**
         * 
         */
        it('instantiates a new allocator over the given factory', function () {
            const allocator = new FactoryAllocator(clearableFactory)
            expect(allocator.factory).toBe(clearableFactory)
        })

        /**
         * 
         */
        it('instantiates a new allocator with a default capacity of 16 instances', function () {
            const allocator = new FactoryAllocator(clearableFactory)
            expect(allocator.capacity).toBe(16)
        })

        /**
         * 
         */
        it('instantiates a new allocator with the requested capacity', function () {
            const allocator = new FactoryAllocator(clearableFactory, 32)
            expect(allocator.capacity).toBe(32)
        })

        /**
         * 
         */
        it('fills the requested allocator with new instances', function () {
            const allocator = new FactoryAllocator(clearableFactory, 32)
            expect(allocator.size).toBe(32)
        })
    })

    /**
     * 
     */
    describe('#allocate', function () {
        /**
         * 
         */
        it('returns a freed instance if the allocator is not empty', function () {
            const factory = jest.fn(clearableFactory)
            const allocator = new FactoryAllocator(factory, 4)

            expect(allocator.size).toBe(4)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(4)

            expect(allocator.allocate()).not.toBeNull()

            expect(allocator.size).toBe(3)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(4)
        })

        /**
         * 
         */
        it('returns a new instance if the allocator is empty', function () {
            const factory = jest.fn(clearableFactory)
            const allocator = new FactoryAllocator(factory, 4)

            expect(allocator.size).toBe(4)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(4)

            for (let index = 0; index < 4; ++index) {
                allocator.allocate()
            }

            expect(allocator.size).toBe(0)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(4)

            expect(allocator.allocate()).not.toBeNull()

            expect(allocator.size).toBe(0)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(5)
        })
    })

    /**
     * 
     */
    describe('#free', function () {
        /**
         * 
         */
        it('returns the given instance to the allocator', function () {
            const factory = jest.fn(clearableFactory)
            const allocator = new FactoryAllocator(factory, 4)

            expect(allocator.size).toBe(4)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(4)

            const instance = allocator.allocate()

            expect(allocator.size).toBe(3)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(4)

            allocator.free(instance)

            expect(allocator.size).toBe(4)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(4)
        })

        /**
         * 
         */
        it('resets the given instance', function () {
            const factory = jest.fn(clearableFactory)
            const allocator = new FactoryAllocator(factory, 4)

            expect(allocator.size).toBe(4)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(4)

            const instance = allocator.allocate()

            expect(instance.clear).not.toHaveBeenCalled()

            allocator.free(instance)

            expect(instance.clear).toHaveBeenCalled()
        })

        /**
         * 
         */
        it('expands the capacity of the underlying pool of instances if necessary', function () {
            const factory = jest.fn(clearableFactory)
            const allocator = new FactoryAllocator(factory, 4)

            expect(allocator.size).toBe(4)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(4)

            allocator.free(clearableFactory())

            expect(allocator.size).toBe(5)
            expect(allocator.capacity).toBeGreaterThanOrEqual(5)
            expect(factory).toHaveBeenCalledTimes(4)
        })
    })

    /**
     * 
     */
    describe('#clear', function () {
        /**
         * 
         */
        it('empties the underlying allocator pool of instances', function () {
            const factory = jest.fn(clearableFactory)
            const allocator = new FactoryAllocator(factory, 4)

            expect(allocator.size).toBe(4)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(4)

            allocator.clear()

            expect(allocator.size).toBe(0)
            expect(allocator.capacity).toBe(4)
            expect(factory).toHaveBeenCalledTimes(4)
        })
    })
})

/**
 * 
 */
describe('#createFactoryAllocator', function () {
    /**
     * 
     */
    it('instantiates a new allocator over the given factory', function () {
        const allocator = createFactoryAllocator(clearableFactory)
        expect(allocator.factory).toBe(clearableFactory)
    })

    /**
     * 
     */
    it('instantiates a new allocator with a default capacity of 16 instances', function () {
        const allocator = createFactoryAllocator(clearableFactory)
        expect(allocator.capacity).toBe(16)
    })

    /**
     * 
     */
    it('instantiates a new allocator with the requested capacity', function () {
        const allocator = createFactoryAllocator(clearableFactory, 32)
        expect(allocator.capacity).toBe(32)
    })

    /**
     * 
     */
    it('fills the requested allocator with new instances', function () {
        const allocator = createFactoryAllocator(clearableFactory, 32)
        expect(allocator.size).toBe(32)
    })
})