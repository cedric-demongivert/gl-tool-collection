/** eslint-env jest */

import { Empty } from '@cedric-demongivert/gl-tool-utils'
import { createArrayPackFromValues } from '../../sources/pack/ArrayPack'
import { bisect } from '../../sources/algorithm/bisect'

/**
 * 
 */
describe('algorithm/bisect', function () {
  /**
   * 
   */
  it('binary search an element in an ordered sequence and returns its location', function () {
    const collection = createArrayPackFromValues(Empty.zero, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

    for (let index = 0; index < 10; ++index) {
      expect(bisect(collection, index)).toBe(index)
    }
  })

  /**
   * 
   */
  it('return the insertion index of an element in the form of the negative number : (-insertionIndex -1) if the given element does not exist in the sequence.', function () {
    const collection = createArrayPackFromValues(Empty.zero, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19)

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
    it('returns the first element of the sequence that matches the given value', function () {
      const collection = createArrayPackFromValues(Empty.zero, 0, 1, 2, 3, 4, 5, 5, 5, 6, 7, 8, 9)

      expect(bisect.first(collection, 4)).toBe(4)
      expect(bisect.first(collection, 5)).toBe(5)
    })
  })

  /**
   * 
   */
  describe('#last', function () {
    /**
     * 
     */
    it('returns the last element of the parent sequence that matches the given value', function () {
      const collection = createArrayPackFromValues(Empty.zero, 0, 1, 2, 3, 4, 5, 5, 5, 6, 7, 8, 9)

      expect(bisect.last(collection, 4)).toBe(4)
      expect(bisect.last(collection, 5)).toBe(7)
    })
  })

  /**
   * 
   */
  describe('#invert', function () {
    /**
     * 
     */
    it('uses an invertion of the given comparator', function () {
      const collection = createArrayPackFromValues(Empty.zero, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0)

      for (let index = 0; index < 10; ++index) {
        expect(bisect.invert(collection, index)).toBe(9 - index)
      }
    })
  })
})
