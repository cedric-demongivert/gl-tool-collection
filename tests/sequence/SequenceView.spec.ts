import { mock } from 'jest-mock-extended'
import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { SequenceView } from "../../sources/sequence/SequenceView"
import { createSequenceView } from "../../sources/sequence/SequenceView"

import { Sequence } from "../../sources/sequence/Sequence"

/**
 * 
 */
describe('sequence/SequenceView', function () {
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
   
         const last = jest.fn().mockReturnValue(12)
         Object.defineProperty(sequence, 'last', { get: last })
   
         expect(last).not.toHaveBeenCalled()
         expect(view.last).toBe(12)
         expect(last).toHaveBeenCalled()
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
   
         const first = jest.fn().mockReturnValue(18)
         Object.defineProperty(sequence, 'first', { get: first })
   
         expect(first).not.toHaveBeenCalled()
         expect(view.first).toBe(18)
         expect(first).toHaveBeenCalled()
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
         expect(view.indexOf(6, 5, 32)).toBe(3)
         expect(sequence.indexOf).toHaveBeenCalledWith(6, 5, 32)
       })
       
       /**
         * 
         */
       it('delegates default parameters', function () {
        const sequence = mock<Sequence<number>>()
        const view = new SequenceView(sequence)
  
        const size = jest.fn().mockReturnValue(12)
        Object.defineProperty(sequence, 'size', { get: size })

        sequence.indexOf.mockReturnValue(5)
  
        expect(sequence.indexOf).not.toHaveBeenCalled()
        expect(view.indexOf(18)).toBe(5)
        expect(sequence.indexOf).toHaveBeenCalledWith(18, Comparator.compareWithOperator, 0, 12)
      })
    })


    /**
     * 
     */
    describe('#has', function () {
        /**
        * 
        */
        it('delegates the computation to the underlying implementation', function () {
            const sequence = mock<Sequence<number>>()
            const view = new SequenceView(sequence)
      
            sequence.has.mockReturnValue(true)
      
            expect(sequence.has).not.toHaveBeenCalled()
            expect(view.has(6, 5, 32)).toBe(true)
            expect(sequence.has).toHaveBeenCalledWith(6, 5, 32)
          })
          
          /**
            * 
            */
          it('delegates default parameters', function () {
           const sequence = mock<Sequence<number>>()
           const view = new SequenceView(sequence)
     
           const size = jest.fn().mockReturnValue(12)
           Object.defineProperty(sequence, 'size', { get: size })
   
           sequence.has.mockReturnValue(true)
     
           expect(sequence.has).not.toHaveBeenCalled()
           expect(view.has(18)).toBe(true)
           expect(sequence.has).toHaveBeenCalledWith(18, Comparator.compareWithOperator, 0, 12)
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
describe('sequence/createSequenceView', function () {
    /**
     * 
     */
    it('returns a new view over the requested sequence', function () {
        const sequence = mock<Sequence<number>>()
        const view = createSequenceView(sequence)

        expect(view).not.toBeNull()
        expect(view).toBeInstanceOf(SequenceView)
        expect(view.isOver(sequence)).toBeTruthy()
    })
})