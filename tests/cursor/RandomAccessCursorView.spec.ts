import { mock } from 'jest-mock-extended'

import { RandomAccessCursor } from '../../sources/cursor/RandomAccessCursor'

import { RandomAccessCursorView } from '../../sources/cursor/RandomAccessCursorView'
import { createRandomAccessCursorView } from '../../sources/cursor/RandomAccessCursorView'

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