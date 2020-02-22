/** eslint-env jest */

import { Pack } from '../../src/pack/Pack'

type PackFactory<T> = (capacity : number) => Pack<T>

export function isPack(instantiate : PackFactory<number>) : void{
  describe('#constructor', function () {
    it('allows to instantiate an empty pack with an initial capacity', function () {
      const pack : Pack<number> = instantiate(125)

      expect(pack.capacity).toBe(125)
      expect([...pack]).toEqual([])
    })
  })

  describe('#set size', function () {
    it('allows to expand the current size of the pack', function () {
      const pack : Pack<number> = instantiate(10)

      expect([...pack]).toEqual([])
      expect(pack.size).toBe(0)

      pack.size = 3

      expect([...pack]).toEqual([
        Pack.defaultValue(pack),
        Pack.defaultValue(pack),
        Pack.defaultValue(pack)
      ])
      expect(pack.size).toBe(3)

      pack.size = 5

      expect([...pack]).toEqual([
        Pack.defaultValue(pack),
        Pack.defaultValue(pack),
        Pack.defaultValue(pack),
        Pack.defaultValue(pack),
        Pack.defaultValue(pack)
      ])
      expect(pack.size).toBe(5)

      pack.size = 3

      expect([...pack]).toEqual([
        Pack.defaultValue(pack),
        Pack.defaultValue(pack),
        Pack.defaultValue(pack)
      ])
      expect(pack.size).toBe(3)
    })

    it('expand the pack capacity if necessary', function () {
      const pack : Pack<number> = instantiate(2)

      expect([...pack]).toEqual([])
      expect(pack.size).toBe(0)
      expect(pack.capacity).toBe(2)

      pack.size = 5

      expect([...pack]).toEqual([
        Pack.defaultValue(pack),
        Pack.defaultValue(pack),
        Pack.defaultValue(pack),
        Pack.defaultValue(pack),
        Pack.defaultValue(pack)
      ])

      expect(pack.size).toBe(5)
      expect(pack.capacity).toBe(5)
    })

    it('erase existing data', function () {
      const pack : Pack<number> = instantiate(10)
      const elements : number[] = []

      for (let index = 0; index < 5; ++index) {
        elements[index] = Math.random()
      }

      expect([...pack]).toEqual([])
      expect(pack.size).toBe(0)

      pack.size = 5

      for (let index = 0; index < 5; ++index) {
        pack.set(index, elements[index])
      }

      pack.size = 3
      pack.size = 5

      expect([...pack]).toEqual([
        elements[0],
        elements[1],
        elements[2],
        Pack.defaultValue(pack),
        Pack.defaultValue(pack)
      ])
      expect(pack.size).toBe(5)
    })
  })

  describe('#reallocate', function () {
    it('allows to expand the current capacity of the pack', function () {
      const pack : Pack<number> = instantiate(10)
      const elements : number[] = []

      for (let index = 0; index < 5; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(pack.capacity).toBe(10)
      expect(pack.size).toBe(5)

      pack.reallocate(15)

      expect([...pack]).toEqual(elements)
      expect(pack.capacity).toBe(15)
      expect(pack.size).toBe(5)

      pack.reallocate(32)

      expect([...pack]).toEqual(elements)
      expect(pack.capacity).toBe(32)
      expect(pack.size).toBe(5)
    })

    it('reduce the pack capacity', function () {
      const pack : Pack<number> = instantiate(110)
      const elements : number[] = []

      for (let index = 0; index < 5; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(pack.capacity).toBe(110)
      expect(pack.size).toBe(5)

      pack.reallocate(32)

      expect([...pack]).toEqual(elements)
      expect(pack.capacity).toBe(32)
      expect(pack.size).toBe(5)

      pack.reallocate(15)

      expect([...pack]).toEqual(elements)
      expect(pack.capacity).toBe(15)
      expect(pack.size).toBe(5)
    })

    it('may truncate the pack content', function () {
      const pack : Pack<number> = instantiate(15)
      const elements : number[] = []

      for (let index = 0; index < 10; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(pack.capacity).toBe(15)
      expect(pack.size).toBe(10)

      pack.reallocate(5)

      expect([...pack]).toEqual([
        elements[0], elements[1], elements[2], elements[3], elements[4]
      ])
      expect(pack.capacity).toBe(5)
      expect(pack.size).toBe(5)

      pack.reallocate(2)

      expect([...pack]).toEqual([ elements[0], elements[1] ])
      expect(pack.capacity).toBe(2)
      expect(pack.size).toBe(2)
    })
  })

  describe('#sort', function () {
    it('sort the elements of the pack', function () {
      const pack : Pack<number> = instantiate(256)
      const elements : number[] = []

      for (let index = 0; index < 128; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(pack.capacity).toBe(256)
      expect(pack.size).toBe(128)

      pack.sort(function (a : any, b : any) : number {
        return a < b ? -1 : (a > b ? 1 : 0)
      })
      elements.sort(function (a : any, b : any) : number {
        return a < b ? -1 : (a > b ? 1 : 0)
      })

      expect([...pack]).toEqual(elements)
      expect(pack.capacity).toBe(256)
      expect(pack.size).toBe(128)
    })
  })

  describe('#fit', function () {
    it('reduce the pack capacity to its size', function () {
      const pack : Pack<number> = instantiate(110)
      const elements : number[] = []

      for (let index = 0; index < 5; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(pack.capacity).toBe(110)
      expect(pack.size).toBe(5)

      pack.fit()

      expect([...pack]).toEqual(elements)
      expect(pack.capacity).toBe(5)
      expect(pack.size).toBe(5)
    })
  })

  describe('#get', function () {
    it('returns the nth element of the pack', function () {
      const pack : Pack<number> = instantiate(110)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)

      for (let index = 0; index < 20; ++index) {
        expect(pack.get(index)).toBe(elements[index])
      }
    })
  })

  describe('#swap', function () {
    it('swap two elements of the pack', function () {
      const pack : Pack<number> = instantiate(110)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)

      pack.swap(3, 8)

      for (let index = 0; index < 20; ++index) {
        expect(pack.get(index)).toBe(
          index == 3 ? elements[8] : (
            index == 8 ? elements[3] : elements[index]
          )
        )
      }
    })
  })

  describe('#set', function () {
    it('set a value of the pack', function () {
      const pack : Pack<number> = instantiate(110)
      const elements : number[] = []

      pack.size = 20

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.set(index, elements[index])
      }

      expect([...pack]).toEqual(elements)
    })

    it('can expand the size and the capacity of the pack', function () {
      const pack : Pack<number> = instantiate(5)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.set(index * 5, elements[index])
      }

      expect(pack.size).toBe(5 * 19 + 1)
      expect(pack.capacity).toBe(5 * 19 + 1)

      for (let index = 0; index < 19 * 5 + 1; ++index) {
        if (index % 5 == 0) {
          expect(pack.get(index)).toBe(elements[index / 5])
        } else {
          expect(pack.get(index)).toBe(Pack.defaultValue(pack))
        }
      }
    })
  })

  describe('#insert', function () {
    it('insert a value into the pack', function () {
      const pack : Pack<number> = instantiate(30)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.set(index, elements[index])
      }

      expect([...pack]).toEqual(elements)

      const inserted : number = Math.random()

      pack.insert(8, inserted)

      for (let index = 0; index < 8; ++index) {
        expect(pack.get(index)).toBe(elements[index])
      }

      expect(pack.get(8)).toBe(inserted)

      for (let index = 9; index < 21; ++index) {
        expect(pack.get(index)).toBe(elements[index - 1])
      }

      expect(pack.size).toBe(21)
    })

    it('may reallocate the pack if necessary', function () {
      const pack : Pack<number> = instantiate(20)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.set(index, elements[index])
      }

      expect([...pack]).toEqual(elements)

      const inserted : number = Math.random()

      pack.insert(8, inserted)

      for (let index = 0; index < 8; ++index) {
        expect(pack.get(index)).toBe(elements[index])
      }

      expect(pack.get(8)).toBe(inserted)

      for (let index = 9; index < 21; ++index) {
        expect(pack.get(index)).toBe(elements[index - 1])
      }

      expect(pack.size).toBe(21)
      expect(pack.capacity).toBe(21)
    })

    it('only set the value if the index is out of the size of the pack', function () {
      const pack : Pack<number> = instantiate(20)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.set(index, elements[index])
      }

      expect([...pack]).toEqual(elements)

      const inserted : number = Math.random()

      pack.insert(30, inserted)

      for (let index = 0; index < 20; ++index) {
        expect(pack.get(index)).toBe(elements[index])
      }

      for (let index = 20; index < 29; ++index) {
        expect(pack.get(index)).toBe(Pack.defaultValue(pack))
      }

      expect(pack.get(30)).toBe(inserted)

      expect(pack.size).toBe(31)
      expect(pack.capacity).toBe(31)
    })
  })

  describe('#push', function () {
    it('insert a value at the end of the pack', function () {
      const pack : Pack<number> = instantiate(30)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(pack.size).toBe(20)
      expect(pack.capacity).toBe(30)
    })

    it('may reallocate the pack if necessary', function () {
      const pack : Pack<number> = instantiate(5)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.set(index, elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(pack.size).toBe(20)
      expect(pack.capacity).toBe(20)
    })
  })

  describe('#delete', function () {
    it('delete a value of the pack', function () {
      const pack : Pack<number> = instantiate(30)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(pack.size).toBe(20)
      expect(pack.capacity).toBe(30)

      pack.delete(5)

      for (let index = 0; index < 5; ++index) {
        expect(pack.get(index)).toBe(elements[index])
      }

      for (let index = 5; index < 19; ++index) {
        expect(pack.get(index)).toBe(elements[index + 1])
      }

      expect(pack.size).toBe(19)
      expect(pack.capacity).toBe(30)
    })
  })

  describe('#warp', function () {
    it('warp a value of the pack', function () {
      const pack : Pack<number> = instantiate(30)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(pack.size).toBe(20)
      expect(pack.capacity).toBe(30)

      pack.warp(5)

      for (let index = 0; index < 5; ++index) {
        expect(pack.get(index)).toBe(elements[index])
      }

      expect(pack.get(5)).toBe(elements[elements.length - 1])

      for (let index = 6; index < 19; ++index) {
        expect(pack.get(index)).toBe(elements[index])
      }

      expect(pack.size).toBe(19)
      expect(pack.capacity).toBe(30)
    })
  })

  describe('#has', function () {
    it('return true if the given value is in the pack', function () {
      const pack : Pack<number> = instantiate(30)
      const elements : number[] = [
         5, 10,  8,  3,  9,  7,  1,  4,  2,  0,
         6, 11, 13, 15, 19, 16, 22, 23, 30, 18
      ]

      for (let index = 0; index < 20; ++index) {
        expect(pack.has(elements[index])).toBeFalsy()
        pack.push(elements[index])
        expect(pack.has(elements[index])).toBeTruthy()
      }

      pack.size = 15

      for (let index = 15; index < 20; ++index) {
        expect(pack.has(elements[index])).toBeFalsy()
      }
    })
  })

  describe('#indexOf', function () {
    it('return the index of the given value of the pack', function () {
      const pack : Pack<number> = instantiate(30)
      const elements : number[] = [
         5, 10,  8,  3,  9,  7,  1,  4,  2,  0,
         6, 11, 13, 15, 19, 16, 22, 23, 30, 18
      ]

      for (let index = 0; index < 20; ++index) {
        expect(pack.indexOf(elements[index])).toBe(-1)
        pack.push(elements[index])
        expect(pack.indexOf(elements[index])).toBe(index)
      }

      pack.size = 15

      for (let index = 15; index < 20; ++index) {
        expect(pack.indexOf(elements[index])).toBe(-1)
      }
    })
  })

  describe('#pop', function () {
    it('removes the last value of the pack and return it', function () {
      const pack : Pack<number> = instantiate(30)
      const elements : number[] = []
      const removed : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(removed).toEqual([])

      while (pack.size > 0) {
        removed.push(pack.pop())
      }

      expect([...pack]).toEqual([])
      expect(removed).toEqual(elements.reverse())
    })
  })

  describe('#shift', function () {
    it('removes the first value of the pack and return it', function () {
      const pack : Pack<number> = instantiate(30)
      const elements : number[] = []
      const removed : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(removed).toEqual([])

      while (pack.size > 0) {
        removed.push(pack.shift())
      }

      expect([...pack]).toEqual([])
      expect(removed).toEqual(elements)
    })
  })

  describe('#clear', function () {
    it('empty the pack', function () {
      const pack : Pack<number> = instantiate(30)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)

      pack.clear()

      expect([...pack]).toEqual([])
    })
  })

  describe('#equals', function () {
    it('return true if both collections have the same content', function () {
      const pack : Pack<number> = instantiate(30)
      const copy : Pack<number> = instantiate(30)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
        copy.push(elements[index])
      }

      expect(pack.equals(copy)).toBeTruthy()
    })

    it('return true if both collections have the same content but different capacities', function () {
      const pack : Pack<number> = instantiate(30)
      const copy : Pack<number> = instantiate(60)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
        copy.push(elements[index])
      }

      expect(pack.equals(copy)).toBeTruthy()
    })

    it('return false if both collections does not have the same content', function () {
      const pack : Pack<number> = instantiate(30)
      const different : Pack<number> = instantiate(30)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
        different.push(index == 5 ? Math.random() : elements[index])
      }

      expect(pack.equals(different)).toBeFalsy()
    })

    it('return false if both collections does not have the same size', function () {
      const pack : Pack<number> = instantiate(30)
      const different : Pack<number> = instantiate(30)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
        different.push(index == 5 ? Math.random() : elements[index])
      }

      different.push(Math.random())

      expect(pack.equals(different)).toBeFalsy()
    })

    it('return false otherwise', function () {
      const pack : Pack<number> = instantiate(30)
      const elements : number[] = []

      for (let index = 0; index < 20; ++index) {
        elements[index] = Math.random()
        pack.push(elements[index])
      }

      expect(pack.equals(null)).toBeFalsy()
      expect(pack.equals(5)).toBeFalsy()
      expect(pack.equals("warp")).toBeFalsy()
    })
  })

  describe('#copy', function () {
    it('copy an existing pack', function () {
      const source : Pack<number> = instantiate(30)
      const destination : Pack<number> = instantiate(30)

      for (let index = 0; index < 20; ++index) {
        source.push(Math.random())
      }

      destination.copy(source)

      expect(source.equals(destination)).toBeTruthy()
      expect(destination).not.toBe(source)
    })
  })

  describe('#clone', function () {
    it('return a copy of the pack', function () {
      const source : Pack<number> = instantiate(30)

      for (let index = 0; index < 20; ++index) {
        source.push(Math.random())
      }

      const destination : Pack<number> = source.clone()

      expect(source.equals(destination)).toBeTruthy()
      expect(destination).not.toBe(source)
    })
  })
}
