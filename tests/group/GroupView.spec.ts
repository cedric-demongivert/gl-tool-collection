import { mock } from 'jest-mock-extended'
import { Group } from '../../sources/group/Group'

import { GroupView } from '../../sources/group/GroupView'
import { createGroupView } from '../../sources/group/GroupView'

/**
 * 
 */
describe('group/GroupView', function () {
    /**
     * 
     */
    describe('#clone', function () {
        /**
         * 
         */
        it('returns a clone of the view', function () {
            const group = mock<Group<unknown>>()
            const view = new GroupView(group)
            const copy = view.clone()

            expect(copy.equals(view)).toBeTruthy()
            expect(copy).not.toBe(view)
        })
    })
})

/**
 * 
 */
describe('group/createGroupView', function () {
    /**
     * 
     */
    it('returns a view over the given group', function () {
        const group = mock<Group<unknown>>()
        const view = createGroupView(group)

        expect(view.isOver(group)).toBeTruthy()
    })
})