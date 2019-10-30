/** eslint-env jest */

import { Set as LibrarySet } from '../../src/set/Set'

import { pickUnique } from '../pickUnique'

type SetFactory<T> = () => LibrarySet<T>

export function isSet <T> (factory : SetFactory<T>) {
  return {
    of (generator : () => T) {
      return buildSuite(factory, generator)
    }
  }
}

function buildSuite <T> (factory : SetFactory<T>, generator : () => T) {
  describe('#constructor', function () {
    it('allows to instantiate an empty set', function () {
      const set : LibrarySet<T> = factory()

      expect([...set]).toEqual([])
    })
  })

  describe('#isSet', function () {
    it('returns true', function () {
      const set : LibrarySet<T> = factory()

      expect(set.isSet).toBe(true)
    })
  })

  describe('#add', function () {
    it('add a value to the set', function () {
      const set : LibrarySet<T> = factory()
      const elements : Array<T> = pickUnique(generator, 10)

      expect(set.size).toBe(0)
      expect(new Set<T>([...set])).toEqual(new Set<T>())

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(10)
      expect(new Set<T>([...set])).toEqual(new Set<T>(elements))
    })

    it('does not add already added elements', function () {
      const set : LibrarySet<T> = factory()
      const elements : Array<T> = pickUnique(generator, 10)

      expect(set.size).toBe(0)
      expect(new Set<T>([...set])).toEqual(new Set<T>())

      for (const element of elements) {
        set.add(element)
      }

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(10)
      expect(new Set<T>([...set])).toEqual(new Set<T>(elements))
    })
  })

  describe('#delete', function () {
    it('remove a value from the set', function () {
      const set : LibrarySet<T> = factory()
      const elements : Array<T> = pickUnique(generator, 10)

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(10)
      expect(new Set<T>([...set])).toEqual(new Set<T>(elements))

      const result : Set<T> = new Set<T>(elements)

      for (let index = 0; index < (elements.length >> 1); ++index) {
        result.delete(elements[index << 1])
        set.delete(elements[index << 1])
      }

      expect(set.size).toBe(5)
      expect(new Set<T>([...set])).toEqual(result)
    })

    it('does nothing if the element was already removed', function () {
      const set : LibrarySet<T> = factory()
      const elements : Array<T> = pickUnique(generator, 10)

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(10)
      expect(new Set<T>([...set])).toEqual(new Set<T>(elements))

      const result : Set<T> = new Set<T>(elements)

      for (let index = 0; index < (elements.length >> 1); ++index) {
        result.delete(elements[index << 1])
        set.delete(elements[index << 1])
      }

      expect(set.size).toBe(5)
      expect(new Set<T>([...set])).toEqual(result)

      for (let index = 0; index < (elements.length >> 1); ++index) {
        set.delete(elements[index << 1])
      }

      expect(set.size).toBe(5)
      expect(new Set<T>([...set])).toEqual(result)
    })
  })

  describe('#clear', function () {
    it('empty the set', function () {
      const set : LibrarySet<T> = factory()
      const elements : Array<T> = pickUnique(generator, 10)

      for (const element of elements) {
        set.add(element)
      }

      expect(set.size).toBe(10)
      expect(new Set<T>([...set])).toEqual(new Set<T>(elements))

      set.clear()

      expect(set.size).toBe(0)
      expect(new Set<T>([...set])).toEqual(new Set<T>())
    })
  })

  describe('#has', function () {
    it('return true if the given value is in the pack', function () {
      const set : LibrarySet<T> = factory()
      const elements : Array<T> = pickUnique(generator, 20)

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

  describe('#indexOf', function () {
    it('return the index of the given value of the pack', function () {
      const set : LibrarySet<T> = factory()
      const elements : Array<T> = pickUnique(generator, 20)

      for (let index = 0; index < 20; ++index) {
        expect(set.indexOf(elements[index])).toBe(-1)
        set.add(elements[index])
        expect(set.get(set.indexOf(elements[index]))).toBe(elements[index])
      }

      for (let index = 15; index < 20; ++index) {
        set.delete(elements[index])
      }

      for (let index = 15; index < 20; ++index) {
        expect(set.indexOf(elements[index])).toBe(-1)
      }
    })
  })
}
