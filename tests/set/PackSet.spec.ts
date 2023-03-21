/** eslint-env jest */
import { PackSet } from '../../sources/set/PackSet'
import { Packs } from '../../sources/pack/Packs'
import { Pack } from '../../sources/pack/Pack'

/**
 * 
 */
describe('#PackSet', function() {
  /**
   * 
   */
  describe('#constructor', function () {
    /**
     * 
     */
    it('allows to instantiate an empty set', function () {
      const list: Pack<number> = Packs.int32(16)
      const set = new PackSet(list)

      expect([...set]).toEqual([])
    })
  })

  /**
   * 
   */
  describe('#add', function () {
    /**
     * 
     */
    it('add a value to the set', function () {
      const list: Pack<number> = Packs.int32(16)
      const set = new PackSet(list)

      const elements = [5, 10, 8, 3, 9, 7, 1, 4, 2, 0]

      expect(set.size).toBe(0)

      for (const element of elements) {
        expect(set.has(element)).toBeFalsy()
        set.add(element)
        expect(set.has(element)).toBeTruthy()
      }

      expect(set.size).toBe(elements.length)
    })

    /**
     * 
     */
    it('does not add already added elements', function () {
      const list: Pack<number> = Packs.int32(16)
      const set = new PackSet(list)

      const elements = [5, 10, 8, 3, 9, 7, 1, 4 , 2, 0]

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(elements.length)

      for (const element of elements) {
        expect(set.has(element)).toBeTruthy()
        set.add(element)
        expect(set.has(element)).toBeTruthy()
      }

      expect(set.size).toBe(elements.length)
    })
  })

  /**
   * 
   */
  describe('#delete', function () {
    /**
     * 
     */
    it('remove a value from the set', function () {
      const list: Pack<number> = Packs.int32(16)
      const set = new PackSet(list)

      const elements = [5, 10, 8, 3, 9, 7, 1, 4 , 2, 0]

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(elements.length)

      for (let index = 0; index < elements.length; index += 2) {
        expect(set.has(elements[index])).toBeTruthy()
        set.delete(elements[index])
        expect(set.has(elements[index])).toBeFalsy()
      }

      expect(set.size).toBe(elements.length >> 1)

      for (let index = 1; index < elements.length; index += 2) {
        expect(set.has(elements[index])).toBeTruthy()
      }
    })

    /**
     * 
     */
    it('does nothing if the element was already removed', function () {
      const list: Pack<number> = Packs.int32(16)
      const set = new PackSet(list)

      const elements = [5, 10, 8, 3, 9, 7, 1, 4 , 2, 0]

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(elements.length)

      for (let index = 0; index < elements.length; index += 2) {
        set.delete(elements[index])
      }

      expect(set.size).toBe(elements.length >> 1)
      
      for (let index = 1; index < elements.length; index += 2) {
        expect(set.has(elements[index])).toBeTruthy()
      }

      for (let index = 0; index < elements.length; index += 2) {
        expect(set.has(elements[index])).toBeFalsy()
        set.delete(elements[index])
        expect(set.has(elements[index])).toBeFalsy()
      }

      expect(set.size).toBe(elements.length >> 1)
      
      for (let index = 1; index < elements.length; index += 2) {
        expect(set.has(elements[index])).toBeTruthy()
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
    it('empty the set', function () {
      const list: Pack<number> = Packs.int32(16)
      const set = new PackSet(list)

      const elements = [5, 10, 8, 3, 9, 7, 1, 4 , 2, 0]

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(10)

      set.clear()

      expect(set.size).toBe(0)

      for (const element of elements) {
        expect(set.has(element)).toBeFalsy()
      }
    })
  })

  /**
   * 
   */
  describe('#has', function () {
    /**
     * 
     */
    it('return true if the given value is in the pack', function () {
      const list: Pack<number> = Packs.int32(16)
      const set = new PackSet(list)
      
      const elements = [1, 3, 7, 9, 10]

      for (let index = 0; index < elements.length; ++index) {
        set.add(elements[index])
      }

      expect(set.has(1)).toBeTruthy()
      expect(set.has(2)).toBeFalsy()
      expect(set.has(3)).toBeTruthy()
      expect(set.has(4)).toBeFalsy()
      expect(set.has(5)).toBeFalsy()
      expect(set.has(6)).toBeFalsy()
      expect(set.has(7)).toBeTruthy()
      expect(set.has(8)).toBeFalsy()
      expect(set.has(9)).toBeTruthy()
      expect(set.has(10)).toBeTruthy()
    })
  })
})