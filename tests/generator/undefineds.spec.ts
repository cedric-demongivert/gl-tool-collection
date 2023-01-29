import { undefineds } from '../../sources/generator/undefineds'

/**
 * 
 */
describe('undefineds', function () {
    /**
     * 
     */
    it('returns the requested number of undefined values', function () {
        expect([...undefineds(5)]).toEqual([undefined, undefined, undefined, undefined, undefined])
        expect([...undefineds(2)]).toEqual([undefined, undefined])
        expect([...undefineds(0)]).toEqual([])
    })
})