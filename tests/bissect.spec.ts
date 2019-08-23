/** eslint-env jest */

import { Collection } from '../src/ts/Collection'
import { ArrayPack } from '../src/ts/pack/ArrayPack'
import { bissect } from '../src/ts/bissect'

describe('#bissect', function () {
  it('binary search a collection for a given value', function () {
    const collection : ArrayPack<number> = new ArrayPack<number>(20)

    for (let index = 0; index < 20; ++index) {
      collection.push(index)
    }

    for (let index = 0; index < 20; ++index) {
      expect(bissect(collection, index)).toBe(index)
    }
  })

  it('return a negative insertion index if the value is missing', function () {
    const collection : ArrayPack<number> = new ArrayPack<number>(10)

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
