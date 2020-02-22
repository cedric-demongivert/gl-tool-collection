/** eslint-env jest */

import { ArrayPack } from '@library/pack/ArrayPack'
import { bissect } from '@library/algorithm/bissect'

describe('#bissect', function () {
  it('binary search a collection for a given value', function () {
    const collection : ArrayPack<number> = ArrayPack.allocate(20)

    for (let index = 0; index < 20; ++index) {
      collection.push(index)
    }

    for (let index = 0; index < 20; ++index) {
      expect(bissect(collection, index)).toBe(index)
    }
  })

  it('return a negative insertion index if the value is missing', function () {
    const collection : ArrayPack<number> = ArrayPack.allocate(10)

    for (const value of [0, 5, 6, 8, 10, 11, 12, 13, 15, 17]) {
      collection.push(value)
    }

    expect(bissect(collection, -5)).toBe(- (0 + 1))
    expect(bissect(collection, 2)).toBe(- (1 + 1))
    expect(bissect(collection, 14)).toBe(- (8 + 1))
    expect(bissect(collection, 16)).toBe(- (9 + 1))
    expect(bissect(collection, 35)).toBe(- (10 + 1))
  })
})
