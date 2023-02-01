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
    describe('#index', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<ForwardCursor<number>>()
            const view: ForwardCursorView<number> = new ForwardCursorView(cursor)

            const cursorIndex = jest.fn().mockReturnValue(12)
            Object.defineProperty(cursor, 'index', { get: cursorIndex })

            expect(cursorIndex).not.toHaveBeenCalled()
            expect(view.index).toBe(12)
            expect(cursorIndex).toHaveBeenCalled()
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