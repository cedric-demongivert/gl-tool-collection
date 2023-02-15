import { Comparator, equals } from '@cedric-demongivert/gl-tool-utils'
import { join } from '../algorithm/join'

import { quicksort } from '../algorithm/quicksort'
import { Duplicator } from '../allocator/Duplicator'
import { areEquallyConstructed } from '../areEquallyConstructed'
import { EmptyCollectionError } from '../error/EmptyCollectionError'
import { IllegalArgumentsError } from '../error/IllegalArgumentsError'
import { IllegalCallError } from '../error/IllegalCallError'
import { createSequenceView } from '../sequence/SequenceView'
import { IllegalSequenceIndexError } from '../sequence/error/IllegalSequenceIndexError'
import { IllegalSubsequenceError } from '../sequence/error/IllegalSubsequenceError'
import { NegativeSequenceIndexError } from '../sequence/error/NegativeSequenceIndexError'
import { Sequence } from '../sequence/Sequence'
import { SequenceCursor } from '../sequence/SequenceCursor'


import type { Pack } from './Pack'


/**
 * An optimized javascript array.
 *
 * @see {@link https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M}
 */
export class InstancePack<Element> implements Pack<Element> {
  /**
   * Wrapped javascript array.
   */
  private readonly _elements: Array<Element>

  /**
   * Number of elements stored.
   */
  private _size: number

  /**
   * 
   */
  public readonly duplicator: Duplicator<Element>

  /**
   * 
   */
  public constructor(duplicator: Duplicator<Element>, capacity: number = 32) {
    this._size = 0
    this.duplicator = duplicator

    const elements: Element[] = []

    while (elements.length < capacity) {
      elements.push(duplicator.allocate())
    }

    this._elements = elements
  }

  /**
   * @see {@link Pack.size}
   */
  public get size(): number {
    return this._size
  }

  /**
   * @see {@link Pack.defaultValue}
   */
  public defaultValue(): Element {
    return this.duplicator.allocate()
  }

