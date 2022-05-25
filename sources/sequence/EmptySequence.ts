import { ForwardCursor } from '../cursor'
import { Readonly, Empty, protomark } from '../mark'

import { Collection } from '../Collection'
import { Sequence } from './Sequence'

/**
 * An empty sequence, e.g., a sequence of zero elements.
 */
@protomark(Readonly)
@protomark(Empty)
@protomark(Collection)
@protomark(Sequence)
export class EmptySequence<Element> implements Sequence<Element> {
  /**
   * @see Collection.prototype.size
   */
  public get size(): number {
    return 0
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): undefined {
    return undefined
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): undefined {
    return undefined
  }

  /**
   * @see Sequence.prototype.lastIndex
   */
  public get lastIndex(): number {
    return 0
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): undefined {
    return undefined
  }

  /**
   * @see Sequence.prototype.firstIndex
   */
  public get firstIndex(): number {
    return 0
  }

  /**
   * @see Sequence.prototype.indexOf
   */
  public indexOf(element: any): undefined {
    return undefined
  }

  /**
   * @see Sequence.prototype.indexOfInSubsequence
   */
  public indexOfInSubsequence(element: Element, offset: number, size: number): undefined {
    return undefined
  }

  /**
   * @see Collection.prototype.has
   */
  public has(element: Element): false {
    return false
  }

  /**
   * @see Sequence.prototype.hasInSubsequence
   */
  public hasInSubsequence(element: Element, offset: number, size: number): false {
    return false
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): this {
    return this
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): this {
    return this
  }

  /**
   * @see Collection.prototype.forward
   */
  public forward(): ForwardCursor<Element> {
    return ForwardCursor.empty()
  }

  /**
   * @see Collection.prototype.values
   */
  public *values(): IterableIterator<Element> {

  }

  /**
   * @see Collection.prototype[Symbol.iterator]
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this.values()
  }

  /**
   * @see Markable.prototype.is
   */
  public is = protomark.is

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    return other instanceof EmptySequence
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
