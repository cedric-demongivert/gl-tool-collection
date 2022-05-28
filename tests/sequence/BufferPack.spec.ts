import { Comparator } from '@cedric-demongivert/gl-tool-utils'
import { zeros } from '../../sources/generators/zeros'
import { BufferPack } from '../../sources/sequence/BufferPack'

import '../matchers'

/**
 * 
 */
describe('sequence/BufferPack', function () {
  /**
   * 
   */
  describe('prototype.reallocate', function () {
    /**
     * 
     */
    it('expands the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)
      expect(pack.capacity).toBe(4)

      pack.reallocate(8)

      expect(pack).toEqualSequence(0, 1, 2, 3)
      expect(pack.capacity).toBe(8)

      pack.reallocate(16)

      expect(pack).toEqualSequence(0, 1, 2, 3)
      expect(pack.capacity).toBe(16)
    })

    /**
     * 
     */
    it('reduces the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(12)]), 4)

      expect(pack).toEqualSequence(0, 1, 2, 3)
      expect(pack.capacity).toBe(16)

      pack.reallocate(8)

      expect(pack).toEqualSequence(0, 1, 2, 3)
      expect(pack.capacity).toBe(8)

      pack.reallocate(4)

      expect(pack).toEqualSequence(0, 1, 2, 3)
      expect(pack.capacity).toBe(4)
    })

    it('truncates the content', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3, 4, 5, 6, 7)

      expect(pack).toEqualSequence(0, 1, 2, 3, 4, 5, 6, 7)
      expect(pack.capacity).toBe(8)

      pack.reallocate(4)

      expect(pack).toEqualSequence(0, 1, 2, 3)
      expect(pack.capacity).toBe(4)

      pack.reallocate(2)

      expect(pack).toEqualSequence(0, 1)
      expect(pack.capacity).toBe(2)
    })
  })

  /**
   * 
   */
  describe('prototype.fit', function () {
    /**
     * 
     */
    it('reduces the capacity to the size', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(12)]), 4)

      expect(pack).toEqualSequence(0, 1, 2, 3)
      expect(pack.capacity).toBe(16)

      pack.fit()

      expect(pack).toEqualSequence(0, 1, 2, 3)
      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.size', function () {
    /**
     * 
     */
    it('returns the number of elements', function () {
      expect(BufferPack.ofUint32(0, 1, 2, 3).size).toBe(4)
      expect(BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(12)]), 4).size).toBe(4)
    })

    /**
     * 
     */
    it('updates the number of elements', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(12)]), 4)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.size = 8

      expect(pack).toEqualSequence(0, 1, 2, 3, ...zeros(4))
    })

    /**
     * 
     */
    it('may reallocate', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.size = 8

      expect(pack.capacity).toBe(8)
    })
  })

  /**
   * 
   */
  describe('prototype.pop', function () {
    /**
     * 
     */
    it('does not updates the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(12)]), 4)

      expect(pack.capacity).toBe(16)

      pack.pop()

      expect(pack.capacity).toBe(16)

      pack.pop()

      expect(pack.capacity).toBe(16)
    })

    /**
     * 
     */
    it('removes the last element', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.pop()

      expect(pack).toEqualSequence(0, 1, 2)

      pack.pop()

      expect(pack).toEqualSequence(0, 1)
    })

    /**
     * 
     */
    it('returns the removed element', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.pop()).toBe(3)
      expect(pack.pop()).toBe(2)
      expect(pack.pop()).toBe(1)
      expect(pack.pop()).toBe(0)
    })
  })

  /**
   * 
   */
  describe('prototype.shift', function () {
    /**
     * 
     */
    it('does not updates the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(12)]), 4)

      expect(pack.capacity).toBe(16)

      pack.shift()

      expect(pack.capacity).toBe(16)

      pack.shift()

      expect(pack.capacity).toBe(16)
    })

    /**
     * 
     */
    it('removes the first element', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.shift()

      expect(pack).toEqualSequence(1, 2, 3)

      pack.shift()

      expect(pack).toEqualSequence(2, 3)
    })

    /**
     * 
     */
    it('returns the removed element', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.shift()).toBe(0)
      expect(pack.shift()).toBe(1)
      expect(pack.shift()).toBe(2)
      expect(pack.shift()).toBe(3)
    })
  })

  /**
   * 
   */
  describe('prototype.swap', function () {
    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(12)]), 4)

      expect(pack.capacity).toBe(16)

      pack.swap(2, 3)

      expect(pack.capacity).toBe(16)

      pack.swap(0, 1)

      expect(pack.capacity).toBe(16)
    })

    /**
     * 
     */
    it('swap two elements', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.swap(3, 0)

      expect(pack).toEqualSequence(3, 1, 2, 0)
    })
  })

  /**
   * 
   */
  describe('prototype.set', function () {
    /**
     * 
     */
    it('replaces an element', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.set(2, 8)

      expect(pack).toEqualSequence(0, 1, 8, 3)
    })

    /**
     * 
     */
    it('defines an element', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.set(7, 8)

      expect(pack).toEqualSequence(0, 1, 2, 3, 0, 0, 0, 8)
    })

    /**
     * 
     */
    it('does not update the capacity when it replaces', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.set(2, 8)

      expect(pack.capacity).toBe(4)
    })

    /**
     * 
     */
    it('may reallocate', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.set(7, 8)

      expect(pack.capacity).toBe(8)
    })
  })

  /**
   * 
   */
  describe('prototype.setMany', function () {
    /**
     * 
     */
    it('replaces many elements', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.setMany(1, 2, 8)

      expect(pack).toEqualSequence(0, 8, 8, 3)
    })

    /**
     * 
     */
    it('defines many elements', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.setMany(5, 3, 8)

      expect(pack).toEqualSequence(0, 1, 2, 3, 0, 8, 8, 8)
    })

    /**
     * 
     */
    it('does not update the capacity when it replaces', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.setMany(1, 2, 8)

      expect(pack.capacity).toBe(4)
    })

    /**
     * 
     */
    it('may reallocate', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.setMany(5, 3, 8)

      expect(pack.capacity).toBe(8)
    })
  })

  /**
   * 
   */
  describe('prototype.sort', function () {
    /**
     * 
     */
    it('sorts', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(1, 3, 2, 0)

      expect(pack).toEqualSequence(1, 3, 2, 0)

      pack.sort(Comparator.compareNumbers)

      expect(pack).toEqualSequence(0, 1, 2, 3)
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(1, 3, 2, 0)

      expect(pack.capacity).toBe(4)

      pack.sort(Comparator.compareNumbers)

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.subsort', function () {
    /**
     * 
     */
    it('sorts a subsequence', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(1, 3, 2, 0, 7, 4, 6, 8, 5)

      expect(pack).toEqualSequence(1, 3, 2, 0, 7, 4, 6, 8, 5)

      pack.subsort(2, 5, Comparator.compareNumbers)

      expect(pack).toEqualSequence(1, 3, 0, 2, 4, 6, 7, 8, 5)
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(1, 3, 2, 0, 7, 4, 6, 8, 5)

      expect(pack.capacity).toBe(9)

      pack.subsort(2, 5, Comparator.compareNumbers)

      expect(pack.capacity).toBe(9)
    })
  })

  /**
   * 
   */
  describe('prototype.insert', function () {
    /**
     * 
     */
    it('inserts an element', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(4)]), 4)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.insert(1, 8)

      expect(pack).toEqualSequence(0, 8, 1, 2, 3)
    })

    /**
     * 
     */
    it('defines an element', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(4)]), 4)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.insert(5, 8)

      expect(pack).toEqualSequence(0, 1, 2, 3, 0, 8)
    })

    /**
     * 
     */
    it('does not update the capacity when the insertion does not overflow', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(4)]), 4)

      expect(pack.capacity).toBe(8)

      pack.insert(1, 8)

      expect(pack.capacity).toBe(8)
    })

    /**
     * 
     */
    it('updates the capacity if the insertion overflows', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.insert(1, 8)

      expect(pack.capacity).toBeGreaterThan(4)
    })
  })

  /**
   * 
   */
  describe('prototype.push', function () {
    /**
     * 
     */
    it('add an element at the end', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(4)]), 4)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.push(8)

      expect(pack).toEqualSequence(0, 1, 2, 3, 8)
    })

    /**
     * 
     */
    it('does not update the capacity if the insertion does not overflow', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(4)]), 4)

      expect(pack.capacity).toBe(8)

      pack.push(8)

      expect(pack.capacity).toBe(8)
    })

    /**
     * 
     */
    it('updates the capacity if the insertion overflows', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.push(8)

      expect(pack.capacity).toBeGreaterThan(4)
    })
  })

  /**
   * 
   */
  describe('prototype.unshift', function () {
    /**
     * 
     */
    it('add an element at the start', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(4)]), 4)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.unshift(8)

      expect(pack).toEqualSequence(8, 0, 1, 2, 3)
    })

    /**
     * 
     */
    it('does not update the capacity if the insertion does not overflow', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(4)]), 4)

      expect(pack.capacity).toBe(8)

      pack.unshift(8)

      expect(pack.capacity).toBe(8)
    })

    /**
     * 
     */
    it('updates the capacity if the insertion overflows', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.unshift(8)

      expect(pack.capacity).toBeGreaterThan(4)
    })
  })

  /**
   * 
   */
  describe('prototype.delete', function () {
    /**
     * 
     */
    it('removes an element', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.delete(1)

      expect(pack).toEqualSequence(0, 2, 3)
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.delete(1)

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.deleteMany', function () {
    /**
     * 
     */
    it('removes many elements', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.deleteMany(1, 2)

      expect(pack).toEqualSequence(0, 3)
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.deleteMany(1, 2)

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.warp', function () {
    /**
     * 
     */
    it('fastly removes an element', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.warp(1)

      expect(pack).toMatchSequence(0, 2, 3)
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.warp(1)

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.warpMany', function () {
    /**
     * 
     */
    it('fastly removes many element', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3, 4, 5, 6)

      expect(pack).toEqualSequence(0, 1, 2, 3, 4, 5, 6)

      pack.warpMany(1, 2)

      expect(pack).toMatchSequence(0, 3, 4, 5, 6)
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3, 4, 5, 6)

      expect(pack.capacity).toBe(7)

      pack.warpMany(1, 2)

      expect(pack.capacity).toBe(7)
    })
  })

  /**
   * 
   */
  describe('prototype.fill', function () {
    /**
     * 
     */
    it('fills with a value', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.fill(1)

      expect(pack).toEqualSequence(1, 1, 1, 1)
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.fill(1)

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.concat', function () {
    /**
     * 
     */
    it('push a sequence', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(12)]), 4)
      const rest: BufferPack<Uint32Array> = BufferPack.ofUint32(4, 5, 6, 7)

      expect(pack).toEqualSequence(0, 1, 2, 3)
      expect(rest).toEqualSequence(4, 5, 6, 7)

      pack.concat(rest)

      expect(pack).toEqualSequence(0, 1, 2, 3, 4, 5, 6, 7)
      expect(rest).toEqualSequence(4, 5, 6, 7)
    })

    /**
     * 
     */
    it('does not update the capacity when the insertion does not overflow', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(12)]), 4)
      const rest: BufferPack<Uint32Array> = BufferPack.ofUint32(4, 5, 6, 7)

      expect(pack.capacity).toBe(16)
      expect(rest.capacity).toBe(4)

      pack.concat(rest)

      expect(pack.capacity).toBe(16)
      expect(rest.capacity).toBe(4)
    })

    /**
     * 
     */
    it('updates the capacity when the insertion overflows', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)
      const rest: BufferPack<Uint32Array> = BufferPack.ofUint32(4, 5, 6, 7)

      expect(pack.capacity).toBe(4)
      expect(rest.capacity).toBe(4)

      pack.concat(rest)

      expect(pack.capacity).toBe(8)
      expect(rest.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.concatArray', function () {
    /**
     * 
     */
    it('push an array', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(12)]), 4)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.concatArray([4, 5, 6, 7])

      expect(pack).toEqualSequence(0, 1, 2, 3, 4, 5, 6, 7)
    })

    /**
     * 
     */
    it('does not update the capacity when the insertion does not overflow', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.wrap(new Uint32Array([0, 1, 2, 3, ...zeros(12)]), 4)

      expect(pack.capacity).toBe(16)

      pack.concatArray([4, 5, 6, 7])

      expect(pack.capacity).toBe(16)
    })

    /**
     * 
     */
    it('updates the capacity when the insertion overflows', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.concatArray([4, 5, 6, 7])

      expect(pack.capacity).toBe(8)
    })
  })

  /**
   * 
   */
  describe('prototype.copy', function () {
    /**
     * 
     */
    it('copy a sequence', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.uint32(16)
      const toCopy: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3, 4, 5)

      expect(pack).toEqualSequence()
      expect(toCopy).toEqualSequence(0, 1, 2, 3, 4, 5)

      pack.copy(toCopy)

      expect(pack).toEqualSequence(0, 1, 2, 3, 4, 5)
      expect(toCopy).toEqualSequence(0, 1, 2, 3, 4, 5)
    })

    /**
     * 
     */
    it('does not update the capacity when the insertion does not overflow', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.uint32(16)
      const toCopy: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(16)
      expect(toCopy.capacity).toBe(4)

      pack.copy(toCopy)

      expect(pack.capacity).toBe(16)
      expect(toCopy.capacity).toBe(4)
    })



    /**
     * 
     */
    it('does not update the capacity when the insertion does not overflow', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.uint32(4)
      const toCopy: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3, 4, 5, 6, 7)

      expect(pack.capacity).toBe(4)
      expect(toCopy.capacity).toBe(8)

      pack.copy(toCopy)

      expect(pack.capacity).toBe(8)
      expect(toCopy.capacity).toBe(8)
    })
  })

  /**
   * 
   */
  describe('prototype.clear', function () {
    /**
     * 
     */
    it('deletes all elements', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack).toEqualSequence(0, 1, 2, 3)

      pack.clear()

      expect(pack).toEqualSequence()
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.clear()

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.equals', function () {
    /**
     * 
     */
    it('returns true if both instances are equals', function () {
      expect(BufferPack.ofUint32(0, 1, 2, 3).equals(BufferPack.ofUint32(0, 1, 2, 3))).toBeTruthy()
    })

    /**
     * 
     */
    it('returns true for itself', function () {
      const instance: BufferPack<Uint32Array> = BufferPack.ofUint32(0, 1, 2, 3)

      expect(instance.equals(instance)).toBeTruthy()
    })

    /**
     * 
     */
    it('returns false if the size change', function () {
      expect(BufferPack.ofUint32(0, 1, 2, 3).equals(BufferPack.ofUint32(0, 1, 2, 3, 4, 5))).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false if on element change', function () {
      expect(BufferPack.ofUint32(0, 1, 2, 3).equals(BufferPack.ofUint32(0, 1, 3, 3))).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false for instances of other types', function () {
      expect(BufferPack.ofUint32(0, 1, 2, 3).equals(10)).toBeFalsy()
      expect(BufferPack.ofUint32(0, 1, 2, 3).equals('test')).toBeFalsy()
      expect(BufferPack.ofUint32(0, 1, 2, 3).equals(new Date())).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false for null or undefined values', function () {
      expect(BufferPack.ofUint32(0, 1, 2, 3).equals(null)).toBeFalsy()
      expect(BufferPack.ofUint32(0, 1, 2, 3).equals(undefined)).toBeFalsy()
    })
  })
})
