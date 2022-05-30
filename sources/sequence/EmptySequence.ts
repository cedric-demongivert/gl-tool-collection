import { Collection } from '../Collection'
import { EmptyCollection } from '../EmptyCollection'

import { Sequence } from './Sequence'

/**
 * An empty sequence, e.g., a sequence of zero elements.
 */
export class EmptySequence<Element> extends EmptyCollection<Element> implements Sequence<Element> {
  /**
   * @see Collection.prototype.isSequence
   */
  public isSequence(): true {
    return true
  }

  /**
   * @see Collection.prototype.size
   */
  public get size(): number {
    return 0
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Element {
    return undefined!
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): Element {
    return undefined!
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): Element {
    return undefined!
  }

  /**
   * @see Sequence.prototype.indexOf
   */
  public indexOf(element: any): number {
    return -1
  }

  /**
   * @see Sequence.prototype.indexOfInSubsequence
   */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    return -1
  }

  /**
   * @see Sequence.prototype.hasInSubsequence
   */
  public hasInSubsequence(element: Element, offset: number, size: number): false {
    return false
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    return other instanceof EmptySequence
  }

  /**
   * @see Object.prototype.toString
   */
  public toString(): string {
    return this.constructor.name + ' ' + Sequence.stringify(this)
  }
}

/**
 * 
 */
export namespace EmptySequence {
  /**
   * 
   */
  export const INSTANCE: EmptySequence<any> = new EmptySequence<any>()

  /**
   * 
   */
  export function get<Element>(): EmptySequence<Element> {
    return INSTANCE
  }
}
