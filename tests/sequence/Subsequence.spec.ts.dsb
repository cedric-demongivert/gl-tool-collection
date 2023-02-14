import { mock } from 'jest-mock-extended'

import { Sequence } from '../../sources/sequence/Sequence'
import { Subsequence } from '../../sources/sequence/Subsequence'

/**
 * 
 */
describe('sequence/Subsequence', function () {
    /**
     * 
     */
    describe('#constructor', function () {
        /**
         * 
         */
        it('creates a subsequence equivalent to the parent sequence by default', function () {
            const sequence = mock<Sequence<unknown>>()
            const subsequence = new Subsequence(sequence)

            expect(subsequence.sequence).toBe(sequence)
            expect(subsequence.from).toBe(0)
            expect(subsequence.to).toBe(Number.POSITIVE_INFINITY)
        })

        /**
         * 
         */
        it('allows to create a subsequence that skips the first nth elements', function () {
            const sequence = mock<Sequence<unknown>>()
            const subsequence = new Subsequence(sequence, 5)

            expect(subsequence.sequence).toBe(sequence)
            expect(subsequence.from).toBe(5)
            expect(subsequence.to).toBe(Number.POSITIVE_INFINITY)
        })

        /**
         * 
         */
        it('allows to create a fully-specified subsequence of a sequence', function () {
            const sequence = mock<Sequence<unknown>>()
            const subsequence = new Subsequence(sequence, 3, 20)

            expect(subsequence.sequence).toBe(sequence)
            expect(subsequence.from).toBe(3)
            expect(subsequence.to).toBe(20)
        })
    })

    /**
     * 
     */
    describe('#get size', function () {
        /**
         * 
         */
        it('returns the number of elements in the subsequence if the parent sequence holds it entirely', function () {
            const sequence = mock<Sequence<unknown>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            expect(subsequence.size).toBe(10)
        })

        /**
         * 
         */
        it('returns the number of elements in the subsequence truncated to the parent size if the subsequence overextend it', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            expect(subsequence.size).toBe(7)
        })

        /**
         * 
         */
        it('returns zero if the parent sequence is too small', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 13, 28)

            expect(subsequence.size).toBe(0)
        })
    })

    /**
     * 
     */
    describe('#get size', function () {
        /**
         * 
         */
        it('returns the number of elements in the subsequence if the parent sequence holds it entirely', function () {
            const sequence = mock<Sequence<unknown>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            expect(subsequence.size).toBe(10)
        })

        /**
         * 
         */
        it('returns the number of elements in the subsequence truncated to the parent size if the subsequence overextend it', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            expect(subsequence.size).toBe(7)
        })

        /**
         * 
         */
        it('returns zero if the parent sequence is too small', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 13, 28)

            expect(subsequence.size).toBe(0)
        })
    })

    /**
     * 
     */
    describe('#get', function () {
        /**
         * 
         */
        it('returns the corresponding element of the parent sequence', function () {
            const sequence = mock<Sequence<number>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.get.mockReturnValue(25)

            expect(sequence.get).not.toHaveBeenCalled()
            expect(subsequence.get(5)).toBe(25)
            expect(sequence.get).toHaveBeenCalledWith(8)
        })

        /**
         * 
         */
        it('returns undefined if the index is not in the subsequence', function () {
            const sequence = mock<Sequence<number>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.get.mockReturnValue(25)

            expect(subsequence.get(12)).toBeUndefined()
        })
    })

    /**
     * 
     */
    describe('#last', function () {
        /**
         * 
         */
        it('returns the corresponding element of the parent sequence', function () {
            const sequence = mock<Sequence<number>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.get.mockReturnValue(25)

            expect(sequence.get).not.toHaveBeenCalled()
            expect(subsequence.last).toBe(25)
            expect(sequence.get).toHaveBeenCalledWith(12)
        })

        /**
         * 
         */
        it('returns the corresponding element of the parent sequence if the parent sequence is smaller', function () {
            const sequence = mock<Sequence<number>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.get.mockReturnValue(25)

            expect(sequence.get).not.toHaveBeenCalled()
            expect(subsequence.last).toBe(25)
            expect(sequence.get).toHaveBeenCalledWith(9)
        })

        /**
         * 
         */
        it('returns undefined if the subsequence is empty', function () {
            const sequence = mock<Sequence<number>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 13, 13)

            sequence.get.mockReturnValue(25)

            expect(subsequence.last).toBeUndefined()
        })

        /**
         * 
         */
        it('returns undefined if the parent sequence is too small', function () {
            const sequence = mock<Sequence<number>>({ size: 2 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.get.mockReturnValue(25)

            expect(subsequence.last).toBeUndefined()
        })
    })

    /**
     * 
     */
    describe('#first', function () {
        /**
         * 
         */
        it('returns the corresponding element of the parent sequence', function () {
            const sequence = mock<Sequence<number>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.get.mockReturnValue(25)

            expect(sequence.get).not.toHaveBeenCalled()
            expect(subsequence.first).toBe(25)
            expect(sequence.get).toHaveBeenCalledWith(3)
        })

        /**
         * 
         */
        it('returns undefined if the subsequence is empty', function () {
            const sequence = mock<Sequence<number>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 13, 13)

            sequence.get.mockReturnValue(25)

            expect(subsequence.first).toBeUndefined()
        })

        /**
         * 
         */
        it('returns undefined if the parent sequence is too small', function () {
            const sequence = mock<Sequence<number>>({ size: 2 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.get.mockReturnValue(25)

            expect(subsequence.first).toBeUndefined()
        })
    })

    /**
     * 
     */
    describe('#indexOf', function () {
        /**
         * 
         */
        it('returns the result of the corresponding call of the parent sequence', function () {
            const sequence = mock<Sequence<number>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.indexOfInSubsequence.mockReturnValue(9)

            expect(sequence.indexOfInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.indexOf(10)).toBe(9)
            expect(sequence.indexOfInSubsequence).toHaveBeenCalledWith(10, 3, 10)
        })

        /**
         * 
         */
        it('handles smaller parent sequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.indexOfInSubsequence.mockReturnValue(9)

            expect(sequence.indexOfInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.indexOf(10)).toBe(9)
            expect(sequence.indexOfInSubsequence).toHaveBeenCalledWith(10, 3, 7)
        })

        /**
         * 
         */
        it('handles parent sequences that are too small', function () {
            const sequence = mock<Sequence<unknown>>({ size: 2 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.indexOfInSubsequence.mockReturnValue(-1)

            expect(sequence.indexOfInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.indexOf(10)).toBe(-1)
            expect(sequence.indexOfInSubsequence).toHaveBeenCalledWith(10, 3, 0)
        })
    })

    /**
     * 
     */
    describe('#has', function () {
        /**
         * 
         */
        it('returns the result of the corresponding call of the parent sequence', function () {
            const sequence = mock<Sequence<number>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.hasInSubsequence.mockReturnValue(true)

            expect(sequence.hasInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.has(10)).toBeTruthy()
            expect(sequence.hasInSubsequence).toHaveBeenCalledWith(10, 3, 10)
        })

        /**
         * 
         */
        it('handles smaller parent sequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.hasInSubsequence.mockReturnValue(true)

            expect(sequence.hasInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.has(10)).toBeTruthy()
            expect(sequence.hasInSubsequence).toHaveBeenCalledWith(10, 3, 7)
        })

        /**
         * 
         */
        it('handles parent sequences that are too small', function () {
            const sequence = mock<Sequence<unknown>>({ size: 2 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.hasInSubsequence.mockReturnValue(false)

            expect(sequence.hasInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.has(10)).toBeFalsy()
            expect(sequence.hasInSubsequence).toHaveBeenCalledWith(10, 3, 0)
        })
    })

    /**
     * 
     */
    describe('#hasInSubsequence', function () {
        /**
         * 
         */
        it('returns the result of the corresponding call of the parent sequence', function () {
            const sequence = mock<Sequence<number>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.hasInSubsequence.mockReturnValue(true)

            expect(sequence.hasInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.hasInSubsequence(10, 1, 4)).toBeTruthy()
            expect(sequence.hasInSubsequence).toHaveBeenCalledWith(10, 4, 4)
        })

        /**
         * 
         */
        it('handles out of bound subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.hasInSubsequence.mockReturnValue(true)

            expect(subsequence.hasInSubsequence(10, 13, 18)).toBeFalsy()
        })

        /**
         * 
         */
        it('handles overlaping subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.hasInSubsequence.mockReturnValue(true)

            expect(sequence.hasInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.hasInSubsequence(10, 5, 10)).toBeTruthy()
            expect(sequence.hasInSubsequence).toHaveBeenCalledWith(10, 8, 5)
        })

        /**
         * 
         */
        it('handles subsequence of empty subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 3)

            sequence.hasInSubsequence.mockReturnValue(true)

            expect(subsequence.hasInSubsequence(10, 5, 10)).toBeFalsy()
        })

        /**
         * 
         */
        it('handles subsequence of incomplete subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.hasInSubsequence.mockReturnValue(true)
            
            expect(sequence.hasInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.hasInSubsequence(10, 2, 4)).toBeTruthy()
            expect(sequence.hasInSubsequence).toHaveBeenCalledWith(10, 5, 4)
        })

        /**
         * 
         */
        it('handles overlaping subsequence of incomplete subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.hasInSubsequence.mockReturnValue(true)
            
            expect(sequence.hasInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.hasInSubsequence(10, 5, 10)).toBeTruthy()
            expect(sequence.hasInSubsequence).toHaveBeenCalledWith(10, 8, 2)
        })

        /**
         * 
         */
        it('handles overlaping subsequence of incomplete subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.hasInSubsequence.mockReturnValue(true)
            
            expect(sequence.hasInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.hasInSubsequence(10, 5, 10)).toBeTruthy()
            expect(sequence.hasInSubsequence).toHaveBeenCalledWith(10, 8, 2)
        })

        /**
         * 
         */
        it('handles out of bound subsequence of incomplete subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.hasInSubsequence.mockReturnValue(true)
            
            expect(subsequence.hasInSubsequence(10, 12, 10)).toBeFalsy()
        })
    })

    /**
     * 
     */
    describe('#indexOfInSubsequence', function () {
        /**
         * 
         */
        it('returns the result of the corresponding call of the parent sequence', function () {
            const sequence = mock<Sequence<number>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.indexOfInSubsequence.mockReturnValue(3)

            expect(sequence.indexOfInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.indexOfInSubsequence(10, 1, 4)).toBe(3)
            expect(sequence.indexOfInSubsequence).toHaveBeenCalledWith(10, 4, 4)
        })

        /**
         * 
         */
        it('handles out of bound subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.indexOfInSubsequence.mockReturnValue(3)

            expect(subsequence.indexOfInSubsequence(10, 13, 18)).toBe(-1)
        })

        /**
         * 
         */
        it('handles overlaping subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.indexOfInSubsequence.mockReturnValue(3)

            expect(sequence.indexOfInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.indexOfInSubsequence(10, 5, 10)).toBe(3)
            expect(sequence.indexOfInSubsequence).toHaveBeenCalledWith(10, 8, 5)
        })

        /**
         * 
         */
        it('handles subsequence of empty subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 3)

            sequence.indexOfInSubsequence.mockReturnValue(3)

            expect(subsequence.indexOfInSubsequence(10, 5, 10)).toBe(-1)
        })

        /**
         * 
         */
        it('handles subsequence of incomplete subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.indexOfInSubsequence.mockReturnValue(3)
            
            expect(sequence.indexOfInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.indexOfInSubsequence(10, 2, 4)).toBe(3)
            expect(sequence.indexOfInSubsequence).toHaveBeenCalledWith(10, 5, 4)
        })

        /**
         * 
         */
        it('handles overlaping subsequence of incomplete subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.indexOfInSubsequence.mockReturnValue(1)
            
            expect(sequence.indexOfInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.indexOfInSubsequence(10, 5, 10)).toBe(1)
            expect(sequence.indexOfInSubsequence).toHaveBeenCalledWith(10, 8, 2)
        })

        /**
         * 
         */
        it('handles overlaping subsequence of incomplete subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.indexOfInSubsequence.mockReturnValue(1)
            
            expect(sequence.indexOfInSubsequence).not.toHaveBeenCalled()
            expect(subsequence.indexOfInSubsequence(10, 5, 10)).toBe(1)
            expect(sequence.indexOfInSubsequence).toHaveBeenCalledWith(10, 8, 2)
        })

        /**
         * 
         */
        it('handles out of bound subsequence of incomplete subsequence', function () {
            const sequence = mock<Sequence<unknown>>({ size: 10 })
            const subsequence = new Subsequence(sequence, 3, 13)

            sequence.indexOfInSubsequence.mockReturnValue(3)
            
            expect(subsequence.indexOfInSubsequence(10, 12, 10)).toBe(-1)
        })
    })

    /**
     * 
     */
    describe('#clone', function () {
        /**
         * 
         */
        it('returns a copy of the subsequence', function () {
            const sequence = mock<Sequence<number>>({ size: 25 })
            const subsequence = new Subsequence(sequence, 3, 13)
            const copy = subsequence.clone()

            expect(subsequence.equals(copy)).toBeTruthy()
            expect(subsequence).not.toBe(copy)
        })
    })
})