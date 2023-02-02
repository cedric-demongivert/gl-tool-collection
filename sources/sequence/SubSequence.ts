import { Sequence } from './Sequence'
import { SequenceCursor } from './SequenceCursor'

/** 
 * 
 */
export class Subsequence<Output> implements Sequence<Output> {
  /**
   * The parent sequence.
   */
  public sequence: Sequence<Output>

  /**
   * The index of the origin of this Subsequence in the parent sequence (inclusive).
   */
  public from: number

  /**
   * The index of the termination of this Subsequence in the parent sequence (exclusive).
   */
  public to: number

  /**
   * 
   */
  public constructor(sequence: Sequence<Output>, from: number = 0, to: number = Number.POSITIVE_INFINITY) {
    this.sequence = sequence
    this.from = from
    this.to = to
  }

  /**
   * @see {@link Sequence.size}
   */
  public get size(): number {
    const parentSize = this.sequence.size
    const from = this.from

    if (parentSize < from) return 0

    return (this.to > parentSize ? parentSize : this.to) - from
  }

  /**
   * @see {@link Sequence.get}
   */
  public get(index: number): Output | undefined {
    return (index < this.size) ? this.sequence.get(index + this.from) : undefined
  }

  /**
   * @see {@link Sequence.last}
   */
  public get last(): Output | undefined  {
    const size = this.size
    return size > 0 ? this.sequence.get(this.from + size - 1) : undefined
  }

  /**
   * @see {@link Sequence.first}
   */
  public get first(): Output | undefined  {
    return this.size > 0 ? this.sequence.get(this.from) : undefined
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: Output): number {
    return this.sequence.indexOfInSubsequence(element, this.from, this.size)
  }

  /**
   * @see {@link Sequence.has}
   */
  public has(element: Output): boolean {
    return this.sequence.hasInSubsequence(element, this.from, this.size)
  }

  /**
   * @see {@link Sequence.hasInSubsequence}
   */
  public hasInSubsequence(element: Output, offset: number, size: number): boolean {
    const thisSize = this.size

    if (offset < thisSize)  {
      const maxSize = thisSize - offset
      return this.sequence.hasInSubsequence(element, this.from + offset, size < maxSize ? size : maxSize)
    } else {
      return false
    }
  }

  /**
   * @see {@link Sequence.indexOfInSubsequence}
   */
  public indexOfInSubsequence(element: Output, offset: number, size: number): number {
    const thisSize = this.size

    if (thisSize > 0 && offset < thisSize)  {
      const maxSize = thisSize - offset
      return this.sequence.indexOfInSubsequence(element, this.from + offset, size < maxSize ? size : maxSize)
    } else {
      return -1
    }
  }

  /**
   * @see {@link Clonable.clone}
   */
  public clone(): Subsequence<Output> {
    return new Subsequence<Output>(this.sequence, this.from, this.to)
  }

  /**
   * @see {@link Collection.view}
   */
  public view(): Sequence<Output> {
    return this
  }

  /**
   * @see {@link Collection.forward}
   */
  public forward(): SequenceCursor<Output> {
    return new SequenceCursor<Output>(this, 0)
  }

  /**
   * @see {@link Collection.values}
   */
  public * values(): IterableIterator<Output> {
    for (let index = this.from, length = this.to; index < length; ++index) {
      yield this.sequence.get(index)!
    }
  }

  /**
   * @see {@link Sequence.stringify}
   */
  public stringify(): string {
    return Sequence.stringify(this)
  }

  /**
   * @see {@link Collection[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<Output> {
    return this.values()
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Subsequence) {
      return (
        other.sequence === this.sequence &&
        other.from === this.from &&
        other.to === this.to
      )
    }

    return false
  }
}


/**
 * 
 */
export function isSubsequence(candidate: unknown): candidate is Subsequence<unknown> {
  return candidate != null && candidate.constructor === Subsequence
}

/**
 * 
 */
export function createSubsequence<Element>(collection: Sequence<Element>, from: number, to: number): Subsequence<Element> {
  return new Subsequence(collection, from, to)
}
