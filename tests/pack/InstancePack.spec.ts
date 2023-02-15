import { createFactoryDuplicator } from '../../sources/allocator/FactoryDuplicator'
import { range } from '../../sources/generator/range'
import { InstancePack } from '../../sources/pack/InstancePack'
import { createInstancePackFromValues } from '../../sources/pack/InstancePack'
import { createInstancePackFromIterator } from '../../sources/pack/InstancePack'
import { createInstancePackFromSequence } from '../../sources/pack/InstancePack'
import { createInstancePack } from '../../sources/pack/InstancePack'
import { Duplicator } from '../../sources/allocator/Duplicator'

class Integer {
  public value: number

  public constructor(value: number = 0) {
    this.value = value
  }

  public clear(): void {
    this.value = 0
  }

  public copy(toCopy: Integer): this {
    this.value = toCopy.value
    return this
  }

  public clone(): Integer {
    const result: Integer = new Integer()
    result.copy(this)
    return result
  }

  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Integer) {
      return other.value === this.value
    }

    return false
  }

  public toString(): string {
    return `${this.constructor.name} ${this.value}`
  }
}

function* wrap(...values: number[]): IterableIterator<Integer> {
  for (const value of values) {
    yield new Integer(value)
  }
}

function integerFactory(): Integer {
  return new Integer()
}

function compareIntegers(left: Integer, right: Integer): number {
  return left.value - right.value
}

const DUPLICATOR: Duplicator<Integer> = createFactoryDuplicator(integerFactory)

/**
 * 
 */
describe('pack/createInstancePackFromValues', function () {
  /**
   * 
   */
  it('returns a new array pack that contains the requested sequence of elements', function () {
    expect([...createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4))]).toEqual([...wrap(0, 1, 2, 3, 4)])
  })

  /**
   * 
   */
  it('returns an empty array pack if called with an empty sequence of elements', function () {
    expect([...createInstancePackFromValues(DUPLICATOR)]).toEqual([])
  })
})

/**
 * 
 */
describe('pack/createInstancePackFromIterator', function () {
  /**
   * 
   */
  it('returns a new array pack that contains the elements returned by the given iterator', function () {
    const pack = createInstancePackFromIterator(DUPLICATOR, wrap(0, 1, 2, 3, 4))
    expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4)])
  })

  /**
   * 
   */
  it('allows defining in advance the capacity to allocate to store the sequence defined by the given iterator', function () {
    const pack = createInstancePackFromIterator(DUPLICATOR,  wrap(0, 1, 2, 3, 4), 32)
    expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4)])
    expect(pack.capacity).toBe(32)
  })

  /**
   * 
   */
  it('will reallocate the pack until its current capacity is greater than or equal to the length of the given iterator', function () {
    const pack = createInstancePackFromIterator(DUPLICATOR,  wrap(...range(5)), 2)
    expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4)])
    expect(pack.capacity).toBeGreaterThanOrEqual(5)
  })
})

/**
   * 
   */
describe('pack/createInstancePackFromSequence', function () {
  /**
   * 
   */
  it('returns a shallow copy of a sequence', function () {
    const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
    const copy = createInstancePackFromSequence(DUPLICATOR, pack)

    for (let index = 0; index < pack.size; ++index) {
      expect(pack.get(index)).toEqual(copy.get(index))
      expect(pack.get(index)).not.toBe(copy.get(index))
    }

    expect(copy).not.toBe(pack)
  })

  /**
   * 
   */
  it('allows defining in advance the capacity of the resulting array pack', function () {
    const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
    const copy = createInstancePackFromSequence(DUPLICATOR, pack, 32)

    for (let index = 0; index < pack.size; ++index) {
      expect(pack.get(index)).toEqual(copy.get(index))
      expect(pack.get(index)).not.toBe(copy.get(index))
    }

    expect(copy.capacity).toBe(32)
  })

  /**
   * 
   */
  it('will reallocate the pack to the minimum valid capacity to fit the entire sequence to copy if necessary', function () {
    const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
    const copy = createInstancePackFromSequence(DUPLICATOR, pack, 2)

    for (let index = 0; index < pack.size; ++index) {
      expect(pack.get(index)).toEqual(copy.get(index))
      expect(pack.get(index)).not.toBe(copy.get(index))
    }

    expect(copy.capacity).toBe(4)
  })
})

