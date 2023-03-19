import { Comparator, equals, Factory } from '@cedric-demongivert/gl-tool-utils'

import { Sequence } from '../sequence/Sequence'
import { SequenceCursor } from '../sequence/SequenceCursor'
import { IllegalSubsequenceError } from '../sequence/error/IllegalSubsequenceError'
import { IllegalSequenceIndexError } from '../sequence/error/IllegalSequenceIndexError'
import { NegativeSequenceIndexError } from '../sequence/error/NegativeSequenceIndexError'
import { createSequenceView } from '../sequence/SequenceView'

import { IllegalCallError } from '../error/IllegalCallError'
import { EmptyCollectionError } from '../error/EmptyCollectionError'
import { IllegalArgumentsError } from '../error/IllegalArgumentsError'

import { quicksort } from '../algorithm/quicksort'
import { join } from '../algorithm/join'
import { gcd } from '../algorithm/gcd'

import { areEquallyConstructed } from '../areEquallyConstructed'

import { Pack } from './Pack'


/**
 * An optimized javascript array.
 *
 * @see {@link https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M}
 */
export class ArrayPack<Element> implements Pack<Element> {
  /**
   * Wrapped javascript array.
   */
  private readonly _elements: Array<Element>

  /**
   * Number of elements stored.
   */
  private _size: number

  /**
   * @see {@link Pack.defaultValue}
   */
  public readonly defaultValue: Factory<Element>

  /**
   * Wraps the given array as a pack.
   * 
   * This constructor allows defining the number of elements into the array to wrap.
   *
   * @param defaultValue - A factory of filling elements.
   * @param elements - A javascript array to wrap.
   * @param [size = elements.length] - Initial number of elements in the array to wrap.
   */
  public constructor(defaultValue: Factory<Element>, elements: Array<Element>, size: number = elements.length) {
    this._elements = elements
    this._size = size
    this.defaultValue = defaultValue
  }

  /**
   * @see {@link Pack.size}
   */
  public get size(): number {
    return this._size
  }

  /**
   * @see {@link Pack.size}
   */
  public set size(newSize: number) {
    const elements: Array<Element> = this._elements
    const defaultValue: Factory<Element> = this.defaultValue
    const until: number = newSize < elements.length ? newSize : elements.length

    for (let index = this._size; index < until; ++index) {
      elements[index] = defaultValue()
    }

    /**
     * @see {@link https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M}
     */
    while (elements.length < newSize) {
      elements.push(defaultValue())
    }

    this._size = newSize
  }

  /**
   * @see {@link Pack.capacity}
   */
  public get capacity(): number {
    return this._elements.length
  }

  /**
   * @see {@link Pack.reallocate}
   */
  public reallocate(capacity: number): void {
    const elements: Array<Element> = this._elements
    const defaultValue: Factory<Element> = this.defaultValue

    /**
     * @see {@link https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M}
     */
    while (elements.length < capacity) {
      elements.push(defaultValue())
    }

    if (elements.length > capacity) {
      elements.length = capacity
      this._size = this._size < capacity ? this._size : capacity
    }
  }

  /**
   * @see {@link Pack.fit}
   */
  public fit(): void {
    this._elements.length = this._size
  }

  /**
   * @see {@link Pack.get}
   */
  public get(index: number): Element {
    if (index < 0 || index >= this._size) {
      throw new IllegalArgumentsError({ index }, new IllegalSequenceIndexError({ value: index, sequence: this }))
    }

    return this._elements[index]
  }

  /**
   * @see {@link Pack.pop}
   */
  public pop(): Element {
    if (this._size < 1) throw new IllegalCallError(this.pop, new EmptyCollectionError(this))

    this._size -= 1
    return this._elements[this._size]
  }

  /**
   * @see {@link Pack.last}
   */
  public get last(): Element {
    if (this._size < 1) throw new IllegalCallError('get last', new EmptyCollectionError(this))

    return this._elements[this._size - 1]
  }

  /**
   * @see {@link Pack.first}
   */
  public get first(): Element {
    if (this._size < 1) throw new IllegalCallError('get first', new EmptyCollectionError(this))

    return this._elements[0]
  }

  /**
   * @see {@link Pack.fill}
   */
  public fill(element: Element): void {
    const elements: Array<Element> = this._elements

    for (let index = 0, size = this._size; index < size; ++index) {
      elements[index] = element
    }
  }

  /**
   * @see {@link Pack.shift}
   */
  public shift(): Element {
    if (this._size < 1) throw new IllegalCallError(this.shift, new EmptyCollectionError(this))

    const value: Element = this._elements[0]
    this.delete(0)
    return value
  }

