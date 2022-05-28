/** eslint-env jest */

import { CircularBuffer } from '../../src/circular/CircularBuffer'

type CircularBufferFactory<T> = (capacity : number) => CircularBuffer<number>

function pickUnique (capacity : number) : number[] {
  const result : Set<number> = new Set<number>()

  while (result.size < capacity) {
    result.add(Math.random())
  }

  return [...result]
}

export function isCircularBuffer(factory : CircularBufferFactory<number>) {
  describe('#constructor', function () {
    it('allows to instantiate an empty circular buffer with an initial capacity', function () {
      const circular : CircularBuffer<number> = factory(20)

      expect(circular.capacity).toBe(20)
      expect(circular.size).toBe(0)
      expect([...circular]).toEqual([])
    })
  })

  describe('#push', function () {
    it('append a value at the end of the buffer', function () {
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = []

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 10; ++index) {
        elements.push(Math.random())
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements)
      expect(circular.size).toBe(10)
    })

    it('erase old values if the capacity is exceeded', function () {
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = []

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 50; ++index) {
        elements.push(Math.random())
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements.slice(30, 50))
      expect(circular.size).toBe(20)
    })
  })

  describe('#delete', function () {
    it('delete a value of the buffer', function () {
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = []

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 50; ++index) {
        elements.push(Math.random())
        circular.push(elements[index])
      }

      const current : number[] = elements.slice(30, 50)

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

  describe('#deleteMany', function () {
    it('delete a sequence of value of the buffer', function () {
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = []

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 50; ++index) {
        elements.push(Math.random())
        circular.push(elements[index])
      }

      const current : number[] = elements.slice(30, 50)

      expect([...circular]).toEqual(current)
      expect(circular.size).toBe(20)

      circular.deleteMany(5, 7)

      current.splice(5, 7)

      expect([...circular]).toEqual(current)
      expect(circular.size).toBe(13)
    })
  })

  describe('#warp', function () {
    it('warp a value out of the buffer', function () {
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = pickUnique(50)

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 50; ++index) {
        circular.push(elements[index])
      }

      const current : number[] = elements.slice(30, 50)

      expect([...circular]).toEqual(current)
      expect(circular.size).toBe(20)

      circular.warp(5)
      circular.warp(6)

      current.splice(5, 1)
      current.splice(6, 1)

      expect(new Set<number>([...circular])).toEqual(new Set<number>(current))
      expect(circular.size).toBe(18)
    })
  })

  describe('#swap', function () {
    it('swap two values of the buffer', function () {
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = pickUnique(50)

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 50; ++index) {
        circular.push(elements[index])
      }

      const current : number[] = elements.slice(30, 50)

      expect([...circular]).toEqual(current)
      expect(circular.size).toBe(20)

      circular.swap(2, 6)
      circular.swap(5, 5)

      const tmp : number = current[6]
      current[6] = current[2]
      current[2] = tmp

      expect([...circular]).toEqual(current)
      expect(circular.size).toBe(20)
    })
  })

  describe('#set', function () {
    it('set values of the buffer', function () {
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = pickUnique(50)

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
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = pickUnique(50)

      expect([...circular]).toEqual([])
      expect(circular.size).toBe(0)

      for (let index = 0; index < 20; ++index) {
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements.slice(0, 20))
      expect(circular.size).toBe(20)

      circular.set(24, elements[24])

      const empty : number = circular.get(15)

      expect([...circular]).toEqual(
        elements.slice(5, 20).concat([
          empty, empty, empty, empty
        ]).concat([elements[24]])
      )
      expect(circular.size).toBe(20)
    })
  })

  describe('#pop', function () {
    it('removes the last value of the buffer and return it', function () {
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = []
      const removed : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements)
      expect(removed).toEqual([])

      while (circular.size > 0) {
        removed.push(circular.pop())
      }

      expect([...circular]).toEqual([])
      expect(removed).toEqual(elements.reverse())
    })
  })

  describe('#shift', function () {
    it('removes the first value of the pack and return it', function () {
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = []
      const removed : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements)
      expect(removed).toEqual([])

      while (circular.size > 0) {
        removed.push(circular.shift())
      }

      expect([...circular]).toEqual([])
      expect(removed).toEqual(elements)
    })
  })

  describe('#insert', function () {
    it('insert a value into the circular buffer', function () {
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = pickUnique(20)

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
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = pickUnique(30)

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
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = pickUnique(30)

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
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = pickUnique(30)

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
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = pickUnique(30)

      for (let index = 0; index < 30; ++index) {
        circular.push(elements[index])
      }

      expect([...circular]).toEqual(elements.slice(10, 30))

      circular.clear()

      expect([...circular]).toEqual([])
    })
  })

  describe('#reallocate', function () {
    it('allows to expand the buffer', function () {
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = pickUnique(30)

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
      const circular : CircularBuffer<number> = factory(20)
      const elements : number[] = pickUnique(30)

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
      const circular : CircularBuffer<number> = factory(50)
      const elements : number[] = pickUnique(30)

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
