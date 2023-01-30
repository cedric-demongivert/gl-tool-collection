import { mock } from 'jest-mock-extended'

import { SequenceView } from "../../sources/sequence/SequenceView"
import { createSequenceView } from "../../sources/sequence/SequenceView"
import { isSequenceView } from "../../sources/sequence/SequenceView"

import { Sequence } from "../../sources/sequence/Sequence"

/**
 * 
 */
describe('SequenceView', function () {
    /**
     * 
     */
    describe('#get', function () {
        /**
        * 
        */
        it('delegates the computation to the underlying implementation', function () {
         const sequence = mock<Sequence<number>>()
         const view = new SequenceView(sequence)
   
         sequence.get.mockReturnValue(15)
   
         expect(sequence.get).not.toHaveBeenCalled()
         expect(view.get(23)).toBe(15)
         expect(sequence.get).toHaveBeenCalledTimes(1)
         expect(sequence.get).toHaveBeenCalledWith(23)
       })
    })

    /**
     * 
     */
    describe('#last', function () {
        /**
        * 
        */
        it('delegates the computation to the underlying implementation', function () {
         const sequence = mock<Sequence<number>>()
         const view = new SequenceView(sequence)
   
         const last = jest.spyOn(sequence, 'last', 'get')
         last.mockReturnValue(12)
   
         expect(last).not.toHaveBeenCalled()
         expect(view.last).toBe(12)
         expect(last).toHaveBeenCalledTimes(1)
       })
    })

    /**
     * 
     */
    describe('#first', function () {
        /**
        * 
        */
        it('delegates the computation to the underlying implementation', function () {
         const sequence = mock<Sequence<number>>()
         const view = new SequenceView(sequence)
   
         const first = jest.spyOn(sequence, 'first', 'get')
         first.mockReturnValue(12)
   
         expect(first).not.toHaveBeenCalled()
         expect(view.first).toBe(12)
         expect(first).toHaveBeenCalledTimes(1)
       })
    })

    /**
     * 
     */
    describe('#indexOf', function () {
        /**
        * 
        */
        it('delegates the computation to the underlying implementation', function () {
         const sequence = mock<Sequence<number>>()
         const view = new SequenceView(sequence)
   
         sequence.indexOf.mockReturnValue(3)
   
         expect(sequence.indexOf).not.toHaveBeenCalled()
         expect(view.indexOf(6)).toBe(3)
         expect(sequence.indexOf).toHaveBeenCalledTimes(1)
         expect(sequence.indexOf).toHaveBeenCalledWith(6)
       })
    })

    /**
     * 
     */
    describe('#indexOfInSubsequence', function () {
        /**
        * 
        */
        it('delegates the computation to the underlying implementation', function () {
         const sequence = mock<Sequence<number>>()
         const view = new SequenceView(sequence)
   
         sequence.indexOfInSubsequence.mockReturnValue(5)
   
         expect(sequence.indexOfInSubsequence).not.toHaveBeenCalled()
         expect(view.indexOfInSubsequence(18, 0, 9)).toBe(5)
         expect(sequence.indexOfInSubsequence).toHaveBeenCalledTimes(1)
         expect(sequence.indexOfInSubsequence).toHaveBeenCalledWith(18, 0, 9)
       })
    })

    /**
     * 
     */
    describe('#hasInSubsequence', function () {
        /**
        * 
        */
        it('delegates the computation to the underlying implementation', function () {
            const sequence = mock<Sequence<number>>()
            const view = new SequenceView(sequence)
      
            sequence.hasInSubsequence.mockReturnValue(true)
      
            expect(sequence.hasInSubsequence).not.toHaveBeenCalled()
            expect(view.hasInSubsequence(18, 0, 9)).toBeTruthy()
            expect(sequence.hasInSubsequence).toHaveBeenCalledTimes(1)
            expect(sequence.hasInSubsequence).toHaveBeenCalledWith(18, 0, 9)
        })
    })

    /**
     * 
     */
    describe('#equals', function () {
        /**
         * 
         */
        it('returns true if the given instance is a view over the same sequence', function () {
            const sequence = mock<Sequence<number>>()
            const view = new SequenceView(sequence)

            expect(view.equals(new SequenceView(sequence))).toBeTruthy()
        })
        
        /**
         * 
         */
        it('returns true when applied on itself', function () {
            const sequence = mock<Sequence<number>>()
            const view = new SequenceView(sequence)
            expect(view.equals(view)).toBeTruthy()
        })
        
        /**
         * 
         */
        it('returns false for null', function () {
            const sequence = mock<Sequence<number>>()
            const view = new SequenceView(sequence)
            expect(view.equals(null)).toBeFalsy()
        })
        
        /**
         * 
         */
        it('returns false for undefined', function () {
            const sequence = mock<Sequence<number>>()
            const view = new SequenceView(sequence)
            expect(view.equals(undefined)).toBeFalsy()
        })
        
        /**
         * 
         */
        it('returns false for instances of other type', function () {
            const sequence = mock<Sequence<number>>()
            const view = new SequenceView(sequence)

            expect(view.equals(new Date())).toBeFalsy()
            expect(view.equals(15)).toBeFalsy()
            expect(view.equals("test")).toBeFalsy()
        })
        
        /**
         * 
         */
        it('returns false for a view over another sequence', function () {
            const firstSequence = mock<Sequence<number>>()
            const secondSequence = mock<Sequence<number>>()
            const firstView = new SequenceView(firstSequence)
            const secondView = new SequenceView(secondSequence)

            expect(firstView.equals(secondView)).toBeFalsy()
        })
    })

    /**
     * 
     */
    describe('#clone', function () {
      /**
       * 
       */
      it('returns a copy of the view', function () {
        const sequence = mock<Sequence<number>>()
        const view = new SequenceView(sequence)
        const copy = view.clone()
    
        expect(copy.equals(view)).toBeTruthy()
        expect(copy === view).toBeFalsy()
      })
    })
})

/**
 * 
 */
describe('isSequenceView', function () {
    /**
     * 
     */
    it('returns true if the given value is a direct instance of SequenceView', function () {
        class Indirect extends SequenceView<unknown> { }
        const sequence = mock<Sequence<unknown>>()

        expect(isSequenceView(new SequenceView(sequence))).toBeTruthy()
        expect(isSequenceView(new Indirect(sequence))).toBeFalsy()
    })
})

/**
 * 
 */
describe('createSequenceView', function () {
    /**
     * 
     */
    it('returns a new view over the requested sequence', function () {
        const sequence = mock<Sequence<number>>()
        const view = createSequenceView(sequence)

        expect(view).not.toBeNull()
        expect(isSequenceView(view)).toBeTruthy()
        expect(view.hasCollection(sequence)).toBeTruthy()
    })
})