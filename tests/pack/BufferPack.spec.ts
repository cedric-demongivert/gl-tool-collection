import { Comparator } from '@cedric-demongivert/gl-tool-utils'
import { zeroes } from '../../sources/generator/zeroes'
import { INT16_MAX_VALUE } from '../../sources/native/TypedArray'
import { INT8_MAX_VALUE } from '../../sources/native/TypedArray'
import { UINT16_MAX_VALUE } from '../../sources/native/TypedArray'
import { UINT8_MAX_VALUE } from '../../sources/native/TypedArray'
import { BufferPack } from '../../sources/pack/BufferPack'
import { wrapAsBufferPack } from '../../sources/pack/BufferPack'
import { createUint8Pack } from '../../sources/pack/BufferPack'
import { createUint16Pack } from '../../sources/pack/BufferPack'
import { createUint32Pack } from '../../sources/pack/BufferPack'
import { createInt8Pack } from '../../sources/pack/BufferPack'
import { createInt16Pack } from '../../sources/pack/BufferPack'
import { createInt32Pack } from '../../sources/pack/BufferPack'
import { createFloat32Pack } from '../../sources/pack/BufferPack'
import { createFloat64Pack } from '../../sources/pack/BufferPack'
import { createUint8PackFromValues } from '../../sources/pack/BufferPack'
import { createUint16PackFromValues } from '../../sources/pack/BufferPack'
import { createUint32PackFromValues } from '../../sources/pack/BufferPack'
import { createInt8PackFromValues } from '../../sources/pack/BufferPack'
import { createInt16PackFromValues } from '../../sources/pack/BufferPack'
import { createInt32PackFromValues } from '../../sources/pack/BufferPack'
import { createFloat32PackFromValues } from '../../sources/pack/BufferPack'
import { createFloat64PackFromValues } from '../../sources/pack/BufferPack'
import { createIntPackUpTo } from '../../sources/pack/BufferPack'
import { createUintPackUpTo } from '../../sources/pack/BufferPack'

/**
 * 
 */
describe('pack/wrapAsBufferPack', function () {
  /**
   * 
   */
  it('wraps an existing buffer into a new buffer pack instance', function () {
    const array = new Int32Array([0, 1, 2, 3, 4])
    const pack = wrapAsBufferPack(array)

    expect([...pack]).toEqual([0, 1, 2, 3, 4])
    expect(pack.capacity).toBe(5)
    expect(pack.size).toBe(5)

    array[3] = 8

    expect([...pack]).toEqual([0, 1, 2, 8, 4])
    expect(pack.capacity).toBe(5)
    expect(pack.size).toBe(5)
  })

  /**
   * 
   */
  it('allows defining the number of elements stored in the buffer to wrap', function () {
    const array = new Int32Array([0, 1, 2, 3, 4])
    const pack = wrapAsBufferPack(array, 3)

    expect([...pack]).toEqual([0, 1, 2])
    expect(pack.capacity).toBe(5)
    expect(pack.size).toBe(3)

    array[3] = 8

    expect([...pack]).toEqual([0, 1, 2])
    expect(pack.capacity).toBe(5)
    expect(pack.size).toBe(3)
  })
})

for (
  const configuration of [
    { factory: createUint8Pack, ArrayType: Uint8Array },
    { factory: createUint16Pack, ArrayType: Uint16Array},
    { factory: createUint32Pack, ArrayType: Uint32Array},
    { factory: createInt8Pack, ArrayType: Int8Array},
    { factory: createInt16Pack, ArrayType: Int16Array},
    { factory: createInt32Pack, ArrayType: Int32Array},
    { factory: createFloat32Pack, ArrayType: Float32Array},
    { factory: createFloat64Pack, ArrayType: Float64Array}
  ]
) {
  /**
   * 
   */
  describe('pack/' + configuration.factory.name, function () {
    /**
     * 
     */
    it('returns an empty buffer pack with the given capacity', function () {
      const pack = configuration.factory(32)

      expect([...pack]).toEqual([])
      expect(pack.array).toBeInstanceOf(configuration.ArrayType)
      expect(pack.capacity).toBe(32)
    })

    /**
     * 
     */
    it('returns an empty buffer pack with default capacity', function () {
      const pack = configuration.factory()

      expect([...pack]).toEqual([])
      expect(pack.array).toBeInstanceOf(configuration.ArrayType)
      expect(pack.capacity).toBe(32)
    })
  })
}

