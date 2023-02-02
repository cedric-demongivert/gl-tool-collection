import { mock } from 'jest-mock-extended'

import { Sequence } from '../../sources/sequence/Sequence'
import { SequenceCursor } from '../../sources/sequence/SequenceCursor'
import { createSequenceCursor } from '../../sources/sequence/SequenceCursor'

/**
 * 
 */
describe('sequence/SequenceCursor', function () {
    /**
     * 
     */
    describe('#constructor', function () {
        /**
         * 
         */
        it('creates a cursor at the start of the requested sequence by default', function () {
            const sequence = mock<Sequence<unknown>>()
            const cursor = new SequenceCursor(sequence)

            expect(cursor.sequence).toBe(sequence)
            expect(cursor.index).toBe(0)
        })

        /**
         * 
         */
        it('allows to specify the starting index', function () {
            const sequence = mock<Sequence<unknown>>()
            const cursor = new SequenceCursor(sequence, 15)

            expect(cursor.sequence).toBe(sequence)
            expect(cursor.index).toBe(15)
        })
    })

    /**
     * 
     */
    describe('#isInside', function () {
        /**
         * 
         */
        it('returns false if the index of the cursor is negative', function () {
            const sequence = mock<Sequence<unknown>>()
            Object.defineProperty(sequence, 'size', { get() { return 15 } })

            expect(new SequenceCursor(sequence, -5).isInside()).toBeFalsy()
            expect(new SequenceCursor(sequence, -1).isInside()).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the index of the cursor is greather or equal to the underlying sequence size', function () {
            const sequence = mock<Sequence<unknown>>()
            Object.defineProperty(sequence, 'size', { get() { return 15 } })

            expect(new SequenceCursor(sequence, 15).isInside()).toBeFalsy()
            expect(new SequenceCursor(sequence, 16).isInside()).toBeFalsy()
        })

        /**
         * 
         */
        it('returns true if the cursor is over an element of the underlying sequence', function () {
            const sequence = mock<Sequence<unknown>>()
            Object.defineProperty(sequence, 'size', { get() { return 15 } })

            expect(new SequenceCursor(sequence, 0).isInside()).toBeTruthy()
            expect(new SequenceCursor(sequence, 7).isInside()).toBeTruthy()
            expect(new SequenceCursor(sequence, 14).isInside()).toBeTruthy()
        })
    })

    /**
     * 
     */
    describe('#isEnd', function () {
        /**
         * 
         */
        it('returns false if the cursor is not at the end of the underlying sequence', function () {
            const sequence = mock<Sequence<unknown>>()
            Object.defineProperty(sequence, 'size', { get() { return 15 } })

            expect(new SequenceCursor(sequence, -5).isEnd()).toBeFalsy()
            expect(new SequenceCursor(sequence, 14).isEnd()).toBeFalsy()
            expect(new SequenceCursor(sequence, 7).isEnd()).toBeFalsy()
        })

        /**
         * 
         */
        it('returns true if the cursor is at the end, or after the end, of the underlying sequence', function () {
            const sequence = mock<Sequence<unknown>>()
            Object.defineProperty(sequence, 'size', { get() { return 15 } })

            expect(new SequenceCursor(sequence, 15).isEnd()).toBeTruthy()
            expect(new SequenceCursor(sequence, 16).isEnd()).toBeTruthy()
        })
    })

    /**
     * 
     */
    describe('#isStart', function () {
        /**
         * 
         */
        it('returns false if the cursor is not at the start of the underlying sequence', function () {
            const sequence = mock<Sequence<unknown>>()
            Object.defineProperty(sequence, 'size', { get() { return 15 } })

            expect(new SequenceCursor(sequence, 1).isStart()).toBeFalsy()
            expect(new SequenceCursor(sequence, 5).isStart()).toBeFalsy()
            expect(new SequenceCursor(sequence, 8).isStart()).toBeFalsy()
        })

        /**
         * 
         */
        it('returns true if the cursor is at the start, or before the start, of the underlying sequence', function () {
            const sequence = mock<Sequence<unknown>>()
            Object.defineProperty(sequence, 'size', { get() { return 15 } })

            expect(new SequenceCursor(sequence, 0).isStart()).toBeTruthy()
            expect(new SequenceCursor(sequence, -5).isStart()).toBeTruthy()
        })
    })

    /**
     * 
     */
    describe('#next', function () {
       /**
         * 
         */
        it('moves the cursor to the next available element', function () {
            const sequence = mock<Sequence<unknown>>()
            const cursor = new SequenceCursor(sequence)

            expect(cursor.index).toBe(0)

            for(let index = 1; index < 18; ++index) {
                cursor.next()
                expect(cursor.index).toBe(index)
            }
        })
    })

    /**
     * 
     */
    describe('#forward', function () {
       /**
         * 
         */
        it('moves the cursor forward', function () {
            const sequence = mock<Sequence<unknown>>()
            const cursor = new SequenceCursor(sequence)

            expect(cursor.index).toBe(0)
            cursor.forward(5)
            expect(cursor.index).toBe(5)
            cursor.forward(3)
            expect(cursor.index).toBe(8)
        })
    })

    /**
     * 
     */
    describe('#previous', function () {
       /**
         * 
         */
        it('moves the cursor to the previous element', function () {
            const sequence = mock<Sequence<unknown>>()
            const cursor = new SequenceCursor(sequence, 6)

            expect(cursor.index).toBe(6)

            for(let index = 1; index < 10; ++index) {
                cursor.previous()
                expect(cursor.index).toBe(6 - index)
            }
        })
    })

    /**
     * 
     */
    describe('#backward', function () {
       /**
         * 
         */
        it('moves the cursor backward', function () {
            const sequence = mock<Sequence<unknown>>()
            const cursor = new SequenceCursor(sequence, 8)

            expect(cursor.index).toBe(8)
            cursor.backward(5)
            expect(cursor.index).toBe(3)
            cursor.backward(4)
            expect(cursor.index).toBe(-1)
        })
    })

    /**
     * 
     */
    describe('#get', function () {
       /**
         * 
         */
        it('returns the value at the cursor location', function () {
            const sequence = mock<Sequence<number>>()
            const cursor = new SequenceCursor(sequence, 8)

            sequence.get.mockReturnValue(28)

            expect(sequence.get).not.toHaveBeenCalled()
            expect(cursor.get()).toBe(28)
            expect(sequence.get).toHaveBeenCalled()
            expect(sequence.get).toHaveBeenCalledWith(cursor.index)
        })
    })

    /**
     * 
     */
    describe('#at', function () {
       /**
         * 
         */
        it('moves the cursor to the requested location', function () {
            const sequence = mock<Sequence<unknown>>()
            const cursor = new SequenceCursor(sequence, 8)

            expect(cursor.index).toBe(8)
            cursor.at(5)
            expect(cursor.index).toBe(5)
            cursor.at(4)
            expect(cursor.index).toBe(4)
        })
    })

    /**
     * 
     */
    describe('#copy', function () {
       /**
         * 
         */
        it('copies the given cursor', function () {
            const firstSequence = mock<Sequence<unknown>>()
            const secondSequence = mock<Sequence<unknown>>()
            const firstCursor = new SequenceCursor(firstSequence, 8)
            const secondCursor = new SequenceCursor(secondSequence, 3)

            expect(firstCursor.equals(secondCursor)).toBeFalsy()
            secondCursor.copy(firstCursor)
            expect(firstCursor.equals(secondCursor)).toBeTruthy()
        })
    })

    /**
     * 
     */
    describe('#clone', function () {
       /**
         * 
         */
        it('returns a copy of the given cursor', function () {
            const sequence = mock<Sequence<unknown>>()
            const cursor = new SequenceCursor(sequence, 8)
            const copy = cursor.clone()

            expect(cursor.equals(copy)).toBeTruthy()
            expect(cursor).not.toBe(copy)
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
            const sequence = mock<Sequence<unknown>>()
            const cursor = new SequenceCursor(sequence, 8)

            expect(cursor.view()).toBe(cursor)
        })
    })

    /**
     * 
     */
    describe('#set', function () {
       /**
         * 
         */
        it('updates the cursor inner state', function () {
            const firstSequence = mock<Sequence<unknown>>()
            const secondSequence = mock<Sequence<unknown>>()
            const firstCursor = new SequenceCursor(firstSequence, 8)
            const secondCursor = new SequenceCursor(secondSequence, 3)

            expect(firstCursor.equals(secondCursor)).toBeFalsy()
            secondCursor.set(firstSequence, firstCursor.index)
            expect(firstCursor.equals(secondCursor)).toBeTruthy()
        })
    })

    /**
     * 
     */
    describe('#equals', function () {
      /**
        * 
        */
      it('returns true if the given instance is an equivalent cursor', function () {
        const sequence = mock<Sequence<unknown>>()
        const cursor = new SequenceCursor(sequence, 8)

        expect(cursor.equals(new SequenceCursor(sequence, 8))).toBeTruthy()
      })
      
      /**
       * 
       */
      it('returns true when applied on itself', function () {
        const sequence = mock<Sequence<unknown>>()
        const cursor = new SequenceCursor(sequence, 8)

        expect(cursor.equals(cursor)).toBeTruthy()
      })
      
      /**
       * 
       */
      it('returns false for null', function () {
        const sequence = mock<Sequence<unknown>>()
        const cursor = new SequenceCursor(sequence, 8)
      
        expect(cursor.equals(null)).toBeFalsy()
      })
      
      /**
       * 
       */
      it('returns false for undefined', function () {
        const sequence = mock<Sequence<unknown>>()
        const cursor = new SequenceCursor(sequence, 8)
          
        expect(cursor.equals(undefined)).toBeFalsy()
      })
      
      /**
       * 
       */
      it('returns false for instances of other type', function () {
        const sequence = mock<Sequence<unknown>>()
        const cursor = new SequenceCursor(sequence, 8)
          
        expect(cursor.equals(new Date())).toBeFalsy()
        expect(cursor.equals(15)).toBeFalsy()
        expect(cursor.equals("test")).toBeFalsy()
      })
      
      /**
       * 
       */
      it('returns false for a cursor over another collection', function () {
        const firstSequence = mock<Sequence<unknown>>()
        const firstCursor = new SequenceCursor(firstSequence, 8)

        const secondSequence = mock<Sequence<unknown>>()
        const secondCursor = new SequenceCursor(secondSequence, 8)
          
        expect(firstCursor.equals(secondCursor)).toBeFalsy()
      })
      
      /**
       * 
       */
      it('returns false for a cursor at another index', function () {
        const sequence = mock<Sequence<unknown>>()
        const firstCursor = new SequenceCursor(sequence, 8)
        const secondCursor = new SequenceCursor(sequence, 3)
          
        expect(firstCursor.equals(secondCursor)).toBeFalsy()
      })
      
      /**
       * 
       */
      it('returns false if the given cursor was not created by the same constructor', function () {
        class OtherSequenceCursor extends SequenceCursor<unknown> {}

        const sequence = mock<Sequence<unknown>>()
        const firstCursor = new SequenceCursor(sequence, 8)
        const secondCursor = new OtherSequenceCursor(sequence, 8)
          
        expect(firstCursor.equals(secondCursor)).toBeFalsy()
        expect(firstCursor.equals(new SequenceCursor(sequence, 8))).toBeTruthy()
        expect(secondCursor.equals(new OtherSequenceCursor(sequence, 8))).toBeTruthy()
      })
    })
})

/**
     * 
     */
describe('sequence/createSequenceCursor', function () {
  /**
   * 
   */
  it('creates a cursor at the start of the requested sequence by default', function () {
      const sequence = mock<Sequence<unknown>>()
      const cursor = createSequenceCursor(sequence)

      expect(cursor.sequence).toBe(sequence)
      expect(cursor.index).toBe(0)
  })

  /**
   * 
   */
  it('allows to specify the starting index', function () {
      const sequence = mock<Sequence<unknown>>()
      const cursor = createSequenceCursor(sequence, 15)

      expect(cursor.sequence).toBe(sequence)
      expect(cursor.index).toBe(15)
  })
})