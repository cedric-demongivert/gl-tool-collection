import { nulls } from '../../sources/generator/nulls'

/**
 * 
 */
describe('nulls', function () {
    /**
     * 
     */
    it('returns the requested number of null values', function () {
        expect([...nulls(5)]).toEqual([null, null, null, null, null])
        expect([...nulls(2)]).toEqual([null, null])
        expect([...nulls(0)]).toEqual([])
    })
})