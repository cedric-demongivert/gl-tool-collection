import { Comparator, equals } from '@cedric-demongivert/gl-tool-utils'

import { join } from '../algorithm/join'
import { quicksort } from '../algorithm/quicksort'
import { gcd } from '../algorithm/gcd'

import { Duplicator } from '../allocator/Duplicator'

import { EmptyCollectionError } from '../error/EmptyCollectionError'
import { IllegalArgumentsError } from '../error/IllegalArgumentsError'
import { IllegalCallError } from '../error/IllegalCallError'

import { IllegalSequenceIndexError } from '../sequence/error/IllegalSequenceIndexError'
import { IllegalSubsequenceError } from '../sequence/error/IllegalSubsequenceError'
import { NegativeSequenceIndexError } from '../sequence/error/NegativeSequenceIndexError'

import { createSequenceView } from '../sequence/SequenceView'
import { Sequence } from '../sequence/Sequence'
import { SequenceCursor } from '../sequence/SequenceCursor'

import { areEquallyConstructed } from '../areEquallyConstructed'

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
      duplicator.rollback(elements[index])
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
  public get(index: number, output: Element = this.duplicator.allocate()): Element {
    if (index < 0 || index >= this._size) {
      throw new IllegalArgumentsError({ index }, new IllegalSequenceIndexError({ value: index, sequence: this }))
    }
    
    this.duplicator.move(this._elements[index], output)

    return output
  }

  /**
   * @see {@link Pack.pop}
   */
  public pop(output: Element = this.duplicator.allocate()): Element {
    if (this._size < 1) throw new IllegalCallError(this.pop, new EmptyCollectionError(this))

    const elements = this._elements

    this._size -= 1
    
    this.duplicator.move(this._elements[this._size], output)

    return output
  }

  /**
   * @see {@link Pack.last}
   */
  public get last(): Element {
    if (this._size < 1) throw new IllegalCallError('get last', new EmptyCollectionError(this))

    return this.duplicator.copy(this._elements[this._size - 1])
  }

  /**
   * @see {@link Pack.first}
   */
  public get first(): Element {
    if (this._size < 1) throw new IllegalCallError('get first', new EmptyCollectionError(this))

    return this.duplicator.copy(this._elements[0])
  }

  /**
   * @see {@link Pack.fill}
   */
  public fill(element: Element): void {
    const elements: Array<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    for (let index = 0, size = this._size; index < size; ++index) {
      duplicator.move(element, elements[index])
    }
  }

  /**
   * @see {@link Pack.shift}
   */
  public shift(output: Element = this.duplicator.allocate()): Element {
    if (this._size < 1) throw new IllegalCallError(this.shift, new EmptyCollectionError(this))

    this.duplicator.move(this._elements[0], output)
    this.delete(0)

    return output
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
    const duplicator = this.duplicator

    const swap: Element = duplicator.copy(elements[first])
    duplicator.move(elements[second], elements[first])
    duplicator.move(swap, elements[second])
    duplicator.free(swap)
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
      duplicator.rollback(elements[index])
    }

    const endOrCapacity: number = end < elements.length ? end : elements.length

    for (let index = start; index < endOrCapacity; ++index) {
      duplicator.move(value, elements[index])
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


    for (let cursor = this._size; cursor > index; --cursor) {
      duplicator.move(elements[cursor - 1], elements[cursor])
    }

    duplicator.move(value, elements[index])

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
      elements.push(duplicator.allocate())
    } 

    duplicator.move(value, elements[index])

    this._size += 1
  }

  /**
   * @see {@link Pack.unshift}
   */
  public unshift(value: Element): void {
    const elements: Array<Element> = this._elements
    const duplicator: Duplicator<Element> = this.duplicator

    if (this._size === elements.length) {
      elements.push(duplicator.allocate())
    }

    for (let index = this._size; index > 0; --index) {
      duplicator.move(elements[index - 1], elements[index])
    }

    duplicator.move(value, elements[0])

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
      duplicator.move(elements[cursor], elements[cursor - offset])
      duplicator.rollback(elements[cursor])
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
      duplicator.move(elements[size - index - 1], elements[start + index])
      duplicator.rollback(elements[size - index - 1])
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
      if (equals(elements[index], element)) {
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
  // @TODO resolve memory leak (get may copy)
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
      duplicator.move(toCopy.get(start + index), elements[index])
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
      duplicator.move(toConcat.get(index - offset), elements[index])
    }

    while (elements.length < end) {
      elements.push(duplicator.copy(toConcat.get(elements.length - offset)))
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
      duplicator.move(toConcat[index - offset], elements[index])
    }

    while (elements.length < end) {
      elements.push(duplicator.copy(toConcat[elements.length - offset]))
    }

    this._size = end
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
    const duplicator = this.duplicator
    let processedIndex = start

    for (let candidateIndex = start; candidateIndex < end; ++candidateIndex) {
      const candidate = elements[candidateIndex]

      let index = start

      while (index < processedIndex && comparator(candidate, elements[index]) !== 0) {
        ++index
      }

      if (index === processedIndex) {
        duplicator.move(candidate, elements[processedIndex])
        processedIndex += 1
      } else {
        duplicator.rollback(candidate)
      }
    }
    
    if (processedIndex < end) {
      for (let index = 0, until = this._size - end; index < until; ++index) {
        duplicator.move(elements[end + index], elements[processedIndex + index])
        duplicator.rollback(elements[end + index])
      }
    }

    this._size -= end - processedIndex
  }
  
  /**
   * @see {@link Pack.rotate}
   */
  public rotate(offset: number): void {
    const elements = this._elements
    const size = this._size
    const duplicator = this.duplicator

    let safeOffset: number = offset % size
    if (safeOffset < 0) safeOffset += size

    const roots: number = gcd(size, safeOffset)

    for (let start = 0; start < roots; ++start) {
      let temporary: Element = duplicator.copy(elements[start])
      let index = (start + safeOffset) % size

      while (index != start) {
        const swap: Element = duplicator.copy(elements[index])
        duplicator.move(temporary, elements[index])
        duplicator.free(temporary)
        temporary = swap
        index = (index + safeOffset) % size
      }

      duplicator.move(temporary, elements[start])
    }
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
    const duplicator = this.duplicator

    for (let index = 0; index < this._size; ++index) {
      yield duplicator.copy(this._elements[index])
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