  /**
   * @see {@link Pack.sort}
   */
  public sort(
    comparator: Comparator<Element, Element>, 
    startOrEnd: number = 0, 
    endOrStart: number = this.size
  ): void {
    quicksort(this, comparator, startOrEnd, endOrStart)
  }

  /**
   * @see {@link Pack.swap}
   */
  public swap(first: number, second: number): void {
    if (first < 0 || first >= this._size) {
      throw new IllegalArgumentsError({ first }, new IllegalSequenceIndexError({ value: first, sequence: this }))
    }

    if (second < 0 || second >= this._size) {
      throw new IllegalArgumentsError({ second }, new IllegalSequenceIndexError({ value: second, sequence: this }))
    }

    const elements: Array<Element> = this._elements

    const swap: Element = elements[first]
    elements[first] = elements[second]
    elements[second] = swap
  }

  /**
   * @see {@link Pack.set}
   */
  public set(index: number, value: Element): void 
  /**
   * @see {@link Pack.set}
   */
  public set(startOrEnd: number, endOrStart: number, value: Element): void
  /**
   * 
   */
  public set(startOrEnd: number): void {
    const value: Element = arguments.length > 2 ? arguments[2] : arguments[1]
    const endOrStart: number = arguments.length > 2 ? arguments[1] : startOrEnd + 1

    const start: number = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end: number = startOrEnd < endOrStart ? endOrStart : startOrEnd
    
    if (startOrEnd < 0) {
      if (arguments.length > 2) {
        throw new IllegalArgumentsError({ startOrEnd }, new NegativeSequenceIndexError(startOrEnd))
      } else {
        throw new IllegalArgumentsError({ index: startOrEnd }, new NegativeSequenceIndexError(startOrEnd))
      }
    }

    if (endOrStart < 0) {
      throw new IllegalArgumentsError({ endOrStart }, new NegativeSequenceIndexError(endOrStart))
    }

    const defaultValue: Factory<Element> = this.defaultValue
    const elements: Array<Element> = this._elements

    const startOrCapacity: number = start < elements.length ? start : elements.length

    for (let index = this._size; index < startOrCapacity; ++index) {
      elements[index] = defaultValue()
    }

    const endOrCapacity: number = end < elements.length ? end : elements.length

    for (let index = start; index < endOrCapacity; ++index) {
      elements[index] = value
    }

    while (elements.length < start) {
      elements.push(defaultValue())
    }

    while (elements.length < end) {
      elements.push(value)
    }

    this._size = end < this._size ? this._size : end
  }

  /**
   * @see {@link Pack.insert}
   */
  public insert(index: number, value: Element): void {
    if (index < 0) {
      throw new IllegalArgumentsError({ index }, new NegativeSequenceIndexError(index))
    }

    if (index >= this._size) {
      return this.set(index, value)
    }

    const elements: Array<Element> = this._elements

    for (let cursor = this._size; cursor > index; --cursor) {
      elements[cursor] = elements[cursor - 1]
    }

    elements[index] = value

    this._size += 1
  }

  /**
   * @see {@link Pack.push}
   */
  public push(value: Element): void {
    const index: number = this._size
    const elements: Array<Element> = this._elements

    if (index === elements.length) {
      elements.push(value)
    } else {
      elements[index] = value
    }

    this._size += 1
  }

  /**
   * @see {@link Pack.unshift}
   */
  public unshift(value: Element): void {
    const elements: Array<Element> = this._elements

    if (this._size === elements.length) {
      elements.push(value)
    }

    for (let index = this._size; index > 0; --index) {
      elements[index] = elements[index - 1]
    }

    elements[0] = value

    this._size += 1
  }
  
  /**
   * @see {@link Pack.rotate}
   */
  public rotate(offset: number): void {
    const elements = this._elements
    const size = this._size

    let safeOffset: number = offset % size
    if (safeOffset < 0) safeOffset += size

    const roots: number = gcd(size, safeOffset)

    for (let start = 0; start < roots; ++start) {
      let temporary: Element = elements[start]
      let index = (start + safeOffset) % size

      while (index != start) {
        const swap: Element = elements[index]
        elements[index] = temporary
        temporary = swap
        index = (index + safeOffset) % size
      }

      elements[start] = temporary
    }
  }

  /**
   * @see {@link Pack.delete}
   */
  public delete(startOrEnd: number, endOrStart: number = startOrEnd + 1): void {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements: Array<Element> = this._elements
    const offset: number = end - start

    for (let cursor = end; cursor < size; ++cursor) {
      elements[cursor - offset] = elements[cursor]
    }

    this._size -= offset
  }

