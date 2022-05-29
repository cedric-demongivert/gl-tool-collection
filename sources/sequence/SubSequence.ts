import { Mark, protomark } from '../mark'
import { Sequence } from '../Sequence'

import { SequenceCursor } from './SequenceCursor'

/** 
 * 
 */
export class SubSequence<Output> implements Sequence<Output> {
  /**
   * The parent sequence.
   */
  public parent: Sequence<Output>

  /**
   * The index of the origin of this subsequence in the parent sequence (inclusive).
   */
  public from: number

  /**
   * The index of the termination of this subsequence in the parent sequence (exclusive).
   */
  public to: number

  /**
   * 
   */
  private _view: Sequence<Output>

  /**
   * 
   */
  public constructor(sequence: Sequence<Output>) {
    this.parent = sequence
    this.from = 0
    this.to = sequence.size
    this._view = Sequence.view(this)
  }

  /**
   * @see Sequence.prototype.size
   */
  public get size(): number {
    return this.to - this.from
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Output | undefined {
    return this.parent.get(index - this.from)
  }

  /**
   * @see Sequence.prototype.getLast
   */
  public getLast(): Output | undefined {
    return this.to === this.from ? undefined : this.parent.get(this.to - 1)
  }

  /**
   * @see Sequence.prototype.first
   */
  public getFirst(): Output | undefined {
    return this.to === this.from ? undefined : this.parent.get(this.from)
  }

  /**
   * @see Sequence.prototype.indexOf
   */
  public indexOf(element: Output): number {
    return this.parent.indexOfInSubsequence(element, this.from, this.size)
  }

  /**
   * @see Sequence.prototype.has
   */
  public has(element: Output): boolean {
    return this.parent.hasInSubsequence(element, this.from, this.size)
  }

  /**
   * @see Sequence.prototype.hasInSubsequence
   */
  public hasInSubsequence(element: Output, offset: number, size: number): boolean {
    return this.parent.hasInSubsequence(element, this.from + offset, size)
  }

  /**
   * @see Sequence.prototype.indexOfInSubsequence
   */
  public indexOfInSubsequence(element: Output, offset: number, size: number): number {
    return this.parent.indexOfInSubsequence(element, this.from + offset, size)
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): SubSequence<Output> {
    const result: SubSequence<Output> = new SubSequence<Output>(this.parent)
    result.from = this.from
    result.to = this.to

    return result
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): Sequence<Output> {
    return this._view
  }

  /**
   * @see Collection.prototype.forward
   */
  public forward(): SequenceCursor<Output> {
    return new SequenceCursor<Output>(this, 0)
  }

  /**
   * @see Collection.prototype.values
   */
  public * values(): IterableIterator<Output> {
    for (let index = this.from, length = this.to; index < length; ++index) {
      yield this.parent.get(index)!
    }
  }

  /**
   * @see Collection.prototype[Symbol.iterator]
   */
  public [Symbol.iterator](): IterableIterator<Output> {
    return this.values()
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof SubSequence) {
      return other.parent.equals(this.parent) &&
        other.from === this.from &&
        other.to === this.to
    }

    return false
  }

  /**
   * @see Markable.prototype.is
   */
  public is(markLike: Mark.Alike): boolean {
    return protomark.is(this.constructor, markLike)
  }
}

/**
 * 
 */
export namespace SubSequence {
}
