import { EMPTY_GROUP_INSTANCE } from '../../sources/group/EmptyGroup'
import { getEmptyGroup } from '../../sources/group/EmptyGroup'

/**
 * 
 */
describe('group/getEmptyGroup', function () {
    /**
     * 
     */
    it('returns the empty group instance', function () {
        expect(getEmptyGroup()).toBe(EMPTY_GROUP_INSTANCE)
    })
})