  /**
   * @see {@link Pack.unique}
   */
  public unique(
    comparator: Comparator<Element, Element> = Comparator.compareWithOperator, 
    startOrEnd: number = 0, 
    endOrStart: number = this._size
  ): void {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements = this._elements
    let processedIndex = start

    for (let candidateIndex = start; candidateIndex < end; ++candidateIndex) {
      const candidate = elements[candidateIndex]

      let index = start

      while (index < processedIndex && comparator(candidate, elements[index]) !== 0) {
        ++index
      }

      if (index === processedIndex) {
        elements[processedIndex] = elements[candidateIndex]
        processedIndex += 1
      }
    }

    this.delete(processedIndex, end)
  }

  /**
   * @see {@link Pack.warp}
   */
  public warp(startOrEnd: number, endOrStart: number = startOrEnd + 1): void {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements: Array<Element> = this._elements
    const toWarp: number = end - start

    for (let index = 0; index < toWarp; ++index) {
      elements[start + index] = elements[size - index - 1]
    }

    this._size -= toWarp
  }

  /**
   * @see {@link Pack.has}
   */
  public has(element: Element, startOrEnd: number = 0, endOrStart: number = this.size): boolean {
    return this.indexOf(element, startOrEnd, endOrStart) >= 0
  }

  /**
   * @see {@link Pack.indexOf}
   */
  public indexOf(element: Element, startOrEnd: number = 0, endOrStart: number = this.size): number {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements: Array<Element> = this._elements

    for (let index = start; index < end; ++index) {
      if (element === elements[index]) {
        return index
      }
    }

    return -1
  }

  /**
   * @see {@link Pack.search}
   */
  public search<Key>(key: Key, comparator: Comparator<Key, Element>, startOrEnd: number = 0, endOrStart: number = 0): number {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements = this._elements

    for (let index = start; index < end; ++index) {
      if (comparator(key, elements[index]) === 0) {
        return index
      }
    }

    return -1
  }

  /**
   * @see {@link Pack.copy}
   */
  public copy(
    toCopy: Sequence<Element>, 
    startOrEnd: number = 0,
    endOrStart: number = toCopy.size
  ): void {
    const toCopySize = toCopy.size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start >= toCopySize || end > toCopySize) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements: Array<Element> = this._elements
    const subsequenceSize: number = end - start
    const subsequenceSizeOrCapacity: number = subsequenceSize < elements.length ? subsequenceSize : elements.length

    for (let index = 0; index < subsequenceSizeOrCapacity; ++index) {
      elements[index] = toCopy.get(start + index)
    }

    while (elements.length < subsequenceSize) {
      elements.push(toCopy.get(start + elements.length))
    }

    this._size = subsequenceSize
  }

  /**
   * @see {@link Pack.concat}
   */
  public concat(toConcat: Sequence<Element>): void {
    const elements: Array<Element> = this._elements
    const offset: number = this._size
    const end: number = offset + toConcat.size
    const endOrCapacity: number = end < elements.length ? end : elements.length

    for (let index = offset; index < endOrCapacity; ++index) {
      elements[index] = toConcat.get(index - offset)!
    }

    while (elements.length < end) {
      elements.push(toConcat.get(elements.length - offset)!)
    }

    this._size = end
  }

  /**
   * @see {@link Pack.concatArray}
   */
  public concatArray(toConcat: Array<Element>): void {
    const elements: Array<Element> = this._elements
    const offset: number = this._size
    const end: number = offset + toConcat.length
    const endOrCapacity: number = end < elements.length ? end : elements.length

    for (let index = this._size; index < endOrCapacity; ++index) {
      elements[index] = toConcat[index - offset]
    }

    while (elements.length < end) {
      elements.push(toConcat[elements.length - offset])
    }

    this._size = end
  }

  /**
   * @see {@link Pack.allocate}
   */
  public allocate(capacity: number): ArrayPack<Element> {
    return createArrayPack(this.defaultValue, capacity)
  }

  /**
   * @see {@link Pack.clone}
   */
  public clone(): ArrayPack<Element> {
    return createArrayPackFromSequence(this.defaultValue, this)
  }

  /**
   * @see {@link Pack.view}
   */
  public view(): Sequence<Element> {
    return createSequenceView(this)
  }

  /**
   * @see {@link Pack.forward}
   */
  public forward(): SequenceCursor<Element> {
    return new SequenceCursor(this, 0)
  }

  /**
   * @see {@link Pack.stringify}
   */
  public stringify(): string {
    return '[' + join(this) + ']'
  }

  /**
   * @see {@link Clearable.clear}
   */
  public clear(): void {
    this._size = 0
  }

  /**
   * @see {@link Collection.values}
   */
  public * values(): IterableIterator<Element> {
    for (let index = 0; index < this._size; ++index) {
      yield this._elements[index]
    }
  }

  /**
   * @see {@link Collection[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this.values()
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (areEquallyConstructed(other, this)) {
      if (other.size !== this._size) return false

      for (let index = 0, size = this._size; index < size; ++index) {
        if (!equals(other.get(index), this._elements[index])) return false
      }

      return true
    }

    return false
  }

  /**
   * @see {@link Object.toString}
   */
  public toString(): string {
    return this.constructor.name + ' ' + this.stringify()
  }
}

