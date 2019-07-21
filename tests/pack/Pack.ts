/** eslint-env jest */

import { Pack } from '../../src/ts/pack/Pack'

import { pickUnique } from '../pickUnique'

interface PackConstructor<T> {
  readonly DEFAULT_VALUE : any

  new (capacity : number) : Pack<T>

  copy (toCopy : Pack<T>) : Pack<T>
}

export function isPack <T> (PackClass : PackConstructor<T>) {
  return {
    of (generator : () => T) {
      return buildSuite(PackClass, generator)
    }
  }
}

function buildSuite <T> (PackClass : PackConstructor<T>, generator : () => T) {
  describe('#constructor', function () {
    it('allows to instantiate an empty pack with an initial capacity', function () {
      const pack : Pack<T> = new PackClass(125)

      expect(pack.capacity).toBe(125)
      expect([...pack]).toEqual([])
    })
  })

  describe('#set size', function () {
    it('allows to expand the current size of the pack', function () {
      const pack : Pack<T> = new PackClass(10)

      expect([...pack]).toEqual([])
      expect(pack.size).toBe(0)

      pack.size = 3

      expect([...pack]).toEqual([
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE
      ])
      expect(pack.size).toBe(3)

      pack.size = 5

      expect([...pack]).toEqual([
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE
      ])
      expect(pack.size).toBe(5)

      pack.size = 3

      expect([...pack]).toEqual([
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE
      ])
      expect(pack.size).toBe(3)
    })

    it('expand the pack capacity if necessary', function () {
      const pack : Pack<T> = new PackClass(2)

      expect([...pack]).toEqual([])
      expect(pack.size).toBe(0)
      expect(pack.capacity).toBe(2)

      pack.size = 5

      expect([...pack]).toEqual([
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE
      ])

      expect(pack.size).toBe(5)
      expect(pack.capacity).toBe(5)
    })

    it('erase existing data', function () {
      const pack : Pack<T> = new PackClass(10)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 5; ++index) {
        elements[index] = generator()
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
        PackClass.DEFAULT_VALUE,
        PackClass.DEFAULT_VALUE
      ])
      expect(pack.size).toBe(5)
    })
  })

  describe('#reallocate', function () {
    it('allows to expand the current capacity of the pack', function () {
      const pack : Pack<T> = new PackClass(10)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 5; ++index) {
        elements[index] = generator()
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
      const pack : Pack<T> = new PackClass(110)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 5; ++index) {
        elements[index] = generator()
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
      const pack : Pack<T> = new PackClass(15)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 10; ++index) {
        elements[index] = generator()
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

  describe('#fit', function () {
    it('reduce the pack capacity to its size', function () {
      const pack : Pack<T> = new PackClass(110)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 5; ++index) {
        elements[index] = generator()
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

  describe('#isCollection', function () {
    it('returns true', function () {
      const pack : Pack<T> = new PackClass(110)

      expect(pack.isCollection).toBeTruthy()
    })
  })

  describe('#get', function () {
    it('returns the nth element of the pack', function () {
      const pack : Pack<T> = new PackClass(110)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
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
      const pack : Pack<T> = new PackClass(110)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
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
      const pack : Pack<T> = new PackClass(110)
      const elements : Array<T> = new Array()

      pack.size = 20

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.set(index, elements[index])
      }

      expect([...pack]).toEqual(elements)
    })

    it('can expand the size and the capacity of the pack', function () {
      const pack : Pack<T> = new PackClass(5)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.set(index * 5, elements[index])
      }

      expect(pack.size).toBe(5 * 19 + 1)
      expect(pack.capacity).toBe(5 * 19 + 1)

      for (let index = 0; index < 19 * 5 + 1; ++index) {
        if (index % 5 == 0) {
          expect(pack.get(index)).toBe(elements[index / 5])
        } else {
          expect(pack.get(index)).toBe(PackClass.DEFAULT_VALUE)
        }
      }
    })
  })

  describe('#insert', function () {
    it('insert a value into the pack', function () {
      const pack : Pack<T> = new PackClass(30)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.set(index, elements[index])
      }

      expect([...pack]).toEqual(elements)

      const inserted : T = generator()

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
      const pack : Pack<T> = new PackClass(20)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.set(index, elements[index])
      }

      expect([...pack]).toEqual(elements)

      const inserted : T = generator()

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
      const pack : Pack<T> = new PackClass(20)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.set(index, elements[index])
      }

      expect([...pack]).toEqual(elements)

      const inserted : T = generator()

      pack.insert(30, inserted)

      for (let index = 0; index < 20; ++index) {
        expect(pack.get(index)).toBe(elements[index])
      }

      for (let index = 20; index < 29; ++index) {
        expect(pack.get(index)).toBe(PackClass.DEFAULT_VALUE)
      }

      expect(pack.get(30)).toBe(inserted)

      expect(pack.size).toBe(31)
      expect(pack.capacity).toBe(31)
    })
  })

  describe('#push', function () {
    it('insert a value at the end of the pack', function () {
      const pack : Pack<T> = new PackClass(30)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(pack.size).toBe(20)
      expect(pack.capacity).toBe(30)
    })

    it('may reallocate the pack if necessary', function () {
      const pack : Pack<T> = new PackClass(5)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.set(index, elements[index])
      }

      expect([...pack]).toEqual(elements)
      expect(pack.size).toBe(20)
      expect(pack.capacity).toBe(20)
    })
  })

  describe('#delete', function () {
    it('delete a value of the pack', function () {
      const pack : Pack<T> = new PackClass(30)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
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
      const pack : Pack<T> = new PackClass(30)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
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
      const pack : Pack<T> = new PackClass(30)
      const elements : Array<T> = pickUnique(generator, 20)

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
      const pack : Pack<T> = new PackClass(30)
      const elements : Array<T> = pickUnique(generator, 20)

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

  describe('#clear', function () {
    it('empty the pack', function () {
      const pack : Pack<T> = new PackClass(30)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.push(elements[index])
      }

      expect([...pack]).toEqual(elements)

      pack.clear()

      expect([...pack]).toEqual([])
    })
  })

  describe('#equals', function () {
    it('return true if both collections have the same content', function () {
      const pack : Pack<T> = new PackClass(30)
      const copy : Pack<T> = new PackClass(30)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.push(elements[index])
        copy.push(elements[index])
      }

      expect(pack.equals(copy)).toBeTruthy()
    })

    it('return true if both collections have the same content but different capacities', function () {
      const pack : Pack<T> = new PackClass(30)
      const copy : Pack<T> = new PackClass(60)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.push(elements[index])
        copy.push(elements[index])
      }

      expect(pack.equals(copy)).toBeTruthy()
    })

    it('return false if both collections does not have the same content', function () {
      const pack : Pack<T> = new PackClass(30)
      const different : Pack<T> = new PackClass(30)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.push(elements[index])
        different.push(index == 5 ? generator() : elements[index])
      }

      expect(pack.equals(different)).toBeFalsy()
    })

    it('return false if both collections does not have the same size', function () {
      const pack : Pack<T> = new PackClass(30)
      const different : Pack<T> = new PackClass(30)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.push(elements[index])
        different.push(index == 5 ? generator() : elements[index])
      }

      different.push(generator())

      expect(pack.equals(different)).toBeFalsy()
    })

    it('return false otherwise', function () {
      const pack : Pack<T> = new PackClass(30)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.push(elements[index])
      }

      expect(pack.equals(null)).toBeFalsy()
      expect(pack.equals(5)).toBeFalsy()
      expect(pack.equals("warp")).toBeFalsy()
    })
  })

  describe('#copy', function () {
    it('return a copy of an existing pack', function () {
      const pack : Pack<T> = new PackClass(30)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = generator()
        pack.push(elements[index])
      }

      const copy : Pack<T> = PackClass.copy(pack)

      expect(pack.equals(copy)).toBeTruthy()
      expect(copy.capacity).toBe(pack.capacity)
    })
  })
}
