import { Assignable, toString } from '@cedric-demongivert/gl-tool-utils'

import { Collection } from '../Collection'
import { Mark, Markable } from '../mark'

/**
 * A sequence is an ordered collection of elements in which repetitions are allowed; 
 * it may contain a non-finite number of elements.
 */
export interface Sequence<Element> extends Collection<Element> {
  /**
   * Return the element at the given index in this sequence of elements.
   *
   * A sequence may not be randomly accessible. Randomly accessing elements of a 
   * non randomly accessible sequence may result in poor performances.
   *
   * @param index - Index of the element to return in this sequence of elements.
   *
   * @returns The element at the given index in this sequence of elements.
   *
   * @see https://en.wikipedia.org/wiki/Random_access
   */
  get(index: number): Element | undefined

  /**
   * Return the last element of this sequence of elements.
   *
   * A sequence may not be randomly accessible, and, in such cases, this 
   * method may iterate over the entire collection to retrieve the last element.
   *
   * If this sequence does not have an ending element because it describes a 
   * semi-finite or an infinite series, this method MUST return undefined.
   *
   * @returns The last element of this sequence of elements if any.
   */
  getLast(): Element | undefined

  /**
   * Return the first element of this sequence of elements.
   *
   * A sequence may not be randomly accessible, and, in such cases, this 
   * method may iterate over the entire collection to retrieve the first element.
   *
   * If this sequence does not have an starting element because it describes a 
   * semi-finite or an infinite series, this method MUST return undefined.
   *
   * @returns The first element of this sequence of elements.
   */
  getFirst(): Element | undefined

  /**
   * 
   */
  getFirst<Output extends Assignable<Element>>(output: Output): Output | undefined

  /**
   * Return the index of the first element equal to the given one in this sequence or a negative 
   * integer if the given value does not exist in this sequence of elements.
   *
   * A collection may not be randomly accessible, and, in such cases, this method may 
   * use the iterator exposed by this collection to find the requested element. Randomly 
   * accessing a non randomly accessible collection may result in poor performances.
   *
   * @param element - An element to search for.
   *
   * @returns Return the index of the first element equal to the given one in this sequence 
   *          or a negative integer if the given value does not exist in this sequence of elements.
   */
  indexOf(element: Element): number

  /**
   * @see Sequence.indexOf
   *
   * Act like indexOf but only over the given subsequence of elements.
   *
   * @param element - An element to search for.
   * @param offset - Elements to skip from the begining of this sequence.
   * @param size - Elements to search.
   *
   * @returns Return the index of the first element equal to the given one in the described
   *         subsequence or a negative integer if the given value does not exist in the described 
   *         subsequence of elements.
   */
  indexOfInSubsequence(element: Element, offset: number, size: number): number

  /**
   * @see Sequence.has
   *
   * Act like has but only over the given subsequence of elements.
   *
   * @param element - An element to search for.
   * @param offset - Elements to skip from the begining of this sequence.
   * @param size - Elements to search.
   *
   * @returns True if the described subsequence contains the given element.
   */
  hasInSubsequence(element: Element, offset: number, size: number): boolean

  /**
   * @see Collection.clone
   */
  clone(): Sequence<Element>

  /**
   * @see Collection.view
   */
  view(): Sequence<Element>
}

/**
 * 
 */
export namespace Sequence {
  /**
   * 
   */
  export const MARK: Mark = Symbol('gl-tool-collection/mark/collection/sequence')

  /**
   * @see Mark.Container
   */
  export function mark(): Mark {
    return MARK
  }

  /**
   * Return true if the given collection is a sequence.
   *
   * @param collection - A collection to assert.
   *
   * @returns True if the given collection is a sequence.
   */
  export function is<Element>(collection: Markable): collection is Sequence<Element> {
    return collection.is(MARK)
  }

  /**
   * 
   */
  export function stringify(sequence: Sequence<unknown>): string {
    let result: string = '['
    let iterator: IterableIterator<unknown> = sequence.values()
    let iteratorResult: IteratorResult<unknown> = iterator.next()

    if (!iteratorResult.done) {
      result += toString(iteratorResult.value)
      iteratorResult = iterator.next()
    }

    while (!iteratorResult.done) {
      result += ', '
      result += toString(iteratorResult.value)
      iteratorResult = iterator.next()
    }

    return result + ']'
  }
}

import { EmptySequence } from './EmptySequence'
import { SequenceView } from './SequenceView'

/**
 * 
 */
export namespace Sequence {
  /**
   * @see EmptySequence.INSTANCE
   */
  export const EMPTY = EmptySequence.INSTANCE

  /**
   * @see EmptySequence.get
   */
  export const empty = EmptySequence.get

  /**
   * @see SequenceView.wrap
   */
  export const view = SequenceView.wrap
}
