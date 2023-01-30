import { mock } from 'jest-mock-extended'

import { BidirectionalCursor } from '../../sources/cursor/BidirectionalCursor'

import { BidirectionalCursorView } from '../../sources/cursor/BidirectionalCursorView'
import { isBidirectionalCursorView } from '../../sources/cursor/BidirectionalCursorView'
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

    /**
     * 
     */
    describe('#equals', function () {
        /**
         * 
         */
        it('returns true if the given value is a view over the same cursor', function () {
            const cursor = mock<BidirectionalCursor<number>>()
            const view: BidirectionalCursorView<number> = new BidirectionalCursorView(cursor)

            expect(view.equals(new BidirectionalCursorView(cursor))).toBeTruthy()
        })

        /**
         * 
         */
        it('returns true if the given value is the same instance', function () {
            const cursor = mock<BidirectionalCursor<number>>()
            const view = new BidirectionalCursorView(cursor)

            expect(view.equals(view)).toBeTruthy()
        })

        /**
         * 
         */
        it('returns false if the given value is null or undefined', function () {
            const cursor = mock<BidirectionalCursor<number>>()
            const view = new BidirectionalCursorView(cursor)

            expect(view.equals(null)).toBeFalsy()
            expect(view.equals(undefined)).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the given value is not an instance of empty cursor', function () {
            const cursor = mock<BidirectionalCursor<number>>()
            const view = new BidirectionalCursorView(cursor)

            expect(view.equals(5)).toBeFalsy()
            expect(view.equals("test")).toBeFalsy()
            expect(view.equals(new Date())).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the given value is a view over another cursor', function () {
            const view = new BidirectionalCursorView(mock<BidirectionalCursor<number>>())
            const otherView = new BidirectionalCursorView(mock<BidirectionalCursor<number>>())

            expect(view.equals(otherView)).toBeFalsy()
        })
    })
})

/**
 * 
 */
describe('isBidirectionalCursorView', function () {
    /**
     * 
     */
    it('returns true if the given value is a direct instance of BidirectionalCursorView', function () {
        class Indirect extends BidirectionalCursorView<any> {}
        
        const cursor = mock<BidirectionalCursor<number>>()

        expect(isBidirectionalCursorView(new BidirectionalCursorView(cursor))).toBeTruthy()
        expect(isBidirectionalCursorView(new Indirect(cursor))).toBeFalsy()
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