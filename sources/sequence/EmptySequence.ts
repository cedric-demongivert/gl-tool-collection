
import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { EmptyCollection } from '../EmptyCollection'

import { IllegalArgumentsError } from '../error/IllegalArgumentsError'
import { IllegalCallError } from '../error/IllegalCallError'
import { EmptyCollectionError } from '../error/EmptyCollectionError'

import { IllegalSequenceIndexError } from './error/IllegalSequenceIndexError'
import { IllegalSubsequenceError } from './error/IllegalSubsequenceError'

import { Sequence } from './Sequence'

/**
 * An empty sequence, e.g., a sequence of zero elements.
 */
export class EmptySequence<Element> extends EmptyCollection<Element> implements Sequence<Element> {
  /**
   * @see {@link Sequence.get}
   */
  public get(index: number): never {
    throw new IllegalArgumentsError({ index }, new IllegalSequenceIndexError({ value: index, sequence: this }))
  }

  /**
   * @see {@link Sequence.last}
   */
  public get last(): never {
    throw new IllegalCallError('get last', new EmptyCollectionError(this))
  }

  /**
   * @see {@link Sequence.first}
   */
  public get first(): never {
    throw new IllegalCallError('get first', new EmptyCollectionError(this))
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: Element, startOrEnd: number = 0, endOrStart: number = 0): -1 {
    if (startOrEnd != endOrStart || startOrEnd != 0) throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    return -1
  }

  /**
   * @see {@link Sequence.has}
   */
  public has(element: Element, startOrEnd: number = 0, endOrStart: number = 0): false {
    if (startOrEnd != endOrStart || startOrEnd != 0) throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(this, startOrEnd, endOrStart))
    return false
  }
}

/**
 * 
 */
export const EMPTY_SEQUENCE_INSTANCE: EmptySequence<any> = new EmptySequence<any>()

/**
 * 
 */
export function getEmptySequence<Element>(): EmptySequence<Element> {
  return EMPTY_SEQUENCE_INSTANCE
}