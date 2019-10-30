/** eslint-env jest */

import {
  ReallocableCircularBuffer
} from '../../src/circular/ReallocableCircularBuffer'
import { pickUnique } from '../pickUnique'

type ReallocableCircularBufferFactory<T> = (
  (capacity : number) => ReallocableCircularBuffer<T>
)

export function isReallocableCircularBuffer <T> (
  factory : ReallocableCircularBufferFactory<T>
) {
  return {
    of (generator : () => T) {
      return buildSuite(factory, generator)
    }
  }
}

function buildSuite <T> (
  factory : ReallocableCircularBufferFactory<T>,
  generator : () => T
) {
  describe('#reallocate', function () {
    it('allows to expand the buffer', function () {
      const circular : ReallocableCircularBuffer<T> = factory(20)
      const elements : Array<T> = pickUnique(generator, 30)

      for (let index = 0; index < 30; ++index) {
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements.slice(10, 30))
      expect(circular.capacity).toBe(20)

      circular.reallocate(30)

      for (let index = 0; index < 10; ++index) {
        circular.push(elements[index])
      }

      expect(circular.capacity).toBe(30)
      expect([...circular]).toEqual(elements.slice(10, 30).concat(
        elements.slice(0, 10)
      ))
    })

    it('allows to shrink the buffer', function () {
      const circular : ReallocableCircularBuffer<T> = factory(20)
      const elements : Array<T> = pickUnique(generator, 30)

      for (let index = 0; index < 30; ++index) {
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements.slice(10, 30))
      expect(circular.capacity).toBe(20)

      circular.reallocate(10)

      expect(circular.capacity).toBe(10)
      expect([...circular]).toEqual(elements.slice(20, 30))
    })
  })

  describe('#fit', function () {
    it('fit the buffer capacity to its size', function () {
      const circular : ReallocableCircularBuffer<T> = factory(50)
      const elements : Array<T> = pickUnique(generator, 30)

      for (let index = 0; index < 30; ++index) {
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements)
      expect(circular.capacity).toBe(50)

      circular.fit()

      expect([...circular]).toEqual(elements)
      expect(circular.capacity).toBe(30)
    })
  })
}
