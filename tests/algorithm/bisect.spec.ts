/** eslint-env jest */

import { ArrayPack } from '../../src/pack/ArrayPack'
import { bisect } from '../../src/algorithm/bisect'

describe('#bisect', function () {
  it('binary search a collection for a given value', function () {
    const collection: ArrayPack<number> = ArrayPack.wrap([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    for (let index = 0; index <= 10; ++index) {
      expect(bisect(collection, index)).toBe(index)
    }
  })

  it('return a negative insertion index if the value is missing', function () {
    const collection: ArrayPack<number> = ArrayPack.wrap([0, 5, 6, 8, 10, 11, 12, 13, 15, 17])

    expect(bisect(collection, -5)).toBe(- (0 + 1))
    expect(bisect(collection, 2)).toBe(- (1 + 1))
    expect(bisect(collection, 14)).toBe(- (8 + 1))
    expect(bisect(collection, 16)).toBe(- (9 + 1))
    expect(bisect(collection, 35)).toBe(- (10 + 1))
  })

  describe('#first', function () {
    it('binary search a collection for the first instance of a given value', function () {
      const collection: ArrayPack<number> = ArrayPack.wrap([0, 1, 2, 3, 4, 5, 5, 5, 6, 7, 8, 9, 10])

      for (let index = 0; index < 5; ++index) {
        expect(bisect.first(collection, index)).toBe(index)
      }

      expect(bisect.first(collection, 5)).toBe(5)

      for (let index = 6; index <= 10; ++index) {
        expect(bisect.first(collection, index)).toBe(index + 2)
      }
    })

    it('return a negative insertion index if the value is missing', function () {
      const collection: ArrayPack<number> = ArrayPack.wrap([0, 5, 6, 8, 10, 11, 12, 13, 15, 17])

      expect(bisect.first(collection, -5)).toBe(- (0 + 1))
      expect(bisect.first(collection, 2)).toBe(- (1 + 1))
      expect(bisect.first(collection, 14)).toBe(- (8 + 1))
      expect(bisect.first(collection, 16)).toBe(- (9 + 1))
      expect(bisect.first(collection, 35)).toBe(- (10 + 1))
    })
  })

  describe('#last', function () {
    it('binary search a collection for the last instance of a given value', function () {
      const collection: ArrayPack<number> = ArrayPack.wrap([0, 1, 2, 3, 4, 5, 5, 5, 6, 7, 8, 9, 10])

      for (let index = 0; index < 5; ++index) {
        expect(bisect.last(collection, index)).toBe(index)
      }

      expect(bisect.last(collection, 5)).toBe(7)

      for (let index = 6; index <= 10; ++index) {
        expect(bisect.last(collection, index)).toBe(index + 2)
      }
    })

    it('return a negative insertion index if the value is missing', function () {
      const collection: ArrayPack<number> = ArrayPack.wrap([0, 5, 6, 8, 10, 11, 12, 13, 15, 17])

      expect(bisect.last(collection, -5)).toBe(- (0 + 1))
      expect(bisect.last(collection, 2)).toBe(- (1 + 1))
      expect(bisect.last(collection, 14)).toBe(- (8 + 1))
      expect(bisect.last(collection, 16)).toBe(- (9 + 1))
      expect(bisect.last(collection, 35)).toBe(- (10 + 1))
    })
  })
})
