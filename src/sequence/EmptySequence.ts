import { ImmutableCollection } from '../marker/ImmutableCollection'

import { Sequence } from './Sequence'
import { SequenceIterator } from './SequenceIterator'

/**
 * An empty sequence, e.g., a sequence of zero elements.
 */
export class EmptySequence<Output = any> implements Sequence<Output>, ImmutableCollection<Output> {
  /**
   * @see Sequence.size
   */
  public get size(): number {
    return 0
  }

  /**
   * @see Sequence.get
   */
  public get(index: number): undefined {
    return undefined
  }

  /**
   * @see Sequence.last
   */
  public get last(): undefined {
    return undefined
  }

  /**
   * @see Sequence.lastIndex
   */
  public get lastIndex(): number {
    return 0
  }

  /**
   * @see Sequence.first
   */
  public get first(): undefined {
    return undefined
  }

  /**
   * @see Sequence.firstIndex
   */
  public get firstIndex(): number {
    return 0
  }

  /**
   * @see Sequence.indexOf
   */
  public indexOf(element: any): undefined {
    return undefined
  }

  /**
   * @see Sequence.indexOfInSubsequence
   */
  public indexOfInSubsequence(element: Output, offset: number, size: number): undefined {
    return undefined
  }

  /**
   * @see Sequence.has
   */
  public has(element: Output): false {
    return false
  }

  /**
   * @see Sequence.hasInSubsequence
   */
  public hasInSubsequence(element: Output, offset: number, size: number): false {
    return false
  }

  /**
   * @see Sequence.is
   */
  public is(marker: Sequence.MARKER): true

  /**
   * @see Sequence.is
   */
  public is(marker: ImmutableCollection.MARKER): true
  /**
   * @see Sequence.is
   */
  public is(marker: Symbol): boolean {
    return (
      marker === Sequence.MARKER ||
      marker === ImmutableCollection.MARKER
    )
  }

  /**
   * @see Sequence.clone
   */
  public clone(): EmptySequence<Output> {
    return this
  }

  /**
   * @see Sequence.view
   */
  public view(): EmptySequence<Output> {
    return this
  }

  /**
   * @see Sequence.iterator
   */
  public forward(): SequenceIterator<Output> {
    const iterator: SequenceIterator<Output> = new SequenceIterator<Output>()

    iterator.sequence = this

    return iterator
  }

  /**
   * 
   */
  public *values(): IterableIterator<Output> {

  }

  /**
   * @see Sequence[Symbol.iterator]
   */
  public [Symbol.iterator](): IterableIterator<Output> {
    return this.values()
  }

  /**
   * @see Sequence.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    return other instanceof EmptySequence
  }
}

export namespace EmptySequence {
  /**
   * 
   */
  export const INSTANCE: EmptySequence<any> = new EmptySequence<any>()

  /**
   * 
   */
  export function create<Output>(): EmptySequence<Output> {
    return INSTANCE
  }
}
