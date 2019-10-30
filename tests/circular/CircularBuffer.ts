/** eslint-env jest */

import { CircularBuffer } from '../../src/circular/CircularBuffer'

import { pickUnique } from '../pickUnique'

type CircularBufferFactory<T> = (capacity : number) => CircularBuffer<T>

export function isCircularBuffer <T> (factory : CircularBufferFactory<T>) {
  return {
    of (generator : () => T) {
      return buildSuite(factory, generator)
    }
  }
}

function buildSuite <T> (
  factory : CircularBufferFactory<T>,
  generator : () => T
) {
  describe('#constructor', function () {
    it('allows to instantiate an empty circular buffer with an initial capacity', function () {
      const circular : CircularBuffer<T> = factory(20)

      expect(circular.capacity).toBe(20)
      expect(circular.size).toBe(0)
      expect([...circular]).toEqual([])
    })
  })

  describe('#isCollection', function () {
    it('return true', function () {
      const circular : CircularBuffer<T> = factory(20)
      expect(circular.isCollection).toBeTruthy()
    })
  })

  describe('#isCircularBuffer', function () {
    it('return true', function () {
      const circular : CircularBuffer<T> = factory(20)
      expect(circular.isCircularBuffer).toBeTruthy()
    })
  })

  describe('#push', function () {
    it('append a value at the end of the buffer', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = []

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 10; ++index) {
        elements.push(generator())
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements)
      expect(circular.size).toBe(10)
    })

    it('erase old values if the capacity is exceeded', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = []

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 50; ++index) {
        elements.push(generator())
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements.slice(30, 50))
      expect(circular.size).toBe(20)
    })
  })

  describe('#delete', function () {
    it('delete a value of the buffer', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = []

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 50; ++index) {
        elements.push(generator())
        circular.push(elements[index])
      }

      const current : Array<T> = elements.slice(30, 50)

      expect([...circular]).toEqual(current)
      expect(circular.size).toBe(20)

      circular.delete(5)
      circular.delete(6)

      current.splice(5, 1)
      current.splice(6, 1)

      expect([...circular]).toEqual(current)
      expect(circular.size).toBe(18)
    })
  })

  describe('#warp', function () {
    it('warp a value out of the buffer', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = pickUnique(generator, 50)

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 50; ++index) {
        circular.push(elements[index])
      }

      const current : Array<T> = elements.slice(30, 50)

      expect([...circular]).toEqual(current)
      expect(circular.size).toBe(20)

      circular.warp(5)
      circular.warp(6)

      current.splice(5, 1)
      current.splice(6, 1)

      expect(new Set<T>([...circular])).toEqual(new Set<T>(current))
      expect(circular.size).toBe(18)
    })
  })

  describe('#swap', function () {
    it('swap two values of the buffer', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = pickUnique(generator, 50)

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 50; ++index) {
        circular.push(elements[index])
      }

      const current : Array<T> = elements.slice(30, 50)

      expect([...circular]).toEqual(current)
      expect(circular.size).toBe(20)

      circular.swap(2, 6)
      circular.swap(5, 5)

      const tmp : T = current[6]
      current[6] = current[2]
      current[2] = tmp

      expect([...circular]).toEqual(current)
      expect(circular.size).toBe(20)
    })
  })

  describe('#set', function () {
    it('set values of the buffer', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = pickUnique(generator, 50)

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 50; ++index) {
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements.slice(30, 50))
      expect(circular.size).toBe(20)

      for (let index = 0; index < 20; ++index) {
        circular.set(index, elements[index])
      }

      expect([...circular]).toEqual(elements.slice(0, 20))
      expect(circular.size).toBe(20)
    })

    it('set values of the buffer out of its current size', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = pickUnique(generator, 50)

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 20; ++index) {
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements.slice(0, 20))
      expect(circular.size).toBe(20)

      circular.set(24, elements[24])

      const empty : T = circular.get(15)

      expect([...circular]).toEqual(
        elements.slice(5, 20).concat([
          empty, empty, empty, empty
        ]).concat([elements[24]])
      )
      expect(circular.size).toBe(20)
    })
  })

  describe('#insert', function () {
    it('insert a value into the circular buffer', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = pickUnique(generator, 20)

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 10; ++index) {
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements.slice(0, 10))
      expect(circular.size).toBe(10)

      for (let index = 0; index < 5; ++index) {
        circular.insert(5 + index, elements[10 + index])
      }

      expect([...circular]).toEqual(
        elements.slice(0, 5).concat(
          elements.slice(10, 15).concat(
            elements.slice(5, 10)
          )
        )
      )
      expect(circular.size).toBe(15)
    })

    it('insert a value into a complete circular buffer', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = pickUnique(generator, 30)

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 20; ++index) {
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements.slice(0, 20))
      expect(circular.size).toBe(20)

      for (let index = 0; index < 5; ++index) {
        circular.insert(10, elements[20 + index])
      }

      expect([...circular].slice(0, 5)).toEqual(
        elements.slice(5, 10)
      )
      expect([...circular].slice(5, 10)).toEqual(
        elements.slice(20, 25)
      )
      expect([...circular].slice(10, 20)).toEqual(
        elements.slice(10, 20)
      )
      expect(circular.size).toBe(20)
    })
  })

  describe('#has', function () {
    it('return true if the given value is in the buffer', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = pickUnique(generator, 30)

      for (let index = 0; index < 30; ++index) {
        expect(circular.has(elements[index])).toBeFalsy()
        circular.push(elements[index])
        expect(circular.has(elements[index])).toBeTruthy()
      }

      for (let index = 0; index < 30; ++index) {
        expect(circular.has(elements[index])).toBe(index >= 10)
      }
    })
  })

  describe('#indexOf', function () {
    it('return the index of the given value into the buffer', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = pickUnique(generator, 30)

      for (let index = 0; index < 30; ++index) {
        expect(circular.indexOf(elements[index])).toBe(-1)
        circular.push(elements[index])
        expect(circular.indexOf(elements[index])).toBe(Math.min(index, 19))
      }

      for (let index = 0; index < 30; ++index) {
        expect(circular.indexOf(elements[index])).toBe(
          index >= 10 ? index - 10 : -1
        )
      }
    })
  })

  describe('#clear', function () {
    it('empty the buffer', function () {
      const circular : CircularBuffer<T> = factory(20)
      const elements : Array<T> = pickUnique(generator, 30)

      for (let index = 0; index < 30; ++index) {
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements.slice(10, 30))

      circular.clear()

      expect([...circular]).toEqual([])
    })
  })
}