for (
  const configuration of [
    { factory: createUint8PackFromValues, ArrayType: Uint8Array },
    { factory: createUint16PackFromValues, ArrayType: Uint16Array},
    { factory: createUint32PackFromValues, ArrayType: Uint32Array},
    { factory: createInt8PackFromValues, ArrayType: Int8Array},
    { factory: createInt16PackFromValues, ArrayType: Int16Array},
    { factory: createInt32PackFromValues, ArrayType: Int32Array},
    { factory: createFloat32PackFromValues, ArrayType: Float32Array},
    { factory: createFloat64PackFromValues, ArrayType: Float64Array}
  ]
) {
  /**
   * 
   */
  describe('pack/' + configuration.factory.name, function () {
    /**
     * 
     */
    it('returns a new buffer pack that contains the requested sequence of elements', function () {
      const pack = configuration.factory(0, 1, 2, 3, 4)

      expect([...pack]).toEqual([0, 1, 2, 3, 4])
      expect(pack.array).toBeInstanceOf(configuration.ArrayType)
    })

    /**
     * 
     */
    it('returns an empty buffer pack if called with an empty sequence of elements', function () {
      const pack = configuration.factory()

      expect([...pack]).toEqual([])
      expect(pack.array).toBeInstanceOf(configuration.ArrayType)
    })
  })
}

/**
 * 
 */
describe('pack/createIntPackUpTo', function () {
  /**
   * 
   */
  it('returns a new pack that wraps an IntArray that can store values in range [-maximum, maximum] and that is of the given capacity', function () {
    const bytePack = createIntPackUpTo(INT8_MAX_VALUE, 16)

    expect(bytePack.array).toBeInstanceOf(Int8Array)
    expect(bytePack.capacity).toBe(16)
    expect([...bytePack]).toEqual([])

    const shortPack = createIntPackUpTo(INT16_MAX_VALUE, 16)

    expect(shortPack.array).toBeInstanceOf(Int16Array)
    expect(shortPack.capacity).toBe(16)
    expect([...shortPack]).toEqual([])

    const intPack = createIntPackUpTo(INT16_MAX_VALUE + 1, 16)

    expect(intPack.array).toBeInstanceOf(Int32Array)
    expect(intPack.capacity).toBe(16)
    expect([...intPack]).toEqual([])
  })
})



/**
 * 
 */
describe('pack/createUintPackUpTo', function () {
  /**
   * 
   */
  it('returns a new pack that wraps an UintArray that can store values in range [0, maximum] and that is of the given capacity', function () {
    const bytePack = createUintPackUpTo(UINT8_MAX_VALUE, 16)

    expect(bytePack.array).toBeInstanceOf(Uint8Array)
    expect(bytePack.capacity).toBe(16)
    expect([...bytePack]).toEqual([])

    const shortPack = createUintPackUpTo(UINT16_MAX_VALUE, 16)

    expect(shortPack.array).toBeInstanceOf(Uint16Array)
    expect(shortPack.capacity).toBe(16)
    expect([...shortPack]).toEqual([])

    const intPack = createUintPackUpTo(UINT16_MAX_VALUE + 1, 16)

    expect(intPack.array).toBeInstanceOf(Uint32Array)
    expect(intPack.capacity).toBe(16)
    expect([...intPack]).toEqual([])
  })
})

/**
 * 
 */