/**
 * 
 */
describe('pack/createInstancePack', function () {
  /**
   * 
   */
  it('returns an empty array pack with the given capacity', function () {
    const pack = createInstancePack(DUPLICATOR, 32)

    expect([...pack]).toEqual([])
    expect(pack.capacity).toBe(32)
  })

  /**
   * 
   */
  it('returns an empty array pack with default capacity', function () {
    const pack = createInstancePack(DUPLICATOR)

    expect([...pack]).toEqual([])
    expect(pack.capacity).toBe(32)
  })
})

/**
 * 
 */
describe('pack/InstancePack', function () {
  /**
   * 
   */
  describe('#indexOf', function () {
    /**
     * 
     */
    it('returns the index of the first element equal to the searched one', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 1, 3, 2, 3, 4))

      expect(pack.indexOf(new Integer(0), compareIntegers)).toBe(0)
      expect(pack.indexOf(new Integer(1), compareIntegers)).toBe(1)
      expect(pack.indexOf(new Integer(2), compareIntegers)).toBe(2)
      expect(pack.indexOf(new Integer(3), compareIntegers)).toBe(4)
      expect(pack.indexOf(new Integer(4), compareIntegers)).toBe(7)
    })
    
    /**
     * 
     */
    it('returns a negative integer if the given value does not exist in the sequence', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4))

      expect(pack.indexOf(new Integer(10), compareIntegers)).toBeLessThan(0)
      expect(pack.indexOf(new Integer(-5), compareIntegers)).toBeLessThan(0)
      expect(pack.indexOf(new Integer(5), compareIntegers)).toBeLessThan(0)
    })

    /**
     * 
     */
    it('allows searching for an element in a given subsequence', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 1, 3, 2, 3, 4))

      expect(pack.indexOf(new Integer(0), compareIntegers, 2, 4)).toBeLessThan(0)
      expect(pack.indexOf(new Integer(1), compareIntegers, 2, 4)).toBe(3)
      expect(pack.indexOf(new Integer(2), compareIntegers, 2, 4)).toBe(2)
      expect(pack.indexOf(new Integer(3), compareIntegers, 2, 4)).toBeLessThan(0)
      expect(pack.indexOf(new Integer(4), compareIntegers, 2, 4)).toBeLessThan(0)
    })

    /**
     * 
     */
    it('allows defining the boundaries of a subsequence in any order', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 1, 3, 2, 3, 4))

      expect(pack.indexOf(new Integer(0), compareIntegers, 4, 2)).toBeLessThan(0)
      expect(pack.indexOf(new Integer(1), compareIntegers, 4, 2)).toBe(3)
      expect(pack.indexOf(new Integer(2), compareIntegers, 4, 2)).toBe(2)
      expect(pack.indexOf(new Integer(3), compareIntegers, 4, 2)).toBeLessThan(0)
      expect(pack.indexOf(new Integer(4), compareIntegers, 4, 2)).toBeLessThan(0)
    })

    /**
     * 
     */
    it('throws if the requested subsequence is out of the bounds of the collection', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 1, 3, 2, 3, 4))

      expect(() => pack.indexOf(new Integer(15), compareIntegers, -5, 4)).toThrow()
      expect(() => pack.indexOf(new Integer(-5), compareIntegers, 12, 4)).toThrow()
      expect(() => pack.indexOf(new Integer(-5), compareIntegers, 4, -5)).toThrow()
      expect(() => pack.indexOf(new Integer(-5), compareIntegers, 4, 12)).toThrow()
    })
  })

  /**
   * 
   */
  describe('#get', function () {
    /**
     * 
     */
    it('returns the element at the given index in the sequence', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4))

      for (let index = 0; index < 5; ++index) {
        expect(pack.get(index)).toEqual(new Integer(index))
      }
    })

    /**
     * 
     */
    it('throws if the requested index is out of the bounds of the sequence', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 5))

      expect(() => pack.get(15)).toThrow()
      expect(() => pack.get(-5)).toThrow()
    })
  })

  /**
     * 
     */
  describe('#get last', function () {
    /**
     * 
     */
    it('returns the last element of the sequence', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4))
      expect(pack.last).toEqual(new Integer(4))
    })

    /**
     * 
     */
    it('throws if the sequence is empty', function () {
      const pack = createInstancePackFromValues(DUPLICATOR)

      expect(() => pack.last).toThrow()
    })
  })

  /**
   * 
   */
  describe('#get first', function () {
    /**
     * 
     */
    it('returns the first element of the sequence', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4))
      expect(pack.first).toEqual(new Integer(0))
    })

    /**
     * 
     */
    it('throws if the sequence is empty', function () {
      const pack = createInstancePackFromValues(DUPLICATOR)
      expect(() => pack.first).toThrow()
    })
  })

  /**
   * 
   */
  describe('#reallocate', function () {
    /**
     * 
     */
    it('updates the capacity of the pack by reallocating it', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect(pack.capacity).toBe(4)

      pack.reallocate(8)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect(pack.capacity).toBe(8)

      pack.reallocate(16)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect(pack.capacity).toBe(16)

      pack.reallocate(8)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect(pack.capacity).toBe(8)

      pack.reallocate(4)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect(pack.capacity).toBe(4)
    })

    it('truncates the sequence to the requested capacity if its size exceeds it.', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5, 6, 7))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4, 5, 6, 7)])
      expect(pack.capacity).toBe(8)

      pack.reallocate(4)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect(pack.capacity).toBe(4)

      pack.reallocate(2)

      expect([...pack]).toEqual([...wrap(0, 1)])
      expect(pack.capacity).toBe(2)
    })
  })

  /**
   * 
   */
  describe('#fit', function () {
    /**
     * 
     */
    it('reallocates this pack to its current size', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect(pack.capacity).toBe(16)

      pack.fit()

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('#size', function () {
    /**
     * 
     */
    it('returns the number of elements in the collection', function () {
      expect(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3)).size).toBe(4)

      const pack = createInstancePack(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack.size).toBe(4)
    })

    /**
     * 
     */
    it('updates the number of elements in the list if wrote', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      pack.size = 8

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 0, 0, 0, 0)])
    })

    /**
     * 
     */
    it('reallocates the list if the new size exceeds its internal capacity', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.size = 8

      expect(pack.capacity).toBe(8)
    })
  })

  /**
   * 
   */
  describe('#pop', function () {
    /**
     * 
     */
    it('removes the last element of the list and returns it', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      expect(pack.pop()).toEqual(new Integer(3))

      expect([...pack]).toEqual([...wrap(0, 1, 2)])

      expect(pack.pop()).toEqual(new Integer(2))

      expect([...pack]).toEqual([...wrap(0, 1)])
    })

    /**
     * 
     */
    it('throws if the list is empty', function () {
      const pack = createInstancePackFromValues(DUPLICATOR)
      expect(() => pack.pop()).toThrow()
    })
  })

  /**
   * 
   */
  describe('#shift', function () {
    /**
     * 
     */
    it('removes the first element of the list and returns it', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      expect(pack.shift()).toEqual(new Integer(0))

      expect([...pack]).toEqual([...wrap(1, 2, 3)])

      expect(pack.shift()).toEqual(new Integer(1))

      expect([...pack]).toEqual([...wrap(2, 3)])
    })

    /**
     * 
     */
    it('throws if the list is empty', function () {
      const pack = createInstancePackFromValues(DUPLICATOR)
      expect(() => pack.shift()).toThrow()
    })
  })

  /**
   * 
   */
  describe('#swap', function () {
    /**
     * 
     */
    it('swaps two elements of the list', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      pack.swap(3, 0)

      expect([...pack]).toEqual([...wrap(3, 1, 2, 0)])
    })

    /**
     * 
     */
    it('throws if the first index is out of bounds', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(() => pack.swap(15, 0)).toThrow()
      expect(() => pack.swap(-5, 0)).toThrow()
    })

    /**
     * 
     */
    it('throws if the second index is out of bounds', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(() => pack.swap(0, 15)).toThrow()
      expect(() => pack.swap(0, -5)).toThrow()
    })
  })

  /**
   * 
   */
  describe('#set', function () {
    /**
     * 
     */
    it('updates an element of the list', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(8)

      pack.set(2, value)

      expect([...pack]).toEqual([...wrap(0, 1, 8, 3)])
      expect(pack.get(2)).not.toBe(value)
    })

    /**
     * 
     */
    it('expands the list if the element to update is out of its current bounds', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(8)

      pack.set(6, value)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 0, 0, 8)])
      expect(pack.get(6)).not.toBe(value)
    })

    /**
     * 
     */
    it('reallocates the list if the element to update is out of its current bounds', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect(pack.capacity).toBe(4)

      const value = new Integer(8)

      pack.set(6, value)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 0, 0, 8)])
      expect(pack.capacity).toBe(7)
      expect(pack.get(6)).not.toBe(value)
    })

    /**
     * 
     */
    it('throws if the given index is negative', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      expect(() => pack.set(-5, new Integer(8))).toThrow()
    })

    /**
     * 
     */
    it('updates a subsequence of the list', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(5)

      pack.set(1, 3, value)

      expect([...pack]).toEqual([...wrap(0, 5, 5, 3)])
      expect(pack.get(1)).not.toBe(value)
      expect(pack.get(2)).not.toBe(value)
    })

    /**
     * 
     */
    it('expands the list if the subsequence to update is out of its current bounds', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(5)
      pack.set(6, 8, value)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 0, 0, 5, 5)])
      expect(pack.get(6)).not.toBe(value)
      expect(pack.get(7)).not.toBe(value)
    })

    /**
     * 
     */
    it('reallocates the list if the subsequence update overflows its current capacity', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect(pack.capacity).toBe(4)

      const value = new Integer(5)
      pack.set(6, 8, value)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 0, 0, 5, 5)])
      expect(pack.capacity).toBe(8)
      expect(pack.get(6)).not.toBe(value)
      expect(pack.get(7)).not.toBe(value)
    })

    /**
     * 
     */
    it('allows its users to define the subsequence to update in any order', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(8)
      pack.set(3, 1, value)

      expect([...pack]).toEqual([...wrap(0, 8, 8, 3)])
      expect(pack.get(1)).not.toBe(value)
      expect(pack.get(2)).not.toBe(value)
    })

    /**
     * 
     */
    it('throws an error if startOrEnd is negative', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      expect(() => pack.set(-5, 3, new Integer(8))).toThrow()
    })

    /**
     * 
     */
    it('throws an error if endOrStart is negative', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      expect(() => pack.set(3, -5, new Integer(8))).toThrow()
    })
  })

  /**
   * 
   */
  describe('#sort', function () {
    /**
     * 
     */
    it('sorts the list', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(1, 3, 2, 0))

      expect([...pack]).toEqual([...wrap(1, 3, 2, 0)])

      pack.sort(compareIntegers)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
    })

    /**
     * 
     */
    it('allows sorting a subsequence of elements', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(3, 1, 2, 0, 7, 4, 6, 5, 8))

      expect([...pack]).toEqual([...wrap(3, 1, 2, 0, 7, 4, 6, 5, 8)])

      pack.sort(compareIntegers, 2, 7)

      expect([...pack]).toEqual([...wrap(3, 1, 0, 2, 4, 6, 7, 5, 8)])
    })

    /**
     * 
     */
    it('does nothing if the given boundaries define a valid empty sequence', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(3, 1, 2, 0, 7, 4, 6, 5, 8))

      expect([...pack]).toEqual([...wrap(3, 1, 2, 0, 7, 4, 6, 5, 8)])

      pack.sort(compareIntegers, 7, 7)

      expect([...pack]).toEqual([...wrap(3, 1, 2, 0, 7, 4, 6, 5, 8)])
    })

    /**
     * 
     */
    it('throws if the requested subsequence is out of the bounds of the collection', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(3, 1, 2, 0, 7, 4, 6, 5, 8))

      expect(() => pack.sort(compareIntegers, -5, 2)).toThrow()
      expect(() => pack.sort(compareIntegers, 2, -5)).toThrow()
      expect(() => pack.sort(compareIntegers, 2, 12)).toThrow()
      expect(() => pack.sort(compareIntegers, 12, 2)).toThrow()
    })
  })
  /**
   * 
   */
  describe('#insert', function () {
    /**
     * 
     */
    it('inserts a value at the given location in the sequence', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(8)
      pack.insert(1, value)

      expect([...pack]).toEqual([...wrap(0, 8, 1, 2, 3)])
      expect(pack.get(1)).not.toBe(value)
    })

    /**
     * 
     */
    it('expands the list if the insertion index is out of its current bounds', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(8)
      pack.insert(6, value)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 0, 0, 8)])
      expect(pack.get(6)).not.toBe(value)
    })

    /**
     * 
     */
    it('reallocates the list if its new size overflows its current capacity', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      const value = new Integer(8)
      pack.insert(6, value)

      expect(pack.capacity).toBe(7)
      expect(pack.get(6)).not.toBe(value)
    })

    /**
     * 
     */
    it('throws if the insertion index is negative', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      expect(() => pack.insert(-5, new Integer(8))).toThrow()
    })
  })

  /**
   * 
   */
  describe('#push', function () {
    /**
     * 
     */
    it('appends the given value at the end of the sequence', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(8)
      pack.push(value)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 8)])
      expect(pack.last).not.toBe(value)
    })

    /**
     * 
     */
    it('reallocates the list if its new size overflows its current capacity', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)
      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(8)
      pack.push(value)

      expect(pack.capacity).toBeGreaterThan(4)
      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 8)])
      expect(pack.last).not.toBe(value)
    })
  })

  /**
   * 
   */
  describe('#unshift', function () {
    /**
     * 
     */
    it('appends the given value at the beginning of the list', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(8)
      pack.unshift(value)

      expect([...pack]).toEqual([...wrap(8, 0, 1, 2, 3)])
      expect(pack.first).not.toBe(value)
    })

    /**
     * 
     */
    it('reallocates the list if its new size overflows its current capacity', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)
      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(8)
      pack.unshift(value)

      expect(pack.capacity).toBeGreaterThan(4)
      expect([...pack]).toEqual([...wrap(8, 0, 1, 2, 3)])
      expect(pack.first).not.toBe(value)
    })
  })

  /**
   * 
   */
  describe('#delete', function () {
    /**
     * 
     */
    it('removes the element at the given index in the list', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      pack.delete(1)

      expect([...pack]).toEqual([...wrap(0, 2, 3)])
    })

    /**
     * 
     */
    it('removes a subsequence of elements from the list', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      pack.delete(1, 3)

      expect([...pack]).toEqual([...wrap(0, 3)])
    })
    
    /**
     * 
     */
    it('allows defining the boundaries of the subsequence to remove in any order', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      pack.delete(3, 1)

      expect([...pack]).toEqual([...wrap(0, 3)])
    })

    /**
     * 
     */
    it('throws if the requested subsequence is out of the bounds of the collection', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(() => pack.delete(-5, 2)).toThrow()
      expect(() => pack.delete(2, -5)).toThrow()
      expect(() => pack.delete(2, 12)).toThrow()
      expect(() => pack.delete(12, 2)).toThrow()
    })
  })

  /**
   * 
   */
  describe('#warp', function () {
    /**
     * 
     */
    it('removes the element at the given index in the list', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      pack.warp(1)

      expect(pack.size).toBe(3)
      expect(pack.has(new Integer(0), compareIntegers)).toBeTruthy()
      expect(pack.has(new Integer(2), compareIntegers)).toBeTruthy()
      expect(pack.has(new Integer(3), compareIntegers)).toBeTruthy()
    })
    
    /**
     * 
     */
    it('removes a subsequence of elements from the list', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5, 6))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4, 5, 6)])

      pack.warp(1, 3)

      expect(pack.size).toBe(5)
      expect(pack.has(new Integer(0), compareIntegers)).toBeTruthy()
      expect(pack.has(new Integer(3), compareIntegers)).toBeTruthy()
      expect(pack.has(new Integer(4), compareIntegers)).toBeTruthy()
      expect(pack.has(new Integer(5), compareIntegers)).toBeTruthy()
      expect(pack.has(new Integer(6), compareIntegers)).toBeTruthy()
    })
    
    /**
     * 
     */
    it('allows defining the boundaries of the subsequence to remove in any order', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5, 6))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4, 5, 6)])

      pack.warp(3, 1)

      expect(pack.size).toBe(5)
      expect(pack.has(new Integer(0), compareIntegers)).toBeTruthy()
      expect(pack.has(new Integer(3), compareIntegers)).toBeTruthy()
      expect(pack.has(new Integer(4), compareIntegers)).toBeTruthy()
      expect(pack.has(new Integer(5), compareIntegers)).toBeTruthy()
      expect(pack.has(new Integer(6), compareIntegers)).toBeTruthy()
    })

    /**
     * 
     */
    it('throws if the requested subsequence is out of the bounds of the collection', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(() => pack.warp(-5, 2)).toThrow()
      expect(() => pack.warp(2, -5)).toThrow()
      expect(() => pack.warp(2, 12)).toThrow()
      expect(() => pack.warp(12, 2)).toThrow()
    })
  })

  /**
   * 
   */
  describe('#constructor', function () {
    /**
     * 
     */
    it('instantiates a new empty instance pack', function () {
      const pack = new InstancePack(DUPLICATOR)

      expect([...pack]).toEqual([])
      expect(pack.capacity).toBe(32)
      expect(pack.size).toBe(0)
    })

    /**
     * 
     */
    it('allows defining the capacity of the pack', function () {
      const pack = new InstancePack(DUPLICATOR, 16)

      expect([...pack]).toEqual([])
      expect(pack.capacity).toBe(16)
      expect(pack.size).toBe(0)
    })
  })

  /**
   * 
   */
  describe('#fill', function () {
    /**
     * 
     */
    it('updates all elements of the list to the given value', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      const value = new Integer(1)
      pack.fill(value)

      for (let index = 0; index < pack.size; ++index) {
        expect(pack.get(index)).toEqual(value)
        expect(pack.get(index)).not.toBe(value)
      }
    })
  })

  /**
   * 
   */
  describe('#concat', function () {
    /**
     * 
     */
    it('appends the content of the given sequence at the end of the list', function () {      
      const pack = createInstancePack(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])
      const rest = createInstancePackFromValues(DUPLICATOR, ...wrap(4, 5, 6, 7))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect([...rest]).toEqual([...wrap(4, 5, 6, 7)])

      pack.concat(rest)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4, 5, 6, 7)])
      expect([...rest]).toEqual([...wrap(4, 5, 6, 7)])

      for (let index = 0; index < rest.size; ++index) {
        expect(pack.get(4 + index)).not.toBe(rest.get(index))
      }
    })

    /**
     * 
     */
    it('reallocates the list if its new size overflows its current capacity', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      const rest = createInstancePackFromValues(DUPLICATOR, ...wrap(4, 5, 6, 7))

      expect(pack.capacity).toBe(4)
      expect(rest.capacity).toBe(4)
      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])
      expect([...rest]).toEqual([...wrap(4, 5, 6, 7)])

      pack.concat(rest)

      expect(pack.capacity).toBe(8)
      expect(rest.capacity).toBe(4)
      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4, 5, 6, 7)])
      expect([...rest]).toEqual([...wrap(4, 5, 6, 7)])

      for (let index = 0; index < rest.size; ++index) {
        expect(pack.get(4 + index)).not.toBe(rest.get(index))
      }
    })
  })

  /**
   * 
   */
  describe('#concatArray', function () {
    /**
     * 
     */
    it('Appends the content of the given array at the end of the list', function () {    
      const pack = createInstancePack(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      const rest = [...wrap(4, 5, 6, 7)]

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      pack.concatArray(rest)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4, 5, 6, 7)])

      for (let index = 0; index < rest.length; ++index) {
        expect(pack.get(4 + index)).not.toBe(rest[index])
      }
    })

    /**
     * 
     */
    it('reallocates the list if its new size overflows its current capacity', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      const rest = [...wrap(4, 5, 6, 7)]

      expect(pack.capacity).toBe(4)
      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      pack.concatArray(rest)

      expect(pack.capacity).toBe(8)
      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4, 5, 6, 7)])

      for (let index = 0; index < rest.length; ++index) {
        expect(pack.get(4 + index)).not.toBe(rest[index])
      }
    })
  })

  /**
   * 
   */
  describe('#copy', function () {
    /**
     * 
     */
    it('shallow copy an existing sequence', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      const toCopy = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5))

      expect([...pack]).toEqual([])
      expect([...toCopy]).toEqual([...wrap(0, 1, 2, 3, 4, 5)])

      pack.copy(toCopy)

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4, 5)])
      expect([...toCopy]).toEqual([...wrap(0, 1, 2, 3, 4, 5)])

      for (let index = 0; index < toCopy.size; ++index) {
        expect(pack.get(index)).not.toBe(toCopy.get(index))
      }
    })

    /**
     * 
     */
    it('shallow copy a subsequence of an existing sequence', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      const toCopy = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5))

      expect([...pack]).toEqual([])
      expect([...toCopy]).toEqual([...wrap(0, 1, 2, 3, 4, 5)])

      pack.copy(toCopy, 2, 5)

      expect([...pack]).toEqual([...wrap(2, 3, 4)])
      expect([...toCopy]).toEqual([...wrap(0, 1, 2, 3, 4, 5)])

      for (let index = 0; index < pack.size; ++index) {
        expect(pack.get(index)).not.toBe(toCopy.get(2 + index))
      }
    })

    /**
     * 
     */
    it('allows defining the boundaries of the subsequence to copy in any order', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      const toCopy = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5))

      expect([...pack]).toEqual([])
      expect([...toCopy]).toEqual([...wrap(0, 1, 2, 3, 4, 5)])

      pack.copy(toCopy, 5, 2)

      expect([...pack]).toEqual([...wrap(2, 3, 4)])
      expect([...toCopy]).toEqual([...wrap(0, 1, 2, 3, 4, 5)])

      for (let index = 0; index < pack.size; ++index) {
        expect(pack.get(index)).not.toBe(toCopy.get(2 + index))
      }
    })

    /**
     * 
     */
    it('reallocate the sequence to fit the content of the sequence to copy', function () {
      const pack = createInstancePack(DUPLICATOR, 4)
      const toCopy = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5, 6, 7))

      expect(pack.capacity).toBe(4)
      expect(toCopy.capacity).toBe(8)
      expect([...pack]).toEqual([])
      expect([...toCopy]).toEqual([...wrap(0, 1, 2, 3, 4, 5, 6, 7)])

      pack.copy(toCopy)

      expect(pack.capacity).toBe(8)
      expect(toCopy.capacity).toBe(8)
      expect([...pack]).toEqual([...wrap(0, 1, 2, 3, 4, 5, 6, 7)])
      expect([...toCopy]).toEqual([...wrap(0, 1, 2, 3, 4, 5, 6, 7)])

      for (let index = 0; index < pack.size; ++index) {
        expect(pack.get(index)).not.toBe(toCopy.get(index))
      }
    })

    /**
     * 
     */
    it('throws if the subsequence to copy is out of the bounds of the collection', function () {
      const pack = createInstancePack(DUPLICATOR, 16)
      const toCopy = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5))

      expect(() => pack.copy(toCopy, -5, 2)).toThrow()
      expect(() => pack.copy(toCopy, 2, -5)).toThrow()
      expect(() => pack.copy(toCopy, 2, 12)).toThrow()
      expect(() => pack.copy(toCopy, 12, 2)).toThrow()
    })
  })

  /**
   * 
   */
  describe('#clear', function () {
    /**
     * 
     */
    it('turn back the instance to its "default" state', function () {
      const pack = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect([...pack]).toEqual([...wrap(0, 1, 2, 3)])

      pack.clear()

      expect([...pack]).toEqual([])
    })
  })

  /**
   * 
   */
  describe('#equals', function () {
    /**
     * 
     */
    it('returns true if both instances are equals', function () {
      expect(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3)))).toBeTruthy()
    })

    /**
     * 
     */
    it('returns true for itself', function () {
      const instance = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(instance.equals(instance)).toBeTruthy()
    })

    /**
     * 
     */
    it('returns false if the size change', function () {
      expect(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5)))).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false if an element change', function () {
      expect(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 3, 3)))).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false for instances of other types', function () {
      expect(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(10)).toBeFalsy()
      expect(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals('test')).toBeFalsy()
      expect(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(new Date())).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false for null or undefined values', function () {
      expect(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(null)).toBeFalsy()
      expect(createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(undefined)).toBeFalsy()
    })
  })

  /**
   * 
   */
  describe('#allocate', function () {
    /**
     * 
     */
    it('allocates a new empty pack similar to the instance with the requested capacity', function () {
      const instance = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      const allocated = instance.allocate(25)

      expect(allocated).toBeInstanceOf(InstancePack)
      expect(allocated.size).toBe(0)
      expect(allocated.capacity).toBe(25)
    })
  })

  /**
   * 
   */
  describe('#defaultValue', function () {
    /**
     * 
     */
    it('returns a new default value', function () {
      const instance = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
     
      expect(instance.defaultValue()).toEqual(DUPLICATOR.allocate())
      expect(instance.defaultValue()).not.toBe(instance.defaultValue())
    })
  })

  /**
   * 
   */
  describe('#clone', function () {
    /**
     * 
     */
    it('returns a copy of the instance', function () {
      const instance = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      const copy = instance.clone()

      expect(copy.equals(instance)).toBeTruthy()
      expect(copy).not.toBe(instance)
      
      for (let index = 0; index < instance.size; ++index) {
        expect(instance.get(index)).not.toBe(copy.get(index))
      }
    })
  })

  /**
   * 
   */
  describe('#view', function () {
    /**
     * 
     */
    it('returns a readonly instance of the collection', function () {
      const instance = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      const view = instance.view()

      expect([...view]).toEqual([...instance])

      instance.set(5, new Integer(20))

      expect([...view]).toEqual([...instance])
    })
  })

  /**
   * 
   */
  describe('#forward', function () {
    /**
     * 
     */
    it('returns a forward iterator over this collection', function () {
      const instance = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      const cursor = instance.forward()

      expect(cursor.sequence).toBe(instance)
      expect(cursor.index).toBe(0)
      expect([...cursor]).toEqual([...instance])
    })
  })

  /**
   * 
   */
  describe('#stringify', function () {
    /**
     * 
     */
    it('returns a string representation of the collection', function () {
      const instance = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      expect(instance.stringify()).toBe('[Integer 0, Integer 1, Integer 2, Integer 3]')
    })
  })

  /**
   * 
   */
  describe('#toString', function () {
    /**
     * 
     */
    it('returns a string representation of the instance', function () {
      const instance = createInstancePackFromValues(DUPLICATOR, ...wrap(0, 1, 2, 3))
      expect(instance.toString()).toBe('InstancePack [Integer 0, Integer 1, Integer 2, Integer 3]')
    })
  })
})
