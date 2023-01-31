import { EmptySequence } from "../../sources/sequence/EmptySequence"
import { EMPTY_SEQUENCE_INSTANCE } from "../../sources/sequence/EmptySequence"
import { getEmptySequence } from "../../sources/sequence/EmptySequence"
import { Sequence } from "../../sources/sequence/Sequence"

/**
 * 
 */
describe('sequence/EmptySequence', function () {
    /**
     * 
     */
    describe('#size', function () {
        /**
         * 
         */
        it('returns zero', function () {
            const sequence = new EmptySequence<unknown>()
            expect(sequence.size).toBe(0)
        })
    })

    /**
     * 
     */
    describe('#get', function () {
        /**
         * 
         */
        it('returns undefined', function () {
            const sequence = new EmptySequence<unknown>()
            expect(sequence.get(123)).toBeUndefined()
        })
    })

    /**
     * 
     */
    describe('#last', function () {
        /**
         * 
         */
        it('returns undefined', function () {
            const sequence = new EmptySequence<unknown>()
            expect(sequence.last).toBeUndefined()
        })
    })

    /**
     * 
     */
    describe('#first', function () {
        /**
         * 
         */
        it('returns undefined', function () {
            const sequence = new EmptySequence<unknown>()
            expect(sequence.first).toBeUndefined()
        })
    })

    /**
     * 
     */
    describe('#indexOf', function () {
        /**
         * 
         */
        it('returns -1', function () {
            const sequence = new EmptySequence<number>()
            expect(sequence.indexOf(18)).toBe(-1)
        })
    })

    /**
     * 
     */
    describe('#indexOfInSubsequence', function () {
        /**
         * 
         */
        it('returns -1', function () {
            const sequence = new EmptySequence<number>()
            expect(sequence.indexOfInSubsequence(18, 0, 9)).toBe(-1)
        })
    })

    /**
     * 
     */
    describe('#hasInSubsequence', function () {
        /**
         * 
         */
        it('returns false', function () {
            const sequence = new EmptySequence<number>()
            expect(sequence.hasInSubsequence(18, 0, 9)).toBeFalsy()
        })
    })

    /**
     * 
     */
    describe('#equals', function () {
        /**
         * 
         */
        it('returns true if the given instance is an empty sequence', function () {
            const sequence = new EmptySequence<number>()
            expect(sequence.equals(new EmptySequence<number>())).toBeTruthy()
        })
        
        /**
         * 
         */
        it('returns true when applied on itself', function () {
            const sequence = new EmptySequence<number>()
            expect(sequence.equals(sequence)).toBeTruthy()
        })
        
        /**
         * 
         */
        it('returns false for null', function () {
            const sequence = new EmptySequence<number>()
            expect(sequence.equals(null)).toBeFalsy()
        })
        
        /**
         * 
         */
        it('returns false for undefined', function () {
            const sequence = new EmptySequence<number>()
            expect(sequence.equals(undefined)).toBeFalsy()
        })
        
        /**
         * 
         */
        it('returns false for instances of other type', function () {
            const sequence = new EmptySequence<number>()
            expect(sequence.equals(new Date())).toBeFalsy()
            expect(sequence.equals(15)).toBeFalsy()
            expect(sequence.equals("test")).toBeFalsy()
        })
    })

    /**
     * 
     */
    describe('#toString', function () {
        /**
         * 
         */
        it('returns a description of the sequence', function () {
            const sequence = new EmptySequence<number>()
            expect(sequence.toString().indexOf(Sequence.stringify([])))
        })
    })
})

/**
 * 
 */
describe('sequence/getEmptySequence', function () {
    /**
     * 
     */
    it('returns the singleton instance', function () {
        expect(getEmptySequence()).toBe(EMPTY_SEQUENCE_INSTANCE)
    })
})