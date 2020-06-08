import { Sequence } from '../Sequence'
import { SequenceIterator } from '../SequenceIterator'

export class EmptySequence<Output> implements Sequence<Output> {
  /**
  * @see Sequence.size
  */
  public get size () : number {
    return 0
  }

  /**
  * @see Sequence.get
  */
  public get (index : number) : Output {
    return undefined
  }

  /**
  * @see Sequence.last
  */
  public get last () : Output {
    return undefined
  }

  /**
  * @see Sequence.lastIndex
  */
  public get lastIndex () : number {
    return 0
  }

  /**
  * @see Sequence.first
  */
  public get first () : Output {
    return undefined
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
  public indexOf (element : Output): number {
    return -1
  }

  /**
  * @see Sequence.indexOfInSubsequence
  */
  public indexOfInSubsequence (element : Output, offset : number, size : number): number {
    return -1
  }

  /**
  * @see Sequence.has
  */
  public has (element : Output) : boolean {
    return false
  }

  /**
  * @see Sequence.hasInSubsequence
  */
  public hasInSubsequence (element : Output, offset : number, size : number) : boolean {
    return false
  }

  /**
  * @see Sequence.clone
  */
  public clone () : EmptySequence<Output> {
    return this
  }

  /**
  * @see Sequence.view
  */
  public view () : EmptySequence<Output> {
    return this
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
  }

  /**
  * @see Sequence.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    return other instanceof EmptySequence
  }
}

export namespace EmptySequence {
  export const INSTANCE : EmptySequence<any> = new EmptySequence<any>()

  export function clone <Output> (sequence : EmptySequence<Output>) : EmptySequence<Output> {
    return sequence
  }

  export function of <Output> () : EmptySequence<Output> {
    return INSTANCE
  }
}
