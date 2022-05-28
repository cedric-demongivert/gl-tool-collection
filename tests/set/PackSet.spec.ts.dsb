import { PackSet } from '../../src/set/PackSet'

import { isMutableSet } from './MutableSet'

describe('#ArrayPackSet', function () {
  isMutableSet(PackSet.any)

  describe('#indexOf', function () {
    it('return the index of the given value of the pack', function () {
      const set : PackSet<number> = PackSet.any(32)

      for (let index = 0; index < 20; ++index) {
        expect(set.indexOf(index)).toBe(-1)
        set.add(index)
        expect(set.get(set.indexOf(index))).toBe(index)
      }

      for (let index = 15; index < 20; ++index) {
        set.delete(index)
      }

      for (let index = 15; index < 20; ++index) {
        expect(set.indexOf(index)).toBe(-1)
      }
    })
  })
})
