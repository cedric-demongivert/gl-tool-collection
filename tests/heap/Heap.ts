/** eslint-env jest */

import { Heap } from '../../src/heap/Heap'

type HeapFactory<T> = (capacity : number) => Heap<T>

export function isHeap (factory : HeapFactory<number>) : void {
  describe('#constructor', function () {
    it('allows to instantiate an empty heap', function () {
      const heap : Heap<number> = factory(8)
      expect([...heap]).toEqual([])
    })
  })

  describe('#get', function () {
    it('returns the nth element of the heap', function () {
      const heap : Heap<number> = factory(32)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        heap.push(elements[index])
      }

      expect(heap.size).toEqual(elements.length)

      for (let index = 0, size = heap.size; index < size; ++index) {
        elements.splice(elements.indexOf(heap.get(index)), 1)
      }

      expect(elements).toEqual([])

      for (let index = 0, size = heap.size; index < size; ++index) {
        if ((index << 1) + 1 < size) {
          expect(heap.compare(index, (index << 1) + 1) >= 0).toBeTruthy()
        }

        if ((index << 1) + 2 < size) {
          expect(heap.compare(index, (index << 1) + 2) >= 0).toBeTruthy()
        }
      }
    })
  })

  describe('#push', function () {
    it('add a value to the heap', function () {
      const heap : Heap<number> = factory(32)
      const elements : number[] = []

      expect(heap.size).toBe(0)

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        heap.push(elements[index])
      }

      expect(heap.size).toEqual(elements.length)

      for (let index = 0, size = heap.size; index < size; ++index) {
        elements.splice(elements.indexOf(heap.get(index)), 1)
      }

      expect(elements).toEqual([])

      for (let index = 0, size = heap.size; index < size; ++index) {
        if ((index << 1) + 1 < size) {
          expect(heap.compare(index, (index << 1) + 1) >= 0).toBeTruthy()
        }

        if ((index << 1) + 2 < size) {
          expect(heap.compare(index, (index << 1) + 2) >= 0).toBeTruthy()
        }
      }
    })
  })

  describe('#delete', function () {
    it('delete a value of the heap', function () {
      const heap : Heap<number> = factory(32)
      const elements : number[] = []
      const removed : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        heap.push(elements[index])
      }

      expect(heap.size).toBe(20)

      removed.push(heap.get(5))
      heap.delete(5)
      removed.push(heap.get(10))
      heap.delete(10)
      removed.push(heap.get(9))
      heap.delete(9)

      expect(heap.size).toBe(17)

      for (let index = 0, size = heap.size; index < size; ++index) {
        elements.splice(elements.indexOf(heap.get(index)), 1)
      }

      expect(elements.length).toEqual(removed.length)

      for (let index = 0, size = removed.length; index < size; ++index) {
        elements.splice(elements.indexOf(removed[index]), 1)
      }

      expect(elements).toEqual([])

      for (let index = 0, size = heap.size; index < size; ++index) {
        if ((index << 1) + 1 < size) {
          expect(heap.compare(index, (index << 1) + 1) >= 0).toBeTruthy()
        }

        if ((index << 1) + 2 < size) {
          expect(heap.compare(index, (index << 1) + 2) >= 0).toBeTruthy()
        }
      }
    })
  })

  describe('#has', function () {
    it('return true if the given value is in the heap', function () {
      const heap : Heap<number> = factory(32)
      const elements : number[] = [
         5, 10,  8,  3,  9,  7,  1,  4,  2,  0,
         6, 11, 13, 15, 19, 16, 22, 23, 30, 18
      ]

      for (let index = 0; index < 20; ++index) {
        expect(heap.has(elements[index])).toBeFalsy()
        heap.push(elements[index])
        expect(heap.has(elements[index])).toBeTruthy()
      }

      expect(heap.has(elements[10])).toBeTruthy()
      heap.delete(heap.indexOf(elements[10]))
      expect(heap.has(elements[10])).toBeFalsy()
    })
  })

  describe('#indexOf', function () {
    it('return the index of the given value of the heap', function () {
      const heap : Heap<number> = factory(32)
      const elements : number[] = [
         5, 10,  8,  3,  9,  7,  1,  4,  2,  0,
         6, 11, 13, 15, 19, 16, 22, 23, 30, 18
      ]

      for (let index = 0; index < 20; ++index) {
        expect(heap.indexOf(elements[index])).toBe(-1)
        heap.push(elements[index])
        expect(heap.get(heap.indexOf(elements[index]))).toBe(elements[index])
      }

      expect(heap.get(heap.indexOf(elements[10]))).toBe(elements[10])
      heap.delete(heap.indexOf(elements[10]))
      expect(heap.indexOf(elements[10])).toBe(-1)
    })
  })

  describe('#next', function () {
    it('removes the topmost value of the heap', function () {
      const heap : Heap<number> = factory(32)
      const elements : number[] = []
      const removed : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        heap.push(elements[index])
      }

      while (heap.size > 0) {
        removed.push(heap.next())
      }

      expect([...heap]).toEqual([])

      for (let element of removed) {
        elements.splice(elements.indexOf(element), 1)
      }

      expect(elements).toEqual([])

      for (let index = 0; index < removed.length - 1; ++index) {
        expect(
          heap.comparator(removed[index], removed[index + 1])
        ).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('#clear', function () {
    it('empty the heap', function () {
      const heap : Heap<number> = factory(32)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        heap.push(elements[index])
      }

      expect(heap.size).toBe(20)

      heap.clear()

      expect([...heap]).toEqual([])
    })
  })

  describe('#equals', function () {
    it('return true if both collections have the same content', function () {
      const heap : Heap<number> = factory(32)
      const copy : Heap<number> = factory(32)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        heap.push(elements[index])
        copy.push(elements[index])
      }

      expect(heap.equals(copy)).toBeTruthy()
    })

    it('return true if both collections have the same content but different capacities', function () {
      const heap : Heap<number> = factory(32)
      const copy : Heap<number> = factory(64)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        heap.push(elements[index])
        copy.push(elements[index])
      }

      expect(heap.equals(copy)).toBeTruthy()
    })

    it('return false if both collections does not have the same content', function () {
      const heap : Heap<number> = factory(32)
      const different : Heap<number> = factory(32)

      for (let index = 0; index < 20; ++index) {
        heap.push(Math.random())
        different.push(Math.random())
      }

      expect(heap.equals(different)).toBeFalsy()
    })

    it('return false if both collections does not have the same size', function () {
      const heap : Heap<number> = factory(32)
      const different : Heap<number> = factory(32)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        heap.push(elements[index])
        different.push(index == 5 ? Math.random() : elements[index])
      }

      different.push(Math.random())

      expect(heap.equals(different)).toBeFalsy()
    })

    it('return false otherwise', function () {
      const heap : Heap<number> = factory(32)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        heap.push(elements[index])
      }

      expect(heap.equals(null)).toBeFalsy()
      expect(heap.equals(5)).toBeFalsy()
      expect(heap.equals("warp")).toBeFalsy()
    })
  })

  describe('#copy', function () {
    it('return a copy of an existing heap', function () {
      const heap : Heap<number> = factory(32)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        heap.push(elements[index])
      }

      const copy : Heap<number> = heap.clone()

      expect(heap.equals(copy)).toBeTruthy()
    })
  })
}
