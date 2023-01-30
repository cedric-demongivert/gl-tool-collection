import { EmptyCollection } from '../EmptyCollection'

import { Sequence } from './Sequence'

/**
 * An empty sequence, e.g., a sequence of zero elements.
 */
export class EmptySequence<Element> extends EmptyCollection<Element> implements Sequence<Element> {
  /**
   * @see {@link Sequence.get}
   */
  public get(index: number): undefined {
    return undefined
  }

  /**
   * @see {@link Sequence.last}
   */
  public get last(): Element {
    return undefined!
  }

  /**
   * @see {@link Sequence.first}
   */
  public get first(): Element {
    return undefined!
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: any): number {
    return -1
  }

  /**
   * @see {@link Sequence.indexOfInSubsequence}
   */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    return -1
  }

  /**
   * @see {@link Sequence.hasInSubsequence}
   */
  public hasInSubsequence(element: Element, offset: number, size: number): false {
    return false
  }

  /**
   * @see {@link Sequence.equals}
   */
  public equals(other: any): boolean {
    if (other === this) return true
    return isEmptySequence(other)
  }

  /**
   * @see {@link Sequence.toString}
   */
  public toString(): string {
    return this.constructor.name + ' ' + Sequence.stringify(this)
  }
}

/**
 * 
 */
export function isEmptySequence(candidate: unknown): candidate is EmptySequence<unknown> {
  return candidate != null && candidate.constructor === EmptySequence
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