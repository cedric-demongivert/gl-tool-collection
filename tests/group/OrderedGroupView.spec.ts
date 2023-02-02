import { mock } from 'jest-mock-extended'
import { OrderedGroup } from '../../sources/group/OrderedGroup'

import { OrderedGroupView } from '../../sources/group/OrderedGroupView'
import { createOrderedGroupView } from '../../sources/group/OrderedGroupView'

/**
 * 
 */
describe('group/OrderedGroupView', function () {
    /**
     * 
     */
    describe('#clone', function () {
        /**
         * 
         */
        it('returns a clone of the view', function () {
            const group = mock<OrderedGroup<unknown>>()
            const view = new OrderedGroupView(group)
            const copy = view.clone()

            expect(copy.equals(view)).toBeTruthy()
            expect(copy).not.toBe(view)
        })
    })
})

/**
 * 
 */
describe('group/createOrderedGroupView', function () {
    /**
     * 
     */
    it('returns a view over the given ordered group', function () {
        const group = mock<OrderedGroup<unknown>>()
        const view = createOrderedGroupView(group)

        expect(view.isOver(group)).toBeTruthy()
    })
})