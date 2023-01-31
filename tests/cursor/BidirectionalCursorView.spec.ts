import { mock } from 'jest-mock-extended'

import { BidirectionalCursor } from '../../sources/cursor/BidirectionalCursor'

import { BidirectionalCursorView } from '../../sources/cursor/BidirectionalCursorView'
import { createBidirectionalCursorView } from '../../sources/cursor/BidirectionalCursorView'

/**
 * 
 */
describe('BidirectionalCursorView', function () {
    /**
     * 
     */
    describe('#clone', function () {
        /**
         * 
         */
        it('returns a copy of the view', function () {
            const cursor = mock<BidirectionalCursor<number>>()

            const view: BidirectionalCursorView<number> = new BidirectionalCursorView(cursor)
            const copy: BidirectionalCursorView<number> = view.clone()

            expect(view.equals(copy)).toBeTruthy()
            expect(view).not.toBe(copy)
        })
    })

    /**
     * 
     */
    describe('#backward', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<BidirectionalCursor<number>>()
            const view: BidirectionalCursorView<number> = new BidirectionalCursorView(cursor)

            expect(cursor.backward).not.toHaveBeenCalled()
            view.backward(5)
            expect(cursor.backward).toHaveBeenCalledTimes(1)
            expect(cursor.backward).toHaveBeenCalledWith(5)
        })
    })

    /**
     * 
     */
    describe('#previous', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<BidirectionalCursor<number>>()
            const view: BidirectionalCursorView<number> = new BidirectionalCursorView(cursor)

            expect(cursor.previous).not.toHaveBeenCalled()
            view.previous()
            expect(cursor.previous).toHaveBeenCalledTimes(1)
            expect(cursor.previous).toHaveBeenCalledWith()
        })
    })

    /**
     * 
     */
    describe('#at', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<BidirectionalCursor<number>>()
            const view: BidirectionalCursorView<number> = new BidirectionalCursorView(cursor)

            expect(cursor.at).not.toHaveBeenCalled()
            view.at(8)
            expect(cursor.at).toHaveBeenCalledTimes(1)
            expect(cursor.at).toHaveBeenCalledWith(8)
        })
    })

    /**
     * 
     */
    describe('#isStart', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<BidirectionalCursor<number>>()
            const view: BidirectionalCursorView<number> = new BidirectionalCursorView(cursor)

            cursor.isEnd.mockReturnValueOnce(true)

            expect(cursor.isStart).not.toHaveBeenCalled()
            expect(view.isStart()).toBeTruthy()
            expect(cursor.isStart).toHaveBeenCalledTimes(1)
            expect(cursor.isStart).toHaveBeenCalledWith()
        })
    })
})

/**
 * 
 */
describe('createBidirectionalCursorView', function () {
    /**
     * 
     */
    it('returns a new view over the given cursor', function () {
        const cursor = mock<BidirectionalCursor<number>>()
        const view = createBidirectionalCursorView(cursor)

        expect(view.hasCursor(cursor)).toBeTruthy()
    })
})