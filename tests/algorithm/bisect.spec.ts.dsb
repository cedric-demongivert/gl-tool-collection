/** eslint-env jest */

import { Empty } from '@cedric-demongivert/gl-tool-utils'
import { ArrayPack } from '../../sources/sequence/ArrayPack'
import { bisect } from '../../sources/algorithm/bisect'

/**
 * 
 */
describe('bisect', function () {
  /**
   * 
   */
  it('searches for a given value in an ordered sequence', function () {
    const collection: ArrayPack<number> = ArrayPack.of(Empty.zero, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

    for (let index = 0; index < 10; ++index) {
      expect(bisect(collection, index)).toBe(index)
    }
  })

  /**
   * 
   */
  it('returns a negative index if the searched value is missing', function () {
    const collection: ArrayPack<number> = ArrayPack.of(Empty.zero, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19)

    for (let index = 0; index < 11; ++index) {
      expect(bisect(collection, index * 2)).toBeLessThan(0)
    }
  })

  /**
   * 
   */
  it('returns a valid insertion index if the searched value is missing', function () {
    const collection: ArrayPack<number> = ArrayPack.of(Empty.zero, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19)

    for (let index = 0; index < 11; ++index) {
      expect(bisect(collection, index * 2)).toBe(-1 - index)
    }
  })

  /**
   * 
   */
  describe('first', function () {
    /**
     * 
     */
    it('searches for a given value in an ordered sequence', function () {
      const collection: ArrayPack<number> = ArrayPack.of(Empty.zero, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

      for (let index = 0; index < 10; ++index) {
        expect(bisect.first(collection, index)).toBe(index)
      }
    })

    /**
     * 
     */
    it('returns a negative index if the searched value is missing', function () {
      const collection: ArrayPack<number> = ArrayPack.of(Empty.zero, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19)

      for (let index = 0; index < 11; ++index) {
        expect(bisect.first(collection, index * 2)).toBeLessThan(0)
      }
    })

    /**
     * 
     */
    it('returns a valid insertion index if the searched value is missing', function () {
      const collection: ArrayPack<number> = ArrayPack.of(Empty.zero, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19)

      for (let index = 0; index < 11; ++index) {
        expect(bisect.first(collection, index * 2)).toBe(-1 - index)
      }
    })

    /**
     * 
     */
    it('returns the index of the first apparition of a given value', function () {
      const collection: ArrayPack<number> = ArrayPack.of(Empty.zero, 0, 1, 2, 2, 2, 3, 4)

      expect(bisect.first(collection, 2)).toBe(2)
    })
  })

  /**
   * 
   */
  describe('#last', function () {
    /**
     * 
     */
    it('searches for a given value in an ordered sequence', function () {
      const collection: ArrayPack<number> = ArrayPack.of(Empty.zero, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

      for (let index = 0; index < 10; ++index) {
        expect(bisect.last(collection, index)).toBe(index)
      }
    })

    /**
     * 
     */
    it('returns a negative index if the searched value is missing', function () {
      const collection: ArrayPack<number> = ArrayPack.of(Empty.zero, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19)

      for (let index = 0; index < 11; ++index) {
        expect(bisect.last(collection, index * 2)).toBeLessThan(0)
      }
    })

    /**
     * 
     */
    it('returns a valid insertion index if the searched value is missing', function () {
      const collection: ArrayPack<number> = ArrayPack.of(Empty.zero, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19)

      for (let index = 0; index < 11; ++index) {
        expect(bisect.last(collection, index * 2)).toBe(-1 - index)
      }
    })

    /**
     * 
     */
    it('returns the last instance of a given value', function () {
      const collection: ArrayPack<number> = ArrayPack.of(Empty.zero, 0, 1, 2, 2, 2, 3, 4)

      expect(bisect.last(collection, 2)).toBe(4)
    })
  })
})