describe('pack/BufferPack', function () {
  /**
   * 
   */
  describe('#indexOf', function () {
    /**
     * 
     */
    it('returns the index of the first element equal to the searched one', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 1, 3, 2, 3, 4)

      expect(pack.indexOf(0)).toBe(0)
      expect(pack.indexOf(1)).toBe(1)
      expect(pack.indexOf(2)).toBe(2)
      expect(pack.indexOf(3)).toBe(4)
      expect(pack.indexOf(4)).toBe(7)
    })
    
    /**
     * 
     */
    it('returns a negative integer if the given value does not exist in the sequence', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3, 4)

      expect(pack.indexOf(10)).toBeLessThan(0)
      expect(pack.indexOf(-5)).toBeLessThan(0)
      expect(pack.indexOf(5)).toBeLessThan(0)
    })

    /**
     * 
     */
    it('allows searching for an element in a given subsequence', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 1, 3, 2, 3, 4)

      expect(pack.indexOf(0, Comparator.compareWithOperator, 2, 4)).toBeLessThan(0)
      expect(pack.indexOf(1, Comparator.compareWithOperator, 2, 4)).toBe(3)
      expect(pack.indexOf(2, Comparator.compareWithOperator, 2, 4)).toBe(2)
      expect(pack.indexOf(3, Comparator.compareWithOperator, 2, 4)).toBeLessThan(0)
      expect(pack.indexOf(4, Comparator.compareWithOperator, 2, 4)).toBeLessThan(0)
    })

    /**
     * 
     */
    it('allows defining the boundaries of a subsequence in any order', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 1, 3, 2, 3, 4)

      expect(pack.indexOf(0, Comparator.compareWithOperator, 4, 2)).toBeLessThan(0)
      expect(pack.indexOf(1, Comparator.compareWithOperator, 4, 2)).toBe(3)
      expect(pack.indexOf(2, Comparator.compareWithOperator, 4, 2)).toBe(2)
      expect(pack.indexOf(3, Comparator.compareWithOperator, 4, 2)).toBeLessThan(0)
      expect(pack.indexOf(4, Comparator.compareWithOperator, 4, 2)).toBeLessThan(0)
    })

    /**
     * 
     */
    it('throws if the requested subsequence is out of the bounds of the collection', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 1, 3, 2, 3, 4)

      expect(() => pack.indexOf(15, Comparator.compareWithOperator, -5, 4)).toThrow()
      expect(() => pack.indexOf(-5, Comparator.compareWithOperator, 12, 4)).toThrow()
      expect(() => pack.indexOf(-5, Comparator.compareWithOperator, 4, -5)).toThrow()
      expect(() => pack.indexOf(-5, Comparator.compareWithOperator, 4, 12)).toThrow()
    })
  })

  /**
   * 
   */
  describe('#get buffer', function () {
    /**
     * 
     */
    it('returns the underlying buffer', function () {
      const array = new Uint32Array([0, 1, 2, 3, 4])
      const pack = new BufferPack(array)

      expect(pack.buffer).toBe(array.buffer)
    })
  })

  /**
   * 
   */
  describe('#get array', function () {
    /**
     * 
     */
    it('returns the underlying typed array', function () {
      const array = new Uint32Array([0, 1, 2, 3, 4])
      const pack = new BufferPack(array)

      expect(pack.array).toBe(array)
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
      const pack = createInt32PackFromValues(0, 1, 2, 3, 4)
      expect(pack.defaultValue()).toBe(0)
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
      const pack = createInt32PackFromValues(0, 1, 2, 3, 4)

      for (let index = 0; index < 5; ++index) {
        expect(pack.get(index)).toBe(index)
      }
    })

    /**
     * 
     */
    it('throws if the requested index is out of the bounds of the sequence', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3, 5)

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
      const pack = createInt32PackFromValues(0, 1, 2, 3, 4)
      expect(pack.last).toBe(4)
    })

    /**
     * 
     */
    it('throws if the sequence is empty', function () {
      const pack = createInt32PackFromValues()

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
      const pack = createInt32PackFromValues(0, 1, 2, 3, 4)
      expect(pack.first).toBe(0)
    })

    /**
     * 
     */
    it('throws if the sequence is empty', function () {
      const pack = createInt32PackFromValues()
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
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])
      expect(pack.capacity).toBe(4)

      pack.reallocate(8)

      expect([...pack]).toEqual([0, 1, 2, 3])
      expect(pack.capacity).toBe(8)

      pack.reallocate(16)

      expect([...pack]).toEqual([0, 1, 2, 3])
      expect(pack.capacity).toBe(16)

      pack.reallocate(8)

      expect([...pack]).toEqual([0, 1, 2, 3])
      expect(pack.capacity).toBe(8)

      pack.reallocate(4)

      expect([...pack]).toEqual([0, 1, 2, 3])
      expect(pack.capacity).toBe(4)
    })

    it('truncates the sequence to the requested capacity if its size exceeds it.', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3, 4, 5, 6, 7)

      expect([...pack]).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
      expect(pack.capacity).toBe(8)

      pack.reallocate(4)

      expect([...pack]).toEqual([0, 1, 2, 3])
      expect(pack.capacity).toBe(4)

      pack.reallocate(2)

      expect([...pack]).toEqual([0, 1])
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
      const pack = wrapAsBufferPack(new Int32Array([0, 1, 2, 3, ...zeroes(12)]), 4)

      expect([...pack]).toEqual([0, 1, 2, 3])
      expect(pack.capacity).toBe(16)

      pack.fit()

      expect([...pack]).toEqual([0, 1, 2, 3])
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
      expect(createInt32PackFromValues(0, 1, 2, 3).size).toBe(4)
      expect(wrapAsBufferPack(new Int32Array([0, 1, 2, 3, ...zeroes(12)]), 4).size).toBe(4)
    })

    /**
     * 
     */
    it('updates the number of elements in the list if wrote', function () {
      const pack = wrapAsBufferPack(new Int32Array([0, 1, 2, 3, ...zeroes(12)]), 4)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.size = 8

      expect([...pack]).toEqual([0, 1, 2, 3, 0, 0, 0, 0])
    })

    /**
     * 
     */
    it('reallocates the list if the new size exceeds its internal capacity', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

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
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

      expect(pack.pop()).toBe(3)

      expect([...pack]).toEqual([0, 1, 2])

      expect(pack.pop()).toBe(2)

      expect([...pack]).toEqual([0, 1])
    })

    /**
     * 
     */
    it('throws if the list is empty', function () {
      const pack = createInt32PackFromValues()
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
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

      expect(pack.shift()).toBe(0)

      expect([...pack]).toEqual([1, 2, 3])

      expect(pack.shift()).toBe(1)

      expect([...pack]).toEqual([2, 3])
    })

    /**
     * 
     */
    it('throws if the list is empty', function () {
      const pack = createInt32PackFromValues()
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
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.swap(3, 0)

      expect([...pack]).toEqual([3, 1, 2, 0])
    })

    /**
     * 
     */
    it('throws if the first index is out of bounds', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect(() => pack.swap(15, 0)).toThrow()
      expect(() => pack.swap(-5, 0)).toThrow()
    })

    /**
     * 
     */
    it('throws if the second index is out of bounds', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

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
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.set(2, 8)

      expect([...pack]).toEqual([0, 1, 8, 3])
    })

    /**
     * 
     */
    it('expands the list if the element to update is out of its current bounds', function () {
      const pack = wrapAsBufferPack(new Int32Array([0, 1, 2, 3, 4, 5, 6]), 4)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.set(6, 8)

      expect([...pack]).toEqual([0, 1, 2, 3, 0, 0, 8])
    })

    /**
     * 
     */
    it('reallocates the list if the element to update is out of its current bounds', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])
      expect(pack.capacity).toBe(4)

      pack.set(6, 8)

      expect([...pack]).toEqual([0, 1, 2, 3, 0, 0, 8])
      expect(pack.capacity).toBe(7)
    })

    /**
     * 
     */
    it('throws if the given index is negative', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)
      expect(() => pack.set(-5, 2)).toThrow()
    })

    /**
     * 
     */
    it('updates a subsequence of the list', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.set(1, 3, 5)

      expect([...pack]).toEqual([0, 5, 5, 3])
    })

    /**
     * 
     */
    it('expands the list if the subsequence to update is out of its current bounds', function () {
      const pack = wrapAsBufferPack(new Int32Array([0, 1, 2, 3, 4, 5, 6, 7]), 4)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.set(6, 8, 5)

      expect([...pack]).toEqual([0, 1, 2, 3, 0, 0, 5, 5])
    })

    /**
     * 
     */
    it('reallocates the list if the subsequence update overflows its current capacity', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])
      expect(pack.capacity).toBe(4)

      pack.set(6, 8, 5)

      expect([...pack]).toEqual([0, 1, 2, 3, 0, 0, 5, 5])
      expect(pack.capacity).toBe(8)
    })

    /**
     * 
     */
    it('allows its users to define the subsequence to update in any order', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.set(3, 1, 8)

      expect([...pack]).toEqual([0, 8, 8, 3])
    })

    /**
     * 
     */
    it('throws an error if startOrEnd is negative', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)
      expect(() => pack.set(-5, 3, 2)).toThrow()
    })

    /**
     * 
     */
    it('throws an error if endOrStart is negative', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)
      expect(() => pack.set(3, -5, 2)).toThrow()
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
      const pack = createInt32PackFromValues(1, 3, 2, 0)

      expect([...pack]).toEqual([1, 3, 2, 0])

      pack.sort(Comparator.compareNumbers)

      expect([...pack]).toEqual([0, 1, 2, 3])
    })

    /**
     * 
     */
    it('allows sorting a subsequence of elements', function () {
      const pack = createInt32PackFromValues(3, 1, 2, 0, 7, 4, 6, 5, 8)

      expect([...pack]).toEqual([3, 1, 2, 0, 7, 4, 6, 5, 8])

      pack.sort(Comparator.compareNumbers, 2, 7)

      expect([...pack]).toEqual([3, 1, 0, 2, 4, 6, 7, 5, 8])
    })

    /**
     * 
     */
    it('does nothing if the given boundaries define a valid empty sequence', function () {
      const pack = createInt32PackFromValues(3, 1, 2, 0, 7, 4, 6, 5, 8)

      expect([...pack]).toEqual([3, 1, 2, 0, 7, 4, 6, 5, 8])

      pack.sort(Comparator.compareNumbers, 7, 7)

      expect([...pack]).toEqual([3, 1, 2, 0, 7, 4, 6, 5, 8])
    })

    /**
     * 
     */
    it('throws if the requested subsequence is out of the bounds of the collection', function () {
      const pack = createInt32PackFromValues(3, 1, 2, 0, 7, 4, 6, 5, 8)

      expect(() => pack.sort(Comparator.compareNumbers, -5, 2)).toThrow()
      expect(() => pack.sort(Comparator.compareNumbers, 2, -5)).toThrow()
      expect(() => pack.sort(Comparator.compareNumbers, 2, 12)).toThrow()
      expect(() => pack.sort(Comparator.compareNumbers, 12, 2)).toThrow()
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
      const pack = wrapAsBufferPack(new Int32Array([0, 1, 2, 3, ...zeroes(4)]), 4)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.insert(1, 8)

      expect([...pack]).toEqual([0, 8, 1, 2, 3])
    })

    /**
     * 
     */
    it('expands the list if the insertion index is out of its current bounds', function () {
      const pack = wrapAsBufferPack(new Int32Array([0, 1, 2, 3, 4, 5, 6, 7]), 4)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.insert(6, 8)

      expect([...pack]).toEqual([0, 1, 2, 3, 0, 0, 8])
    })

    /**
     * 
     */
    it('reallocates the list if its new size overflows its current capacity', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)

      pack.insert(6, 8)

      expect(pack.capacity).toBe(7)
    })

    /**
     * 
     */
    it('throws if the insertion index is negative', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect(() => pack.insert(-5, 8)).toThrow()
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
      const pack = wrapAsBufferPack(new Int32Array([0, 1, 2, 3, 4, 5, 6, 7]), 4)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.push(8)

      expect([...pack]).toEqual([0, 1, 2, 3, 8])
    })

    /**
     * 
     */
    it('reallocates the list if its new size overflows its current capacity', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)
      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.push(8)

      expect(pack.capacity).toBeGreaterThan(4)
      expect([...pack]).toEqual([0, 1, 2, 3, 8])
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
      const pack = wrapAsBufferPack(new Int32Array([0, 1, 2, 3, 4, 5, 6, 7]), 4)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.unshift(8)

      expect([...pack]).toEqual([8, 0, 1, 2, 3])
    })

    /**
     * 
     */
    it('reallocates the list if its new size overflows its current capacity', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)
      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.unshift(8)

      expect(pack.capacity).toBeGreaterThan(4)
      expect([...pack]).toEqual([8, 0, 1, 2, 3])
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
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.delete(1)

      expect([...pack]).toEqual([0, 2, 3])
    })

    /**
     * 
     */
    it('removes a subsequence of elements from the list', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.delete(1, 3)

      expect([...pack]).toEqual([0, 3])
    })
    
    /**
     * 
     */
    it('allows defining the boundaries of the subsequence to remove in any order', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.delete(3, 1)

      expect([...pack]).toEqual([0, 3])
    })

    /**
     * 
     */
    it('throws if the requested subsequence is out of the bounds of the collection', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

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
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.warp(1)

      expect(pack.size).toBe(3)
      expect(pack.has(0)).toBeTruthy()
      expect(pack.has(2)).toBeTruthy()
      expect(pack.has(3)).toBeTruthy()
    })
    
    /**
     * 
     */
    it('removes a subsequence of elements from the list', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3, 4, 5, 6)

      expect([...pack]).toEqual([0, 1, 2, 3, 4, 5, 6])

      pack.warp(1, 3)

      expect(pack.size).toBe(5)
      expect(pack.has(0)).toBeTruthy()
      expect(pack.has(3)).toBeTruthy()
      expect(pack.has(4)).toBeTruthy()
      expect(pack.has(5)).toBeTruthy()
      expect(pack.has(6)).toBeTruthy()
    })
    
    /**
     * 
     */
    it('allows defining the boundaries of the subsequence to remove in any order', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3, 4, 5, 6)

      expect([...pack]).toEqual([0, 1, 2, 3, 4, 5, 6])

      pack.warp(3, 1)

      expect(pack.size).toBe(5)
      expect(pack.has(0)).toBeTruthy()
      expect(pack.has(3)).toBeTruthy()
      expect(pack.has(4)).toBeTruthy()
      expect(pack.has(5)).toBeTruthy()
      expect(pack.has(6)).toBeTruthy()
    })

    /**
     * 
     */
    it('throws if the requested subsequence is out of the bounds of the collection', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

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
    it('wraps the given array as a pack', function () {
      const pack = new BufferPack(new Int32Array([0, 1, 2, 3, 4, 5, 6, 7]))

      expect([...pack]).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
      expect(pack.capacity).toBe(8)
      expect(pack.size).toBe(8)
    })

    /**
     * 
     */
    it('allows defining the number of elements into the array to wrap', function () {
      const pack = new BufferPack(new Int32Array([0, 1, 2, 3, 4, 5, 6, 7]), 4)

      expect([...pack]).toEqual([0, 1, 2, 3])
      expect(pack.size).toBe(4)
      expect(pack.capacity).toBe(8)
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
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.fill(1)

      expect([...pack]).toEqual([1, 1, 1, 1])
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
      const pack = wrapAsBufferPack(new Int32Array([0, 1, 2, 3, ...zeroes(12)]), 4)
      const rest = createInt32PackFromValues(4, 5, 6, 7)

      expect([...pack]).toEqual([0, 1, 2, 3])
      expect([...rest]).toEqual([4, 5, 6, 7])

      pack.concat(rest)

      expect([...pack]).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
      expect([...rest]).toEqual([4, 5, 6, 7])
    })

    /**
     * 
     */
    it('reallocates the list if its new size overflows its current capacity', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)
      const rest = createInt32PackFromValues(4, 5, 6, 7)

      expect(pack.capacity).toBe(4)
      expect(rest.capacity).toBe(4)
      expect([...pack]).toEqual([0, 1, 2, 3])
      expect([...rest]).toEqual([4, 5, 6, 7])

      pack.concat(rest)

      expect(pack.capacity).toBe(8)
      expect(rest.capacity).toBe(4)
      expect([...pack]).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
      expect([...rest]).toEqual([4, 5, 6, 7])
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
      const pack = wrapAsBufferPack(new Int32Array([0, 1, 2, 3, ...zeroes(12)]), 4)

      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.concatArray([4, 5, 6, 7])

      expect([...pack]).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    })

    /**
     * 
     */
    it('reallocates the list if its new size overflows its current capacity', function () {
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect(pack.capacity).toBe(4)
      expect([...pack]).toEqual([0, 1, 2, 3])

      pack.concatArray([4, 5, 6, 7])

      expect(pack.capacity).toBe(8)
      expect([...pack]).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
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
      const pack = createInt32Pack(16)
      const toCopy = createInt32PackFromValues(0, 1, 2, 3, 4, 5)

      expect([...pack]).toEqual([])
      expect([...toCopy]).toEqual([0, 1, 2, 3, 4, 5])

      pack.copy(toCopy)

      expect([...pack]).toEqual([0, 1, 2, 3, 4, 5])
      expect([...toCopy]).toEqual([0, 1, 2, 3, 4, 5])
    })

    /**
     * 
     */
    it('shallow copy a subsequence of an existing sequence', function () {
      const pack = createInt32Pack(16)
      const toCopy = createInt32PackFromValues(0, 1, 2, 3, 4, 5)

      expect([...pack]).toEqual([])
      expect([...toCopy]).toEqual([0, 1, 2, 3, 4, 5])

      pack.copy(toCopy, 2, 5)

      expect([...pack]).toEqual([2, 3, 4])
      expect([...toCopy]).toEqual([0, 1, 2, 3, 4, 5])
    })

    /**
     * 
     */
    it('allows defining the boundaries of the subsequence to copy in any order', function () {
      const pack = createInt32Pack(16)
      const toCopy = createInt32PackFromValues(0, 1, 2, 3, 4, 5)

      expect([...pack]).toEqual([])
      expect([...toCopy]).toEqual([0, 1, 2, 3, 4, 5])

      pack.copy(toCopy, 5, 2)

      expect([...pack]).toEqual([2, 3, 4])
      expect([...toCopy]).toEqual([0, 1, 2, 3, 4, 5])
    })

    /**
     * 
     */
    it('reallocate the sequence to fit the content of the sequence to copy', function () {
      const pack = createInt32Pack(4)
      const toCopy = createInt32PackFromValues(0, 1, 2, 3, 4, 5, 6, 7)

      expect(pack.capacity).toBe(4)
      expect(toCopy.capacity).toBe(8)
      expect([...pack]).toEqual([])
      expect([...toCopy]).toEqual([0, 1, 2, 3, 4, 5, 6, 7])

      pack.copy(toCopy)

      expect(pack.capacity).toBe(8)
      expect(toCopy.capacity).toBe(8)
      expect([...pack]).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
      expect([...toCopy]).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    })

    /**
     * 
     */
    it('throws if the subsequence to copy is out of the bounds of the collection', function () {
      const pack = createInt32Pack(16)
      const toCopy = createInt32PackFromValues(0, 1, 2, 3, 4, 5)

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
      const pack = createInt32PackFromValues(0, 1, 2, 3)

      expect([...pack]).toEqual([0, 1, 2, 3])

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
      expect(createInt32PackFromValues(0, 1, 2, 3).equals(createInt32PackFromValues(0, 1, 2, 3))).toBeTruthy()
    })

    /**
     * 
     */
    it('returns true for itself', function () {
      const instance = createInt32PackFromValues(0, 1, 2, 3)
      expect(instance.equals(instance)).toBeTruthy()
    })

    /**
     * 
     */
    it('returns false if the size change', function () {
      expect(createInt32PackFromValues(0, 1, 2, 3).equals(createInt32PackFromValues(0, 1, 2, 3, 4, 5))).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false if an element change', function () {
      expect(createInt32PackFromValues(0, 1, 2, 3).equals(createInt32PackFromValues(0, 1, 3, 3))).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false for instances of other types', function () {
      expect(createInt32PackFromValues(0, 1, 2, 3).equals(10)).toBeFalsy()
      expect(createInt32PackFromValues(0, 1, 2, 3).equals('test')).toBeFalsy()
      expect(createInt32PackFromValues(0, 1, 2, 3).equals(new Date())).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false for null or undefined values', function () {
      expect(createInt32PackFromValues(0, 1, 2, 3).equals(null)).toBeFalsy()
      expect(createInt32PackFromValues(0, 1, 2, 3).equals(undefined)).toBeFalsy()
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
      const instance = createInt32PackFromValues(0, 1, 2, 3)
      const allocated = instance.allocate(25)

      expect(allocated).toBeInstanceOf(BufferPack)
      expect(allocated.array).toBeInstanceOf(Int32Array)
      expect(allocated.size).toBe(0)
      expect(allocated.capacity).toBe(25)
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
      const instance = createInt32PackFromValues(0, 1, 2, 3)
      const copy = instance.clone()

      expect(copy.equals(instance)).toBeTruthy()
      expect(copy).not.toBe(instance)
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
      const instance = createInt32PackFromValues(0, 1, 2, 3)
      const view = instance.view()

      expect([...view]).toEqual([...instance])

      instance.set(5, 20)

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
      const instance = createInt32PackFromValues(0, 1, 2, 3)
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
      const instance = createInt32PackFromValues(0, 1, 2, 3)
      expect(instance.stringify()).toBe('[0, 1, 2, 3]')
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
      const instance = createInt32PackFromValues(0, 1, 2, 3)
      expect(instance.toString()).toBe('BufferPack (Int32Array) [0, 1, 2, 3]')
    })
  })
})
