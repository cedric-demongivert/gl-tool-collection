import { zeroes } from '../../sources/generator/zeroes'

/**
 * 
 */
describe('generator/zeroes', function () {
    /**
     * 
     */
    it('returns the requested number of zeroes', function () {
        expect([...zeroes(5)]).toEqual([0, 0, 0, 0, 0])
        expect([...zeroes(2)]).toEqual([0, 0])
        expect([...zeroes(0)]).toEqual([])
    })
})