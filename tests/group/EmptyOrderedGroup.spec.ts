import { EMPTY_ORDERED_GROUP_INSTANCE } from '../../sources/group/EmptyOrderedGroup'
import { getEmptyOrderedGroup } from '../../sources/group/EmptyOrderedGroup'

/**
 * 
 */
describe('group/getEmptyOrderedGroup', function () {
    /**
     * 
     */
    it('returns the empty ordered group instance', function () {
        expect(getEmptyOrderedGroup()).toBe(EMPTY_ORDERED_GROUP_INSTANCE)
    })
})