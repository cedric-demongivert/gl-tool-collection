import { mock } from 'jest-mock-extended'

import { ForwardCursorView } from '../../sources/cursor/ForwardCursorView'
import { createForwardCursorView } from '../../sources/cursor/ForwardCursorView'
import { ForwardCursor } from '../../sources/cursor/ForwardCursor'

/**
 * 
 */
describe('ForwardCursorView', function () {
    /**
     * 
     */
    describe('#constructor', function () {
        /**
         * 
         */
        it('returns a view over the given cursor', function () {
            const cursor = mock<ForwardCursor<number>>()
            const view = new ForwardCursorView(cursor)

            expect(view).toBeInstanceOf(ForwardCursorView)
            expect(view.hasCursor(cursor)).toBeTruthy()
        })
    })

    /**
     * 
     */
    describe('#hasCursor', function () {
        /**
         * 
         */
        it('returns true if the view wraps the given cursor', function () {
            const firstCursor = mock<ForwardCursor<number>>()
            const secondCursor = mock<ForwardCursor<number>>()

            const view: ForwardCursorView<number> = new ForwardCursorView(firstCursor)

            expect(view.hasCursor(firstCursor)).toBeTruthy()
            expect(view.hasCursor(secondCursor)).toBeFalsy()
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
            const cursor = mock<ForwardCursor<number>>()

            const view: ForwardCursorView<number> = new ForwardCursorView(cursor)
            const copy: ForwardCursorView<number> = view.clone()

            expect(view.equals(copy)).toBeTruthy()
            expect(view).not.toBe(copy)
        })
    })

    /**
     * 
     */
    describe('#forward', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<ForwardCursor<number>>()
            const view: ForwardCursorView<number> = new ForwardCursorView(cursor)

            expect(cursor.forward).not.toHaveBeenCalled()
            view.forward(5)
            expect(cursor.forward).toHaveBeenCalledTimes(1)
            expect(cursor.forward).toHaveBeenCalledWith(5)
        })
    })

    /**
     * 
     */
    describe('#next', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<ForwardCursor<number>>()
            const view: ForwardCursorView<number> = new ForwardCursorView(cursor)

            expect(cursor.next).not.toHaveBeenCalled()
            view.next()
            expect(cursor.next).toHaveBeenCalledTimes(1)
            expect(cursor.next).toHaveBeenCalledWith()
        })
    })

    /**
     * 
     */
    describe('#get', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<ForwardCursor<number>>()
            const view: ForwardCursorView<number> = new ForwardCursorView(cursor)

            cursor.get.mockReturnValueOnce(25)

            expect(cursor.get).not.toHaveBeenCalled()
            expect(view.get()).toBe(25)
            expect(cursor.get).toHaveBeenCalledTimes(1)
            expect(cursor.get).toHaveBeenCalledWith()
        })
    })

    /**
     * 
     */
    describe('#isEnd', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<ForwardCursor<number>>()
            const view: ForwardCursorView<number> = new ForwardCursorView(cursor)

            cursor.isEnd.mockReturnValueOnce(true)

            expect(cursor.isEnd).not.toHaveBeenCalled()
            expect(view.isEnd()).toBeTruthy()
            expect(cursor.isEnd).toHaveBeenCalledTimes(1)
            expect(cursor.isEnd).toHaveBeenCalledWith()
        })
    })

    /**
     * 
     */
    describe('#isInside', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<ForwardCursor<number>>()
            const view: ForwardCursorView<number> = new ForwardCursorView(cursor)

            cursor.isInside.mockReturnValueOnce(true)

            expect(cursor.isInside).not.toHaveBeenCalled()
            expect(view.isInside()).toBeTruthy()
            expect(cursor.isInside).toHaveBeenCalledTimes(1)
            expect(cursor.isInside).toHaveBeenCalledWith()
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
            const cursor = mock<ForwardCursor<number>>()
            const view: ForwardCursorView<number> = new ForwardCursorView(cursor)

            expect(view.view()).toBe(view)
        })
    })

    /**
     * 
     */
    describe('#setCursor', function () {
        /**
         * 
         */
        it('updates the underlying cursor implementation', function () {
            const firstCursor = mock<ForwardCursor<number>>()
            const secondCursor = mock<ForwardCursor<number>>()

            const view: ForwardCursorView<number> = new ForwardCursorView(firstCursor)

            expect(view.equals(new ForwardCursorView(firstCursor))).toBeTruthy()
            expect(view.equals(new ForwardCursorView(secondCursor))).toBeFalsy()

            view.setCursor(secondCursor)

            expect(view.equals(new ForwardCursorView(firstCursor))).toBeFalsy()
            expect(view.equals(new ForwardCursorView(secondCursor))).toBeTruthy()
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
            const cursor = mock<ForwardCursor<number>>()
            const view: ForwardCursorView<number> = new ForwardCursorView(cursor)

            expect(view.equals(new ForwardCursorView(cursor))).toBeTruthy()
        })

        /**
         * 
         */
        it('returns true if the given value is the same instance', function () {
            const cursor = mock<ForwardCursor<number>>()
            const view = new ForwardCursorView(cursor)

            expect(view.equals(view)).toBeTruthy()
        })

        /**
         * 
         */
        it('returns false if the given value is null or undefined', function () {
            const cursor = mock<ForwardCursor<number>>()
            const view = new ForwardCursorView(cursor)

            expect(view.equals(null)).toBeFalsy()
            expect(view.equals(undefined)).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the given value is not an instance of empty cursor', function () {
            const cursor = mock<ForwardCursor<number>>()
            const view = new ForwardCursorView(cursor)

            expect(view.equals(5)).toBeFalsy()
            expect(view.equals("test")).toBeFalsy()
            expect(view.equals(new Date())).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the given value is a view over another cursor', function () {
            const view = new ForwardCursorView(mock<ForwardCursor<number>>())
            const otherView = new ForwardCursorView(mock<ForwardCursor<number>>())

            expect(view.equals(otherView)).toBeFalsy()
        })
    })
})

/**
 * 
 */
describe('createForwardCursorView', function () {
    /**
     * 
     */
    it('returns a new view over the given cursor', function () {
        const cursor = mock<ForwardCursor<number>>()
        const view = createForwardCursorView(cursor)

        expect(view.hasCursor(cursor)).toBeTruthy()
    })
})