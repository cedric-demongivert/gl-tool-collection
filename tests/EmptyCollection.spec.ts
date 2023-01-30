import { ForwardCursor } from "../sources/cursor"
import { EmptyCollection, isEmptyCollecton } from "../sources/EmptyCollection"
import { EMPTY_COLLECTION_INSTANCE } from "../sources/EmptyCollection"
import { getEmptyCollection } from "../sources/EmptyCollection"

/**
 * 
 */
describe('EmptyCollection', function () {
    /**
     * 
     */
    describe('#size', function () {
        /**
         * 
         */
        it('returns zero', function () {
            const sequence = new EmptyCollection<unknown>()
            expect(sequence.size).toBe(0)
        })
    })

    /**
     * 
     */
    describe('#has', function () {
        /**
         * 
         */
        it('returns false', function () {
            const sequence = new EmptyCollection<number>()
            expect(sequence.has(25)).toBeFalsy()
        })
    })

    /**
     * 
     */
    describe('#clone', function () {
        /**
         * 
         */
        it('returns itself', function () {
            const sequence = new EmptyCollection<number>()
            expect(sequence.clone()).toBe(sequence)
        })
    })

    /**
     * 
     */
    describe('#view', function () {
        /**
         * 
         */
        it('returns itself', function () {
            const sequence = new EmptyCollection<number>()
            expect(sequence.view()).toBe(sequence)
        })
    })

    /**
     * 
     */
    describe('#forward', function () {
        /**
         * 
         */
        it('returns the empty forward cursor', function () {
            const sequence = new EmptyCollection<number>()
            expect(sequence.forward()).toBe(ForwardCursor.empty())
        })
    })

    /**
     * 
     */
    describe('#values', function () {
        /**
         * 
         */
        it('returns the empty iterator', function () {
            const sequence = new EmptyCollection<number>()
            expect([...sequence.values()]).toEqual([])
        })
    })

    /**
     * 
     */
    describe('#[Symbol.iterator]', function () {
        /**
         * 
         */
        it('returns the empty iterator', function () {
            const sequence = new EmptyCollection<number>()
            expect([...sequence[Symbol.iterator]()]).toEqual([])
        })
    })

    /**
     * 
     */
    describe('#equals', function () {
        /**
         * 
         */
        it('returns true if the given instance is an empty collection', function () {
            const sequence = new EmptyCollection<number>()
            expect(sequence.equals(new EmptyCollection<number>())).toBeTruthy()
        })
        
        /**
         * 
         */
        it('returns true when applied on itself', function () {
            const sequence = new EmptyCollection<number>()
            expect(sequence.equals(sequence)).toBeTruthy()
        })
        
        /**
         * 
         */
        it('returns false for null', function () {
            const sequence = new EmptyCollection<number>()
            expect(sequence.equals(null)).toBeFalsy()
        })
        
        /**
         * 
         */
        it('returns false for undefined', function () {
            const sequence = new EmptyCollection<number>()
            expect(sequence.equals(undefined)).toBeFalsy()
        })
        
        /**
         * 
         */
        it('returns false for instances of other type', function () {
            const sequence = new EmptyCollection<number>()
            expect(sequence.equals(new Date())).toBeFalsy()
            expect(sequence.equals(15)).toBeFalsy()
            expect(sequence.equals("test")).toBeFalsy()
        })
    })

})

/**
 * 
 */
describe('isEmptyCollection', function () {
    /**
     * 
     */
    it('returns true if the given value is a direct instance of EmptyCollection', function () {
        class Indirect extends EmptyCollection<unknown> {}
        
        expect(isEmptyCollecton(new EmptyCollection())).toBeTruthy()
        expect(isEmptyCollecton(new Indirect())).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false if the given value is null', function () {
        expect(isEmptyCollecton(null)).toBeFalsy()
    })
})

/**
 * 
 */
describe('getEmptyCollection', function () {
    /**
     * 
     */
    it('returns the singleton instance', function () {
        expect(getEmptyCollection()).toBe(EMPTY_COLLECTION_INSTANCE)
    })
})