/**
 * Returns an empty array pack with the given capacity.
 *
 * @param defaultValue - A factory of default values to use for the pack.
 * @param [capacity=32] - The capacity of the pack to allocate.
 *
 * @returns An empty array pack of the given capacity.
 */
export function createArrayPack<Element>(defaultValue: Factory<Element>, capacity: number = 32): ArrayPack<Element> {
  const result: Array<Element> = []

  /**
   * @see {@link https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M}
   */
  while (result.length != capacity) {
    result.push(defaultValue())
  }

  return new ArrayPack(defaultValue, result, 0)
}

/**
 * Wraps an existing array into a new array pack instance.
 * 
 * This method allows defining the number of elements stored in the array to 
 * wrap. Any element stored at an index greater or equal to the given size will 
 * be ignored by the resulting array pack instance and may be overridden by the 
 * default value if required.
 *
 * @param defaultValue - A factory of default values to use for the pack.
 * @param elements - The array to wrap.
 * @param [size = elements.length] - Number of elements in the array to wrap.
 *
 * @returns The given array wrapped as a pack.
 */
export function wrapAsArrayPack<Element>(defaultValue: Factory<Element>, elements: Element[], size: number = elements.length): ArrayPack<Element> {
  return new ArrayPack<Element>(defaultValue, elements, size)
}

/**
 * Returns a shallow copy of a sequence.
 * 
 * This method allows defining in advance the capacity of the resulting array pack. 
 * The factory will reallocate the pack to the minimum valid capacity to fit the entire sequence to copy if necessary.
 *
 * @param defaultValue - A factory of default values to use for the pack.
 * @param toCopy - A sequence to copy.
 * @param [capacity=toCopy.size] - Capacity of the copy.
 *
 * @returns A copy of the given sequence with the requested capacity.
 */
export function createArrayPackFromSequence<Element>(defaultValue: Factory<Element>, toCopy: Sequence<Element>, capacity: number = toCopy.size): ArrayPack<Element> {
  const result: ArrayPack<Element> = createArrayPack(defaultValue, capacity)
  result.copy(toCopy)
  return result
}

/**
 * Returns a new array pack that contains the elements returned by the given iterator.
 * 
 * This method allows defining in advance the capacity to allocate to store the sequence 
 * defined by the given iterator. The factory will reallocate the pack until its current 
 * capacity is greater than or equal to the length of the given iterator.
 * 
 * @param defaultValue - A factory of default values to use for the pack.
 * @param elements - An iterator that describes the sequence of elements to store into the resulting pack.
 * @param [capacity=16] - The capacity of the pack to allocate.
 * 
 * @returns A new array pack that contains the elements returned by the given iterator.
 */
export function createArrayPackFromIterator<Element>(defaultValue: Factory<Element>, elements: Iterator<Element>, capacity: number = 16): ArrayPack<Element> {
  const result: ArrayPack<Element> = createArrayPack(defaultValue, capacity)

  let iteratorResult = elements.next()

  while (!iteratorResult.done) {
    result.push(iteratorResult.value)
    iteratorResult = elements.next()
  }

  return result
}

/**
 * Returns a new array pack that contains the requested sequence of elements.
 * 
 * Returns an empty array pack if called with an empty sequence of elements.
 * 
 * @param defaultValue - A factory of default values to use for the pack.
 * @param [...elements] - The sequence of elements to store into the resulting pack.
 * 
 * @returns A new array pack that contains the specified sequence of elements.
 */
export function createArrayPackFromValues<Element>(defaultValue: Factory<Element>, ...elements: Element[]): ArrayPack<Element> {
  const result: ArrayPack<Element> = createArrayPack(defaultValue, elements.length)
  result.concatArray(elements)
  return result
}
