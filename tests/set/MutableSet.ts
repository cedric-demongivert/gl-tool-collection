/** eslint-env jest */

import { MutableSet } from '../../src/set/MutableSet'

type SetFactory<T> = (capacity : number) => MutableSet<T>

export function isMutableSet (factory : SetFactory<number>) {
  describe('#constructor', function () {
    it('allows to instantiate an empty set', function () {
      const set : MutableSet<number> = factory(16)

      expect([...set]).toEqual([])
    })
  })

  describe('#add', function () {
    it('add a value to the set', function () {
      const set : MutableSet<number> = factory(16)
      const elements : Array<number> = [5, 10, 8, 3, 9, 7, 1, 4 , 2, 0]

      expect(set.size).toBe(0)
      expect(new Set<number>([...set])).toEqual(new Set<number>())

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(10)
      expect(new Set<number>([...set])).toEqual(new Set<number>(elements))
    })

    it('does not add already added elements', function () {
      const set : MutableSet<number> = factory(16)
      const elements : Array<number> = [5, 10, 8, 3, 9, 7, 1, 4 , 2, 0]

      expect(set.size).toBe(0)
      expect(new Set<number>([...set])).toEqual(new Set<number>())

      for (const element of elements) {
        set.add(element)
      }

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(10)
      expect(new Set<number>([...set])).toEqual(new Set<number>(elements))
    })
  })

  describe('#delete', function () {
    it('remove a value from the set', function () {
      const set : MutableSet<number> = factory(16)
      const elements : Array<number> = [5, 10, 8, 3, 9, 7, 1, 4 , 2, 0]

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(10)
      expect(new Set<number>([...set])).toEqual(new Set<number>(elements))

      const result : Set<number> = new Set<number>(elements)

      for (let index = 0; index < (elements.length >> 1); ++index) {
        result.delete(elements[index << 1])
        set.delete(elements[index << 1])
      }

      expect(set.size).toBe(5)
      expect(new Set<number>([...set])).toEqual(result)
    })

    it('does nothing if the element was already removed', function () {
      const set : MutableSet<number> = factory(16)
      const elements : Array<number> = [5, 10, 8, 3, 9, 7, 1, 4 , 2, 0]

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(10)
      expect(new Set<number>([...set])).toEqual(new Set<number>(elements))

      const result : Set<number> = new Set<number>(elements)

      for (let index = 0; index < (elements.length >> 1); ++index) {
        result.delete(elements[index << 1])
        set.delete(elements[index << 1])
      }

      expect(set.size).toBe(5)
      expect(new Set<number>([...set])).toEqual(result)

      for (let index = 0; index < (elements.length >> 1); ++index) {
        set.delete(elements[index << 1])
      }

      expect(set.size).toBe(5)
      expect(new Set<number>([...set])).toEqual(result)
    })
  })

  describe('#clear', function () {
    it('empty the set', function () {
      const set : MutableSet<number> = factory(16)
      const elements : Array<number> = [5, 10, 8, 3, 9, 7, 1, 4 , 2, 0]

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(10)
      expect(new Set<number>([...set])).toEqual(new Set<number>(elements))

      set.clear()

      expect(set.size).toBe(0)
      expect(new Set<number>([...set])).toEqual(new Set<number>())
    })
  })

  describe('#has', function () {
    it('return true if the given value is in the pack', function () {
      const set : MutableSet<number> = factory(32)
      const elements : Array<number> = [
         5, 10,  8,  3,  9,  7,  1,  4,  2,  0,
         6, 11, 13, 15, 19, 16, 22, 23, 30, 18
      ]

      for (let index = 0; index < 20; ++index) {
        expect(set.has(elements[index])).toBeFalsy()
        set.add(elements[index])
        expect(set.has(elements[index])).toBeTruthy()
      }

      for (let index = 15; index < 20; ++index) {
        set.delete(elements[index])
      }

      for (let index = 15; index < 20; ++index) {
        expect(set.has(elements[index])).toBeFalsy()
      }
    })
  })
}
