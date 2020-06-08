import { Sequence } from '../Sequence'
import { SequenceIterator } from '../SequenceIterator'
import { SequenceView } from '../view/SequenceView'

export class SubSequence<Output> implements Sequence<Output> {
  /**
  * The parent sequence.
  */
  public parent : Sequence<Output>

  /**
  * The index of the origin of this subsequence in the parent sequence (inclusive).
  */
  public from : number

  /**
  * The index of the termination of this subsequence in the parent sequence (exclusive).
  */
  public to : number

  public constructor (sequence : Sequence<Output>) {
    this.parent = sequence
    this.from = sequence.firstIndex
    this.to = sequence.lastIndex + 1
  }

  /**
  * @see Sequence.size
  */
  public get size () : number {
    return this.to - this.from
  }

  /**
  * @see Sequence.get
  */
  public get (index : number) : Output {
    return this.parent.get(index - this.from)
  }

  /**
  * @see Sequence.last
  */
  public get last () : Output {
    return this.to === this.from ? undefined : this.parent.get(this.to - 1)
  }

  /**
  * @see Sequence.lastIndex
  */
  public get lastIndex () : number {
    return this.to === this.from ? 0 : this.size - 1
  }

  /**
  * @see Sequence.first
  */
  public get first () : Output {
    return this.to === this.from ? undefined : this.parent.get(this.from)
  }

  /**
  * @see Sequence.firstIndex
  */
  public get firstIndex () : number {
    return 0
  }

  /**
  * @see Sequence.indexOf
  */
  public indexOf (element : Output) : number {
    return this.parent.indexOfInSubsequence(element, this.from, this.size)
  }

  /**
  * @see Sequence.has
  */
  public has (element : Output) : boolean {
    return this.parent.hasInSubsequence(element, this.from, this.size)
  }

  /**
  * @see Sequence.hasInSubsequence
  */
  public hasInSubsequence (element : Output, offset : number, size : number) : boolean {
    return this.parent.hasInSubsequence(element, this.from + offset, size)
  }

  /**
  * @see Sequence.indexOfInSubsequence
  */
  public indexOfInSubsequence (element : Output, offset : number, size : number) : number {
    return this.parent.indexOfInSubsequence(element, this.from + offset, size)
  }


  /**
  * @see Sequence.clone
  */
  public clone () : SubSequence<Output> {
    const result : SubSequence<Output> = new SubSequence<Output>(this.parent)
    result.from = this.from
    result.to = this.to

    return result
  }

  /**
  * @see Sequence.view
  */
  public view () : Sequence<Output> {
    return SequenceView.wrap(this)
  }

  /**
  * @see Sequence.iterator
  */
  public iterator () : SequenceIterator<Output> {
    const iterator : SequenceIterator<Output> = new SequenceIterator<Output>()

    iterator.sequence = this

    return iterator
  }

  /**
  * @see Sequence[Symbol.iterator]
  */
  public * [Symbol.iterator]() : Iterator<Output> {
    for (let index = this.from, length = this.to; index < length; ++index) {
      yield this.parent.get(index)
    }
  }

  /**
  * @see Sequence.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof SubSequence) {
      return other.parent.equals(this.parent) &&
             other.from === this.from &&
             other.to === this.to
    }

    return false
  }
}

export namespace SubSequence {
  export function clone <Output> (sequence : SubSequence<Output>) : SubSequence<Output> {
    return sequence == null ? sequence : sequence.clone()
  }
}
