import { Comparator } from "@cedric-demongivert/gl-tool-utils"
import { EmptyCollectionError } from "../../sources/error/EmptyCollectionError"
import { IllegalArgumentsError } from "../../sources/error/IllegalArgumentsError"
import { IllegalCallError } from "../../sources/error/IllegalCallError"
import { EmptySequence } from "../../sources/sequence/EmptySequence"
import { EMPTY_SEQUENCE_INSTANCE } from "../../sources/sequence/EmptySequence"
import { getEmptySequence } from "../../sources/sequence/EmptySequence"
import { IllegalSequenceIndexError } from "../../sources/sequence/error/IllegalSequenceIndexError"

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
        it('throws', function () {
            const sequence = new EmptySequence<unknown>()
            expect(() => sequence.get(15)).toThrowError(new IllegalArgumentsError({ index: 15 }, new IllegalSequenceIndexError({ value: 15, sequence})))
        })
    })

    /**
     * 
     */
    describe('#last', function () {
        /**
         * 
         */
        it('throws', function () {
            const sequence = new EmptySequence<unknown>()
            expect(() => sequence.last).toThrowError(new IllegalCallError('get last', new EmptyCollectionError(sequence)))
        })
    })

    /**
     * 
     */
    describe('#first', function () {
        /**
         * 
         */
        it('throws', function () {
            const sequence = new EmptySequence<unknown>()
            expect(() => sequence.first).toThrowError(new IllegalCallError('get first', new EmptyCollectionError(sequence)))
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

        /**
         * 
         */
        it('throws if the specified subsequence is out of bounds', function () {
            const sequence = new EmptySequence<number>()
            expect(() => sequence.indexOf(18, 0, 5)).toThrow()
            expect(() => sequence.indexOf(18, 5, 5)).toThrow()
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
            const sequence = new EmptySequence<number>()
            expect(sequence.has(18)).toBeFalsy()
        })

        /**
         * 
         */
        it('throws if the specified subsequence is out of bounds', function () {
            const sequence = new EmptySequence<number>()
            expect(() => sequence.has(18, 0, 5)).toThrow()
            expect(() => sequence.has(18, 5, 5)).toThrow()
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