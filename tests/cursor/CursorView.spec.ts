import { mock } from 'jest-mock-extended'

import { CursorView } from '../../sources/cursor/CursorView'
import { createCursorView } from '../../sources/cursor/CursorView'
import { Cursor } from '../../sources/cursor/Cursor'

/**
 * 
 */
describe('CursorView', function () {
    /**
     * 
     */
    describe('#constructor', function () {
        /**
         * 
         */
        it('returns a view over the given cursor', function () {
            const cursor = mock<Cursor<number>>()
            const view: CursorView<number> = new CursorView(cursor)

            expect(view).toBeInstanceOf(CursorView)
            expect(view.isOver(cursor)).toBeTruthy()
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
            const firstCursor = mock<Cursor<number>>()
            const secondCursor = mock<Cursor<number>>()

            const view: CursorView<number> = new CursorView(firstCursor)

            expect(view.isOver(firstCursor)).toBeTruthy()
            expect(view.isOver(secondCursor)).toBeFalsy()
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
            const cursor = mock<Cursor<number>>()

            const view: CursorView<number> = new CursorView(cursor)
            const copy: CursorView<number> = view.clone()

            expect(view.equals(copy)).toBeTruthy()
            expect(view).not.toBe(copy)
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
            const cursor = mock<Cursor<number>>()
            const view: CursorView<number> = new CursorView(cursor)

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
    describe('#view', function () {
        /**
         * 
         */
        it('returns itself', function () {
            const cursor = mock<Cursor<number>>()
            const view: CursorView<number> = new CursorView(cursor)

            expect(view.view()).toBe(view)
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
            const cursor = mock<Cursor<number>>()
            const view: CursorView<number> = new CursorView(cursor)

            expect(view.equals(new CursorView(cursor))).toBeTruthy()
        })

        /**
         * 
         */
        it('returns true if the given value is the same instance', function () {
            const cursor = mock<Cursor<number>>()
            const view = new CursorView(cursor)

            expect(view.equals(view)).toBeTruthy()
        })

        /**
         * 
         */
        it('returns false if the given value is null or undefined', function () {
            const cursor = mock<Cursor<number>>()
            const view = new CursorView(cursor)

            expect(view.equals(null)).toBeFalsy()
            expect(view.equals(undefined)).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the given value is not a view over a cursor', function () {
            const cursor = mock<Cursor<number>>()
            const view = new CursorView(cursor)

            expect(view.equals(5)).toBeFalsy()
            expect(view.equals("test")).toBeFalsy()
            expect(view.equals(new Date())).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the given value is a view over another cursor', function () {
            const view = new CursorView(mock<Cursor<number>>())
            const otherView = new CursorView(mock<Cursor<number>>())

            expect(view.equals(otherView)).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the given view was not created by the same constructor', function () {
            class OtherCursorView extends CursorView<unknown> {}

            const cursor = mock<Cursor<number>>()
            const view = new CursorView(cursor)
            const otherView = new OtherCursorView(cursor)

            expect(view.equals(otherView)).toBeFalsy()
            expect(view.equals(new CursorView(cursor))).toBeTruthy()
            expect(otherView.equals(new OtherCursorView(cursor))).toBeTruthy()
        })
    })
})

/**
 * 
 */
describe('createCursorView', function () {
    /**
     * 
     */
    it('returns a new view over the given cursor', function () {
        const cursor = mock<Cursor<number>>()
        const view = createCursorView(cursor)

        expect(view.isOver(cursor)).toBeTruthy()
    })
})