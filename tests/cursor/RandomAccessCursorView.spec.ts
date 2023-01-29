import { mock } from 'jest-mock-extended'

import { RandomAccessCursorView } from '../../sources/cursor/RandomAccessCursorView'
import { createRandomAccessCursorView } from '../../sources/cursor/RandomAccessCursorView'
import { RandomAccessCursor } from '../../sources/cursor/RandomAccessCursor'

/**
 * 
 */
describe('RandomAccessCursorView', function () {
    /**
     * 
     */
    describe('#constructor', function () {
        /**
         * 
         */
        it('returns a view over the given cursor', function () {
            const cursor = mock<RandomAccessCursor<number>>()
            const view = new RandomAccessCursorView(cursor)

            expect(view).toBeInstanceOf(RandomAccessCursorView)
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
            const firstCursor = mock<RandomAccessCursor<number>>()
            const secondCursor = mock<RandomAccessCursor<number>>()

            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(firstCursor)

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
    describe('#forward', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<RandomAccessCursor<number>>()
            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)

            expect(cursor.forward).not.toHaveBeenCalled()
            view.forward(5)
            expect(cursor.forward).toHaveBeenCalledTimes(1)
            expect(cursor.forward).toHaveBeenCalledWith(5)
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
            const cursor = mock<RandomAccessCursor<number>>()
            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)

            expect(cursor.backward).not.toHaveBeenCalled()
            view.backward(5)
            expect(cursor.backward).toHaveBeenCalledTimes(1)
            expect(cursor.backward).toHaveBeenCalledWith(5)
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
            const cursor = mock<RandomAccessCursor<number>>()
            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)

            expect(cursor.next).not.toHaveBeenCalled()
            view.next()
            expect(cursor.next).toHaveBeenCalledTimes(1)
            expect(cursor.next).toHaveBeenCalledWith()
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
            const cursor = mock<RandomAccessCursor<number>>()
            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)

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
            const cursor = mock<RandomAccessCursor<number>>()
            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)

            expect(cursor.at).not.toHaveBeenCalled()
            view.at(8)
            expect(cursor.at).toHaveBeenCalledTimes(1)
            expect(cursor.at).toHaveBeenCalledWith(8)
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
            const cursor = mock<RandomAccessCursor<number>>()
            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)

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
            const cursor = mock<RandomAccessCursor<number>>()
            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)

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
            const cursor = mock<RandomAccessCursor<number>>()
            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)

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
    describe('#isStart', function () {
        /**
         * 
         */
        it('delegates the call to the underlying cursor', function () {
            const cursor = mock<RandomAccessCursor<number>>()
            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)

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
    describe('#view', function () {
        /**
         * 
         */
        it('returns itself', function () {
            const cursor = mock<RandomAccessCursor<number>>()
            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(cursor)

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
            const firstCursor = mock<RandomAccessCursor<number>>()
            const secondCursor = mock<RandomAccessCursor<number>>()

            const view: RandomAccessCursorView<number> = new RandomAccessCursorView(firstCursor)

            expect(view.equals(new RandomAccessCursorView(firstCursor))).toBeTruthy()
            expect(view.equals(new RandomAccessCursorView(secondCursor))).toBeFalsy()

            view.setCursor(secondCursor)

            expect(view.equals(new RandomAccessCursorView(firstCursor))).toBeFalsy()
            expect(view.equals(new RandomAccessCursorView(secondCursor))).toBeTruthy()
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