import { range } from '../../sources/generator/range'

/**
 * 
 */
describe('generator/range', function () {
    /**
     * 
     */
    it('returns the requested range of values', function () {
        expect([...range(5)]).toEqual([0, 1, 2, 3, 4])
        expect([...range(2)]).toEqual([0, 1])
        expect([...range(0)]).toEqual([])
    })
    
    /**
     * 
     */
    it('returns the requested range of values using a given step size', function () {
        expect([...range(5, 2)]).toEqual([0, 2, 4])
        expect([...range(2, 2)]).toEqual([0])
        expect([...range(0, 2)]).toEqual([])
    })
    
    /**
     * 
     */
    it('returns the requested range of values using an offset', function () {
        expect([...range(5, 1, 2)]).toEqual([2, 3, 4])
        expect([...range(2, 1, 1)]).toEqual([1])
        expect([...range(0, 1, 2)]).toEqual([])
    })
    
    /**
     * 
     */
    it('iterates indefinitely by default', function () {
        let iterator = range()

        for (let index = 0; index < 100; ++index) {
            const result = iterator.next()
            expect(result.value).toBe(index)
            expect(result.done).toBeFalsy()
        }
    })
})