  /**
   * @see {@link Pack.size}
   */
  public set size(newSize: number) {
    const elements: Array<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator
    const until: number = newSize < elements.length ? newSize : elements.length

    for (let index = this._size; index < until; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.allocate()
    }

    /**
     * @see {@link https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M}
     */
    while (elements.length < newSize) {
      elements.push(duplicator.allocate())
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
    const duplicator: Duplicator<Element> = this.duplicator

    /**
     * @see {@link https://v8.dev/blog/elements-kinds?fbclid=IwAR337wb3oxEpjz_5xVHL-Y14gUpVElementOztLSIikVVQLGN6qcKidEjMLJ4vO3M}
     */
    while (elements.length < capacity) {
      elements.push(duplicator.allocate())
    }

    if (elements.length > capacity) {
      for (let index = capacity; index < elements.length; ++index) {
        duplicator.free(elements[index])
      }

      elements.length = capacity
      this._size = this._size < capacity ? this._size : capacity
    }
  }

  /**
   * @see {@link Pack.fit}
   */
  public fit(): void {
    const elements: Element[] = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = this._size; index < elements.length; ++index) {
      duplicator.free(elements[index])
    }

    elements.length = this._size
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

    const elements: Element[] = this._elements

    this._size -= 1

    const result: Element = elements[this._size]
    elements[this._size] = this.duplicator.allocate()

    return result
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
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = 0, size = this._size; index < size; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(element)
    }
  }

  /**
   * @see {@link Pack.shift}
   */
  public shift(): Element {
    if (this._size < 1) throw new IllegalCallError(this.shift, new EmptyCollectionError(this))

    const elements: Element[] = this._elements

    const value: Element = elements[0]
    elements[0] = this.duplicator.allocate()

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
    
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    const startOrCapacity: number = start < elements.length ? start : elements.length

    for (let index = this._size; index < startOrCapacity; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.allocate()
    }

    const endOrCapacity: number = end < elements.length ? end : elements.length

    for (let index = start; index < endOrCapacity; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(value)
    }

    while (elements.length < start) {
      elements.push(duplicator.allocate())
    }

    while (elements.length < end) {
      elements.push(duplicator.copy(value))
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
    const duplicator: Duplicator<Element> = this.duplicator

    duplicator.free(elements[this._size])

    for (let cursor = this._size; cursor > index; --cursor) {
      elements[cursor] = elements[cursor - 1]
    }

    elements[index] = duplicator.copy(value)

    this._size += 1
  }

  /**
   * @see {@link Pack.push}
   */
  public push(value: Element): void {
    const index: number = this._size
    const duplicator: Duplicator<Element> = this.duplicator
    const elements: Array<Element> = this._elements

    if (index === elements.length) {
      elements.push(duplicator.copy(value))
    } else {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(value)
    }

    this._size += 1
  }

  /**
   * @see {@link Pack.unshift}
   */
  public unshift(value: Element): void {
    const elements: Array<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    if (this._size === elements.length) {
      elements.push(duplicator.copy(value))
    }

    duplicator.free(elements[this._size])

    for (let index = this._size; index > 0; --index) {
      elements[index] = elements[index - 1]
    }

    elements[0] = duplicator.copy(value)

    this._size += 1
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
    const duplicator: Duplicator<Element> = this.duplicator
    const offset: number = end - start

    for (let cursor = end; cursor < size; ++cursor) {
      duplicator.free(elements[cursor - offset])
      elements[cursor - offset] = elements[cursor]
      elements[cursor] = duplicator.allocate()
    }

    this._size -= offset
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
    const duplicator: Duplicator<Element> = this.duplicator
    const toWarp: number = end - start

    for (let index = 0; index < toWarp; ++index) {
      duplicator.free(elements[start + index])
      elements[start + index] = elements[size - index - 1]
      elements[size - index - 1] = duplicator.allocate()
    }

    this._size -= toWarp
  }

  /**
   * @see {@link Pack.has}
   */
  public has<Key>(
    key: Key, 
    comparator: Comparator<Key, Element> = Comparator.compareWithOperator,
    startOrEnd: number = 0,
    endOrStart: number = this.size
  ): boolean {
    return this.indexOf(key, comparator, startOrEnd, endOrStart) >= 0
  }

  /**
   * @see {@link Pack.indexOf}
   */
  public indexOf<Key>(
    key: Key, 
    comparator: Comparator<Key, Element> = Comparator.compareWithOperator,
    startOrEnd: number = 0,
    endOrStart: number = this.size
  ): number {
    const size = this._size
    const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
    const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

    if (start < 0 || start > size || end > size) {
      throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    }

    const elements: Array<Element> = this._elements

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
    const duplicator: Duplicator<Element> = this.duplicator
    const subsequenceSize: number = end - start
    const subsequenceSizeOrCapacity: number = subsequenceSize < elements.length ? subsequenceSize : elements.length

    for (let index = 0; index < subsequenceSizeOrCapacity; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(toCopy.get(start + index))
    }

    while (elements.length < subsequenceSize) {
      elements.push(duplicator.copy(toCopy.get(start + elements.length)))
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
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = offset; index < endOrCapacity; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(toConcat.get(index - offset)!)
    }

    while (elements.length < end) {
      elements.push(duplicator.copy(toConcat.get(elements.length - offset)!))
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
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = this._size; index < endOrCapacity; ++index) {
      duplicator.free(elements[index])
      elements[index] = duplicator.copy(toConcat[index - offset])
    }

    while (elements.length < end) {
      elements.push(duplicator.copy(toConcat[elements.length - offset]))
    }

    this._size = end
  }

  /**
   * @see {@link Pack.allocate}
   */
  public allocate(capacity: number): InstancePack<Element> {
    return createInstancePack(this.duplicator, capacity)
  }

  /**
   * @see {@link Pack.clone}
   */
  public clone(): InstancePack<Element> {
    return createInstancePackFromSequence(this.duplicator, this)
  }

  /**
   * @see {@link Pack.stringify}
   */
  public stringify(): string {
    return '[' + join(this) + ']'
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
   * @see {@link Pack.clear}
   */
  public clear(): void {
    this._size = 0
  }

  /**
   * @see {@link Pack.values}
   */
  public * values(): IterableIterator<Element> {
    for (let index = 0; index < this._size; ++index) {
      yield this._elements[index]
    }
  }

  /**
   * @see {@link Pack[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this.values()
  }

  /**
   * @see {@link Pack.equals}
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
   * @see {@link Pack.toString}
   */
  public toString(): string {
    return this.constructor.name + ' ' + this.stringify()
  }
}

/**
 * 
 */
export function createInstancePack<Element>(duplicator: Duplicator<Element>, capacity: number = 32): InstancePack<Element> {
  return new InstancePack(duplicator, capacity)
}

/**
 * Return a copy of another sequence.
 *
 * @param toCopy - A sequence to copy.
 * @param [capacity=toCopy.size] - Capacity of the copy.
 *
 * @returns A copy of the given sequence with the requested capacity.
 */
export function createInstancePackFromSequence<Element>(duplicator: Duplicator<Element>, toCopy: Sequence<Element>, capacity: number = toCopy.size): InstancePack<Element> {
  const result: InstancePack<Element> = createInstancePack(duplicator, capacity)
  result.copy(toCopy)
  return result
}

/**
 * 
 */
export function createInstancePackFromValues<Element>(duplicator: Duplicator<Element>, ...elements: Element[]): InstancePack<Element> {
  const result: InstancePack<Element> = createInstancePack(duplicator, elements.length)
  result.concatArray(elements)
  return result
}

/**
 * 
 */
export function createInstancePackFromIterator<Element>(duplicator: Duplicator<Element>, elements: Iterator<Element>, capacity: number = 16): InstancePack<Element> {
  const result: InstancePack<Element> = createInstancePack(duplicator, capacity)

  let iteratorResult = elements.next()

  while (!iteratorResult.done) {
    result.push(iteratorResult.value)
    iteratorResult = elements.next()
  }

  return result
}
