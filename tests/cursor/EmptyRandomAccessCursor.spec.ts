import { EmptyRandomAccessCursor } from '../../sources/cursor/EmptyRandomAccessCursor'
import { getEmptyRandomAccessCursor } from '../../sources/cursor/EmptyRandomAccessCursor'
import { EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE } from '../../sources/cursor/EmptyRandomAccessCursor'
import { getEmptyCursor } from '../../sources/cursor/EmptyRandomAccessCursor'
import { EMPTY_CURSOR_INSTANCE } from '../../sources/cursor/EmptyRandomAccessCursor'
import { getEmptyForwardCursor } from '../../sources/cursor/EmptyRandomAccessCursor'
import { EMPTY_FORWARD_CURSOR_INSTANCE } from '../../sources/cursor/EmptyRandomAccessCursor'
import { getEmptyBidirectionalCursor } from '../../sources/cursor/EmptyRandomAccessCursor'
import { EMPTY_BIDIRECTIONAL_CURSOR } from '../../sources/cursor/EmptyRandomAccessCursor'

/**
 * 
 */
describe('EmptyRandomAccessCursor', function () {
    /**
     * 
     */
    describe('#get', function () {
        /**
         * 
         */
        it('returns undefined', function () {
            expect(new EmptyRandomAccessCursor().get()).toBeUndefined()
        })
    })

    /**
     * 
     */
    describe('#clone', function () {
        /**
         * 
         */
        it('returns itself', function () {
            const cursor = new EmptyRandomAccessCursor()
            expect(cursor.clone()).toBe(cursor)
        })
    })

    /**
     * 
     */
    describe('#index', function () {
        /**
         * 
         */
        it('returns zero', function () {
            const cursor = new EmptyRandomAccessCursor()
            expect(cursor.index).toBe(0)
        })
    })

    /**
     * 
     */
    describe('#forward', function () {
        /**
         * 
         */
        it('does nothing', function () {
            const cursor = new EmptyRandomAccessCursor()

            expect(cursor.index).toBe(0)

            cursor.forward(5)

            expect(cursor.index).toBe(0)
        })
    })

    /**
     * 
     */
    describe('#next', function () {
        /**
         * 
         */
        it('does nothing', function () {
            const cursor = new EmptyRandomAccessCursor()

            expect(cursor.index).toBe(0)

            cursor.next()

            expect(cursor.index).toBe(0)
        })
    })

    /**
     * 
     */
    describe('#at', function () {
        /**
         * 
         */
        it('does nothing', function () {
            const cursor = new EmptyRandomAccessCursor()

            expect(cursor.index).toBe(0)

            cursor.at(15)

            expect(cursor.index).toBe(0)
        })
    })

    /**
     * 
     */
    describe('#backward', function () {
        /**
         * 
         */
        it('does nothing', function () {
            const cursor = new EmptyRandomAccessCursor()

            expect(cursor.index).toBe(0)

            cursor.backward(5)

            expect(cursor.index).toBe(0)
        })
    })

    /**
     * 
     */
    describe('#previous', function () {
        /**
         * 
         */
        it('does nothing', function () {
            const cursor = new EmptyRandomAccessCursor()

            expect(cursor.index).toBe(0)

            cursor.previous()

            expect(cursor.index).toBe(0)
        })
    })

    /**
     * 
     */
    describe('#isEnd', function () {
        /**
         * 
         */
        it('returns true', function () {
            const cursor = new EmptyRandomAccessCursor()

            expect(cursor.isEnd()).toBeTruthy()
        })
    })

    /**
     * 
     */
    describe('#isInside', function () {
        /**
         * 
         */
        it('returns false', function () {
            const cursor = new EmptyRandomAccessCursor()

            expect(cursor.isInside()).toBeFalsy()
        })
    })

    /**
     * 
     */
    describe('#isStart', function () {
        /**
         * 
         */
        it('returns true', function () {
            const cursor = new EmptyRandomAccessCursor()

            expect(cursor.isStart()).toBeTruthy()
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
            const cursor = new EmptyRandomAccessCursor()
            expect(cursor.view()).toBe(cursor)
        })
    })

    /**
     * 
     */
    describe('#equals', function () {
        /**
         * 
         */
        it('returns true if the given value is an empty cursor', function () {
            expect(new EmptyRandomAccessCursor().equals(new EmptyRandomAccessCursor())).toBeTruthy()
        })

        /**
         * 
         */
        it('returns true if the given value is the same instance', function () {
            const cursor = new EmptyRandomAccessCursor()
            expect(cursor.equals(cursor)).toBeTruthy()
        })

        /**
         * 
         */
        it('returns false if the given value is null or undefined', function () {
            const cursor = new EmptyRandomAccessCursor()
            expect(cursor.equals(null)).toBeFalsy()
            expect(cursor.equals(undefined)).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the given value is not an instance of empty cursor', function () {
            const cursor = new EmptyRandomAccessCursor()
            expect(cursor.equals(5)).toBeFalsy()
            expect(cursor.equals("test")).toBeFalsy()
            expect(cursor.equals(new Date())).toBeFalsy()
        })

        /**
         * 
         */
        it('returns false if the given value was not created by the same constructor', function () {
            class OtherEmptyCursor extends EmptyRandomAccessCursor<unknown> {}

            const cursor = new EmptyRandomAccessCursor()
            const otherCursor = new OtherEmptyCursor()

            expect(cursor.equals(otherCursor)).toBeFalsy()
            expect(cursor.equals(new EmptyRandomAccessCursor())).toBeTruthy()
            expect(otherCursor.equals(new OtherEmptyCursor())).toBeTruthy()
        })
    })
})

/**
 * 
 */
describe('getEmptyRandomAccessCursor', function () {
    /**
     * 
     */
    it('returns the singleton instance', function () {
        expect(getEmptyRandomAccessCursor()).toBe(EMPTY_RANDOM_ACCESS_CURSOR_INSTANCE)
    })
})

/**
 * 
 */
describe('getEmptyCursor', function () {
    /**
     * 
     */
    it('returns the singleton instance', function () {
        expect(getEmptyCursor()).toBe(EMPTY_CURSOR_INSTANCE)
    })
})

/**
 * 
 */
describe('getEmptyForwardCursor', function () {
    /**
     * 
     */
    it('returns the singleton instance', function () {
        expect(getEmptyForwardCursor()).toBe(EMPTY_FORWARD_CURSOR_INSTANCE)
    })
})

/**
 * 
 */
describe('getEmptyBidirectionalCursor', function () {
    /**
     * 
     */
    it('returns the singleton instance', function () {
        expect(getEmptyBidirectionalCursor()).toBe(EMPTY_BIDIRECTIONAL_CURSOR)
    })
})