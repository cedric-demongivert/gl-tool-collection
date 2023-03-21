/** eslint-env jest */

import { CircularPackAdapter } from '../../sources/circular/CircularPackAdapter'
import { Packs } from '../../sources/pack/Packs'

/**
 * 
 */
describe('CircularPackAdapter', function () {
  /**
   * 
   */
  describe('#constructor', function () {
    /**
     * 
     */
    it('allows to instantiate an empty circular buffer with an initial capacity', function () {
      const circular = new CircularPackAdapter(Packs.uint32(20))

      expect(circular.capacity).toBe(20)
      expect(circular.size).toBe(0)
      expect([...circular]).toEqual([])
    })
  })

  /**
   * 
   */
  describe('#push', function () {
    /**
     * 
     */
    it('append a value at the end of the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)
    })

    /**
     * 
     */
    it('erase old values if the capacity is exceeded', function () {
      const circular = new CircularPackAdapter(Packs.uint32(5))

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([5, 6, 7, 8, 9])
      expect(circular.size).toBe(5)
    })
  })

  /**
   * 
   */
  describe('#delete', function () {
    /**
     * 
     */
    it('delete a value of the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      circular.delete(5)

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 6, 7, 8, 9])
      expect(circular.size).toBe(9)

      circular.delete(3)

      expect([...circular]).toEqual([0, 1, 2, 4, 6, 7, 8, 9])
      expect(circular.size).toBe(8)
    })

    /**
     * 
     */
    it('delete a sequence of value of the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      circular.delete(5, 7)

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 7, 8, 9 ])
      expect(circular.size).toBe(8)
    })

    /**
     * 
     */
    it('allows to define the sequence to delete in any order', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      circular.delete(7, 5)

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 7, 8, 9 ])
      expect(circular.size).toBe(8)
    })
  })

  /**
   * 
   */
  describe('#warp', function () {
    /**
     * 
     */
    it('warp a value out of the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      circular.warp(5)

      for (let index = 0; index < 10; ++index) {
        expect(circular.has(index)).toBe(index !== 5)
      }

      expect(circular.size).toBe(9)
    })
  })

  /**
   * 
   */
  describe('#swap', function () {
    /**
     * 
     */
    it('swap two values of the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      circular.swap(2, 6)

      expect([...circular]).toEqual([0, 1, 6, 3, 4, 5, 2, 7, 8, 9])
      expect(circular.size).toBe(10)
    })
  })

  /**
   * 
   */
  describe('#set', function () {
    /**
     * 
     */
    it('set values of the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      for (let index = 0; index < 10; ++index) {
        circular.set(index, index * 2)
      }

      expect([...circular]).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18])
      expect(circular.size).toBe(10)
    })

    /**
     * 
     */
    it('set values of the buffer out of its current size', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      circular.set(14, 14)

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 14])
      expect(circular.size).toBe(15)
    })
  })

  /**
   * 
   */
  describe('#pop', function () {
    /**
     * 
     */
    it('removes the last value of the buffer and return it', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      expect(circular.pop()).toBe(9)
      expect(circular.pop()).toBe(8)
      expect(circular.pop()).toBe(7)
      expect(circular.pop()).toBe(6)

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5])
      expect(circular.size).toBe(6)
    })
  })

  /**
   * 
   */
  describe('#shift', function () {
    /**
     * 
     */
    it('removes the first value of the pack and return it', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      expect(circular.shift()).toBe(0)
      expect(circular.shift()).toBe(1)
      expect(circular.shift()).toBe(2)
      expect(circular.shift()).toBe(3)

      expect([...circular]).toEqual([4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(6)
    })
  })

  /**
   * 
   */
  describe('#insert', function () {
    /**
     * 
     */
    it('insert a value into the circular buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(20))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      circular.insert(5, 8)

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 8, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(11)
    })

    /**
     * 
     */
    it('insert a value into a complete circular buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      circular.insert(5, 8)

      expect([...circular]).toEqual([1, 2, 3, 4, 8, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)
    })
  })

  /**
   * 
   */
  describe('#has', function () {
    /**
     * 
     */
    it('return true if the given value is in the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      for (let index = 0; index < 20; ++index) {
        expect(circular.has(index)).toBe(index < 10)
      }
    })
  })

  /**
   * 
   */
  describe('#indexOf', function () {
    /**
     * 
     */
    it('return the index of the given value into the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      for (let index = 0; index < 20; ++index) {
        expect(circular.indexOf(index)).toBe(index < 10 ? index : -1)
      }
    })
  })

  /**
   * 
   */
  describe('#clear', function () {
    /**
     * 
     */
    it('empty the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)

      circular.clear()

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)
    })
  })

  /**
   * 
   */
  describe('#reallocate', function () {
    /**
     * 
     */
    it('allows to expand the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)
      expect(circular.capacity).toBe(10)

      circular.reallocate(20)

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)
      expect(circular.capacity).toBe(20)
    })

    /**
     * 
     */
    it('allows to shrink the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(30))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)
      expect(circular.capacity).toBe(30)

      circular.reallocate(20)

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)
      expect(circular.capacity).toBe(20)
    })

    /**
     * 
     */
    it('allows to truncate the buffer', function () {
      const circular = new CircularPackAdapter(Packs.uint32(10))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)
      expect(circular.capacity).toBe(10)

      circular.reallocate(5)

      expect([...circular]).toEqual([5, 6, 7, 8, 9])
      expect(circular.size).toBe(5)
      expect(circular.capacity).toBe(5)
    })
  })

  /**
   * 
   */
  describe('#fit', function () {
    /**
     * 
     */
    it('fit the buffer capacity to its size', function () {
      const circular = new CircularPackAdapter(Packs.uint32(20))

      for (let index = 0; index < 10; ++index) {
        circular.push(index)
      }

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)
      expect(circular.capacity).toBe(20)

      circular.fit()

      expect([...circular]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(circular.size).toBe(10)
      expect(circular.capacity).toBe(10)
    })
  })
})
