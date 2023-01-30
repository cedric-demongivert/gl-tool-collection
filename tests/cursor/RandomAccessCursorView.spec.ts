import { mock } from 'jest-mock-extended'

import { RandomAccessCursor } from '../../sources/cursor/RandomAccessCursor'

import { RandomAccessCursorView } from '../../sources/cursor/RandomAccessCursorView'
import { createRandomAccessCursorView } from '../../sources/cursor/RandomAccessCursorView'
import { isRandomAccessCursorView } from '../../sources/cursor/RandomAccessCursorView'

/**
 * 
 */
describe('RandomAccessCursorView', function () {
    /**
     * 
     */
    describe('#clone', function () {
        /**
         * 
         */
        it('returns a copy of the view', function () {
            const cursor = mock<RandomAccessCursor<number>>()

            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)
            const copy: RandomAccessCursorView<number> = view.clone()

            expect(view.equals(copy)).toBeTruthy()
            expect(view).not.toBe(copy)
        })
    })

    /**
     * 
     */
    describe('#equals', function () {
        /**
         * 
         */
        it('returns true if the given value is a view over the same cursor', function () {
            const cursor = mock<RandomAccessCursor<number>>()
            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)

            expect(view.equals(new RandomAccessCursorView(cursor))).toBeTruthy()
        })

        /**
         * 
         */
        it('returns true if the given value is the same instance', function () {
            const cursor = mock<RandomAccessCursor<number>>()
            const view = new RandomAccessCursorView(cursor)

            expect(view.equals(view)).toBeTruthy()
        })

        /**
         * 
         */
        it('returns false if the given value is null or undefined', function () {
            const cursor = mock<RandomAccessCursor<number>>()
            const view = new RandomAccessCursorView(cursor)

            expect(view.equals(null)).toBeFalsy()
            expect(view.equals(undefined)).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the given value is not an instance of empty cursor', function () {
            const cursor = mock<RandomAccessCursor<number>>()
            const view = new RandomAccessCursorView(cursor)

            expect(view.equals(5)).toBeFalsy()
            expect(view.equals("test")).toBeFalsy()
            expect(view.equals(new Date())).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the given value is a view over another cursor', function () {
            const view = new RandomAccessCursorView(mock<RandomAccessCursor<number>>())
            const otherView = new RandomAccessCursorView(mock<RandomAccessCursor<number>>())

            expect(view.equals(otherView)).toBeFalsy()
        })
    })
})

/**
 * 
 */
describe('isRandomAccessCursorView', function () {
    /**
     * 
     */
    it('returns true if the given value is a direct instance of BidirectionalCursorView', function () {
        class Indirect extends RandomAccessCursorView<any> {}
        
        const cursor = mock<RandomAccessCursor<number>>()

        expect(isRandomAccessCursorView(new RandomAccessCursorView(cursor))).toBeTruthy()
        expect(isRandomAccessCursorView(new Indirect(cursor))).toBeFalsy()
    })
})

/**
 * 
 */
describe('createRandomAccessCursorView', function () {
    /**
     * 
     */
    it('returns a new view over the given cursor', function () {
        const cursor = mock<RandomAccessCursor<number>>()
        const view = createRandomAccessCursorView(cursor)

        expect(view.hasCursor(cursor)).toBeTruthy()
    })
})