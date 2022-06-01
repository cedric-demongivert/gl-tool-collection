import { Assignable, Clearable, Comparator, Empty } from '@cedric-demongivert/gl-tool-utils'
import { zeros } from '../../sources/generators/zeros'
import { nulls } from '../../sources/generators/nulls'
import { range } from '../../sources/generators/range'
import { InstancePack } from '../../sources/sequence/InstancePack'

import '../matchers'
import { Duplicator } from '../../sources/allocator'

const values: number[] = []

values.length = 15

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

const DUPLICATOR: Duplicator<Integer> = Duplicator.fromFactory(integerFactory)

/**
 * 
 */
describe('sequence/InstancePack', function () {
  /**
   * 
   */
  describe('of', function () {
    /**
     * 
     */
    it('returns an instance filled with the given elements', function () {
      expect(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3, 4))).toEqualSequence(...wrap(0, 1, 2, 3, 4))
    })

    /**
     * 
     */
    it('returns an empty instance', function () {
      expect(InstancePack.of(DUPLICATOR,)).toEqualSequence()
    })
  })

  /**
   * 
   */
  describe('ofIterator', function () {
    /**
     * 
     */
    it('returns an instance filled with the content of the given iterator', function () {
      expect(InstancePack.ofIterator(DUPLICATOR, wrap(...range(5)))).toEqualSequence(...wrap(0, 1, 2, 3, 4))
    })

    /**
     * 
     */
    it('allows to specify the capacity to allocate', function () {
      expect(InstancePack.ofIterator(DUPLICATOR, wrap(...range(5)), 32).capacity).toBe(32)
    })
  })

  /**
   * 
   */
  describe('copy', function () {
    /**
     * 
     */
    it('copy a given sequence', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(InstancePack.copy(pack, DUPLICATOR)).toEqualSequence(...wrap(0, 1, 2, 3))
      expect(InstancePack.copy(pack, DUPLICATOR)).not.toBe(pack)
    })

    /**
     * 
     */
    it('allows to define a capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(InstancePack.copy(pack, DUPLICATOR, 32).capacity).toBe(32)
    })
  })

  /**
   * 
   */
  describe('allocate', function () {
    /**
     * 
     */
    it('creates an empty instance', function () {
      expect(InstancePack.allocate(DUPLICATOR, 32)).toEqualSequence()
    })

    /**
     * 
     */
    it('allows to define a capacity', function () {
      expect(InstancePack.allocate(DUPLICATOR, 32).capacity).toBe(32)
    })
  })

  /**
   * 
   */
  describe('prototype.reallocate', function () {
    /**
     * 
     */
    it('expands the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))
      expect(pack.capacity).toBe(4)

      pack.reallocate(8)

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))
      expect(pack.capacity).toBe(8)

      pack.reallocate(16)

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))
      expect(pack.capacity).toBe(16)
    })

    /**
     * 
     */
    it('reduces the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))
      expect(pack.capacity).toBe(16)

      pack.reallocate(8)

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))
      expect(pack.capacity).toBe(8)

      pack.reallocate(4)

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))
      expect(pack.capacity).toBe(4)
    })

    it('truncates the content', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5, 6, 7))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3, 4, 5, 6, 7))
      expect(pack.capacity).toBe(8)

      pack.reallocate(4)

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))
      expect(pack.capacity).toBe(4)

      pack.reallocate(2)

      expect(pack).toEqualSequence(...wrap(0, 1))
      expect(pack.capacity).toBe(2)
    })
  })

  /**
   * 
   */
  describe('prototype.fit', function () {
    /**
     * 
     */
    it('reduces the capacity to the size', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))
      expect(pack.capacity).toBe(16)

      pack.fit()

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))
      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.size', function () {
    /**
     * 
     */
    it('returns the number of elements', function () {
      expect(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3)).size).toBe(4)

      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack.size).toBe(4)
    })

    /**
     * 
     */
    it('updates the number of elements', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.size = 8

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3, ...zeros(4)))
    })

    /**
     * 
     */
    it('may reallocate', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.size = 8

      expect(pack.capacity).toBe(8)
    })
  })

  /**
   * 
   */
  describe('prototype.pop', function () {
    /**
     * 
     */
    it('does not updates the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack.capacity).toBe(16)

      pack.pop()

      expect(pack.capacity).toBe(16)

      pack.pop()

      expect(pack.capacity).toBe(16)
    })

    /**
     * 
     */
    it('removes the last element', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.pop()

      expect(pack).toEqualSequence(...wrap(0, 1, 2))

      pack.pop()

      expect(pack).toEqualSequence(...wrap(0, 1))
    })

    /**
     * 
     */
    it('returns the removed element', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.pop().value).toBe(3)
      expect(pack.pop().value).toBe(2)
      expect(pack.pop().value).toBe(1)
      expect(pack.pop().value).toBe(0)
    })
  })

  /**
   * 
   */
  describe('prototype.shift', function () {
    /**
     * 
     */
    it('does not updates the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack.capacity).toBe(16)

      pack.shift()

      expect(pack.capacity).toBe(16)

      pack.shift()

      expect(pack.capacity).toBe(16)
    })

    /**
     * 
     */
    it('removes the first element', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.shift()

      expect(pack).toEqualSequence(...wrap(1, 2, 3))

      pack.shift()

      expect(pack).toEqualSequence(...wrap(2, 3))
    })

    /**
     * 
     */
    it('returns the removed element', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.shift().value).toBe(0)
      expect(pack.shift().value).toBe(1)
      expect(pack.shift().value).toBe(2)
      expect(pack.shift().value).toBe(3)
    })
  })

  /**
   * 
   */
  describe('prototype.swap', function () {
    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack.capacity).toBe(16)

      pack.swap(2, 3)

      expect(pack.capacity).toBe(16)

      pack.swap(0, 1)

      expect(pack.capacity).toBe(16)
    })

    /**
     * 
     */
    it('swap two elements', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.swap(3, 0)

      expect(pack).toEqualSequence(...wrap(3, 1, 2, 0))
    })
  })

  /**
   * 
   */
  describe('prototype.set', function () {
    /**
     * 
     */
    it('replaces an element', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.set(2, new Integer(8))

      expect(pack).toEqualSequence(...wrap(0, 1, 8, 3))
    })

    /**
     * 
     */
    it('defines an element', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.set(7, new Integer(8))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3, 0, 0, 0, 8))
    })

    /**
     * 
     */
    it('does not update the capacity when it replaces', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.set(2, new Integer(8))

      expect(pack.capacity).toBe(4)
    })

    /**
     * 
     */
    it('may reallocate', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.set(7, new Integer(8))

      expect(pack.capacity).toBe(8)
    })
  })

  /**
   * 
   */
  describe('prototype.setMany', function () {
    /**
     * 
     */
    it('replaces many elements', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.setMany(1, 2, new Integer(8))

      expect(pack).toEqualSequence(...wrap(0, 8, 8, 3))
    })

    /**
     * 
     */
    it('defines many elements', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.setMany(5, 3, new Integer(8))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3, 0, 8, 8, 8))
    })

    /**
     * 
     */
    it('does not update the capacity when it replaces', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.setMany(1, 2, new Integer(8))

      expect(pack.capacity).toBe(4)
    })

    /**
     * 
     */
    it('may reallocate', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.setMany(5, 3, new Integer(8))

      expect(pack.capacity).toBe(8)
    })
  })

  /**
   * 
   */
  describe('prototype.sort', function () {
    /**
     * 
     */
    it('sorts', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(1, 3, 2, 0))

      expect(pack).toEqualSequence(...wrap(1, 3, 2, 0))

      pack.sort(compareIntegers)

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(1, 3, 2, 0))

      expect(pack.capacity).toBe(4)

      pack.sort(compareIntegers)

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.subsort', function () {
    /**
     * 
     */
    it('sorts a subsequence', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(1, 3, 2, 0, 7, 4, 6, 8, 5))

      expect(pack).toEqualSequence(...wrap(1, 3, 2, 0, 7, 4, 6, 8, 5))

      pack.subsort(2, 5, compareIntegers)

      expect(pack).toEqualSequence(...wrap(1, 3, 0, 2, 4, 6, 7, 8, 5))
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(1, 3, 2, 0, 7, 4, 6, 8, 5))

      expect(pack.capacity).toBe(9)

      pack.subsort(2, 5, compareIntegers)

      expect(pack.capacity).toBe(9)
    })
  })

  /**
   * 
   */
  describe('prototype.insert', function () {
    /**
     * 
     */
    it('inserts an element', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 8)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.insert(1, new Integer(8))

      expect(pack).toEqualSequence(...wrap(0, 8, 1, 2, 3))
    })

    /**
     * 
     */
    it('defines an element', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 8)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.insert(5, new Integer(8))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3, 0, 8))
    })

    /**
     * 
     */
    it('does not update the capacity when the insertion does not overflow', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 8)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack.capacity).toBe(8)

      pack.insert(1, new Integer(8))

      expect(pack.capacity).toBe(8)
    })

    /**
     * 
     */
    it('updates the capacity if the insertion overflows', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.insert(1, new Integer(8))

      expect(pack.capacity).toBeGreaterThan(4)
    })
  })

  /**
   * 
   */
  describe('prototype.push', function () {
    /**
     * 
     */
    it('add an element at the end', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 8)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.push(new Integer(8))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3, 8))
    })

    /**
     * 
     */
    it('does not update the capacity if the insertion does not overflow', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 8)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack.capacity).toBe(8)

      pack.push(new Integer(8))

      expect(pack.capacity).toBe(8)
    })

    /**
     * 
     */
    it('updates the capacity if the insertion overflows', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.push(new Integer(8))

      expect(pack.capacity).toBeGreaterThan(4)
    })
  })

  /**
   * 
   */
  describe('prototype.unshift', function () {
    /**
     * 
     */
    it('add an element at the start', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 8)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.unshift(new Integer(8))

      expect(pack).toEqualSequence(...wrap(8, 0, 1, 2, 3))
    })

    /**
     * 
     */
    it('does not update the capacity if the insertion does not overflow', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 8)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack.capacity).toBe(8)

      pack.unshift(new Integer(8))

      expect(pack.capacity).toBe(8)
    })

    /**
     * 
     */
    it('updates the capacity if the insertion overflows', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.unshift(new Integer(8))

      expect(pack.capacity).toBeGreaterThan(4)
    })
  })

  /**
   * 
   */
  describe('prototype.delete', function () {
    /**
     * 
     */
    it('removes an element', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.delete(1)

      expect(pack).toEqualSequence(...wrap(0, 2, 3))
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.delete(1)

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.deleteMany', function () {
    /**
     * 
     */
    it('removes many elements', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.deleteMany(1, 2)

      expect(pack).toEqualSequence(...wrap(0, 3))
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.deleteMany(1, 2)

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.warp', function () {
    /**
     * 
     */
    it('fastly removes an element', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.warp(1)

      expect(pack).toMatchSequence(...wrap(0, 2, 3))
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.warp(1)

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.warpMany', function () {
    /**
     * 
     */
    it('fastly removes many element', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5, 6))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3, 4, 5, 6))

      pack.warpMany(1, 2)

      expect(pack).toMatchSequence(...wrap(0, 3, 4, 5, 6))
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5, 6))

      expect(pack.capacity).toBe(7)

      pack.warpMany(1, 2)

      expect(pack.capacity).toBe(7)
    })
  })

  /**
   * 
   */
  describe('prototype.fill', function () {
    /**
     * 
     */
    it('fills with a value', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.fill(new Integer(1))

      expect(pack).toEqualSequence(...wrap(1, 1, 1, 1))
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.fill(new Integer(1))

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.concat', function () {
    /**
     * 
     */
    it('push a sequence', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])
      const rest: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(4, 5, 6, 7))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))
      expect(rest).toEqualSequence(...wrap(4, 5, 6, 7))

      pack.concat(rest)

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3, 4, 5, 6, 7))
      expect(rest).toEqualSequence(...wrap(4, 5, 6, 7))
    })

    /**
     * 
     */
    it('does not update the capacity when the insertion does not overflow', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])
      const rest: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(4, 5, 6, 7))

      expect(pack.capacity).toBe(16)
      expect(rest.capacity).toBe(4)

      pack.concat(rest)

      expect(pack.capacity).toBe(16)
      expect(rest.capacity).toBe(4)
    })

    /**
     * 
     */
    it('updates the capacity when the insertion overflows', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))
      const rest: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(4, 5, 6, 7))

      expect(pack.capacity).toBe(4)
      expect(rest.capacity).toBe(4)

      pack.concat(rest)

      expect(pack.capacity).toBe(8)
      expect(rest.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.concatArray', function () {
    /**
     * 
     */
    it('push an array', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.concatArray([...wrap(4, 5, 6, 7)])

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3, 4, 5, 6, 7))
    })

    /**
     * 
     */
    it('does not update the capacity when the insertion does not overflow', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      pack.concatArray([...wrap(0, 1, 2, 3)])

      expect(pack.capacity).toBe(16)

      pack.concatArray([...wrap(4, 5, 6, 7)])

      expect(pack.capacity).toBe(16)
    })

    /**
     * 
     */
    it('updates the capacity when the insertion overflows', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.concatArray([...wrap(4, 5, 6, 7)])

      expect(pack.capacity).toBe(8)
    })
  })

  /**
   * 
   */
  describe('prototype.copy', function () {
    /**
     * 
     */
    it('copy a sequence', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      const toCopy: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5))

      expect(pack).toEqualSequence()
      expect(toCopy).toEqualSequence(...wrap(0, 1, 2, 3, 4, 5))

      pack.copy(toCopy)

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3, 4, 5))
      expect(toCopy).toEqualSequence(...wrap(0, 1, 2, 3, 4, 5))
    })

    /**
     * 
     */
    it('does not update the capacity when the insertion does not overflow', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 16)
      const toCopy: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(16)
      expect(toCopy.capacity).toBe(4)

      pack.copy(toCopy)

      expect(pack.capacity).toBe(16)
      expect(toCopy.capacity).toBe(4)
    })



    /**
     * 
     */
    it('does not update the capacity when the insertion does not overflow', function () {
      const pack: InstancePack<Integer> = InstancePack.allocate(DUPLICATOR, 4)
      const toCopy: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5, 6, 7))

      expect(pack.capacity).toBe(4)
      expect(toCopy.capacity).toBe(8)

      pack.copy(toCopy)

      expect(pack.capacity).toBe(8)
      expect(toCopy.capacity).toBe(8)
    })
  })

  /**
   * 
   */
  describe('prototype.clear', function () {
    /**
     * 
     */
    it('deletes all elements', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack).toEqualSequence(...wrap(0, 1, 2, 3))

      pack.clear()

      expect(pack).toEqualSequence()
    })

    /**
     * 
     */
    it('does not update the capacity', function () {
      const pack: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(pack.capacity).toBe(4)

      pack.clear()

      expect(pack.capacity).toBe(4)
    })
  })

  /**
   * 
   */
  describe('prototype.equals', function () {
    /**
     * 
     */
    it('returns true if both instances are equals', function () {
      expect(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3)))).toBeTruthy()
    })

    /**
     * 
     */
    it('returns true for itself', function () {
      const instance: InstancePack<Integer> = InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3))

      expect(instance.equals(instance)).toBeTruthy()
    })

    /**
     * 
     */
    it('returns false if the size change', function () {
      expect(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3, 4, 5)))).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false if on element change', function () {
      expect(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 3, 3)))).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false for instances of other types', function () {
      expect(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(10)).toBeFalsy()
      expect(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals('test')).toBeFalsy()
      expect(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(new Date())).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false for null or undefined values', function () {
      expect(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(null)).toBeFalsy()
      expect(InstancePack.of(DUPLICATOR, ...wrap(0, 1, 2, 3)).equals(undefined)).toBeFalsy()
    })
  })
})
