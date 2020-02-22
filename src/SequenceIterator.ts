import { Sequence } from './Sequence'
import { CollectionIterator } from './iterator/CollectionIterator'
import { BidirectionalIterator } from './iterator/BidirectionalIterator'

export class SequenceIterator<Element> implements BidirectionalIterator<Element>
{
  /**
  * The parent sequence of this iterator.
  */
  public sequence : Sequence<Element>

  /**
  * The location of the element described by this iterator in the parent sequence.
  */
  public index : number

  /**
  * Instantiate a new random access iterator instance.
  */
  public constructor () {
    this.sequence = null
    this.index = 0
  }

  /**
  * @see Iterator#collection
  */
  public collection () : Sequence<Element> {
    return this.sequence
  }

  /**
  * @see ForwardIterator.hasNext
  */
  public hasNext () : boolean {
    return this.sequence && (
      this.sequence.lastIndex === undefined ||
      this.index < this.sequence.lastIndex
    )
  }

  /**
  * @see BidirectionalIterator.go
  */
  public go (index : number) : void {
    this.index = index
  }

  /**
  * @see ForwardIterator.next
  */
  public next () : void {
    this.index += 1
  }

  /**
  * @see ForwardIterator.forward
  */
  public forward (count : number) : void {
    this.index += count
  }

  /**
  * @see ForwardIterator.end
  */
  public end () : void {
    if (this.sequence && this.sequence.lastIndex !== undefined) {
      this.index = this.sequence.lastIndex
    } else {
      throw new Error(
        'Trying to access the first element of an infinite or ' +
        'semi-finite sequence that does not have an ending element.'
      )
    }
  }

  /**
  * @see BackwardIterator.hasPrevious
  */
  public hasPrevious () : boolean {
    return this.sequence && (
      this.sequence.firstIndex === undefined ||
      this.index > this.sequence.firstIndex
    )
  }

  /**
  * @see BackwardIterator.previous
  */
  public previous () : void {
    this.index -= 1
  }

  /**
  * @see BackwardIterator.backward
  */
  public backward (count : number) : void {
    this.index -= count
  }

  /**
  * @see BackwardIterator.start
  */
  public start () : void {
    if (this.sequence && this.sequence.firstIndex !== undefined) {
      this.index = this.sequence.firstIndex
    } else {
      throw new Error(
        'Trying to access the first element of an infinite or ' +
        'semi-finite sequence that does not have a starting element.'
      )
    }
  }

  /**
  * @see Iterator.get
  */
  public get () : Element {
    return this.sequence.get(this.index)
  }

  /**
  * @see Iterator.move
  */
  public move (iterator : CollectionIterator<Element>) : void {
    if (iterator instanceof SequenceIterator) {
      this.sequence = iterator.sequence
      this.index = iterator.index
    } else {
      throw new Error(
        'Trying to move to a location described by an unsupported type of ' +
        'iterator'
      )
    }
  }

  /**
  * Shallow-copy the given instance.
  *
  * @param toCopy - An instance to shallow copy.
  */
  public copy (toCopy : SequenceIterator<Element>) : void {
    this.sequence = toCopy.sequence
    this.index = toCopy.index
  }

  /**
  * @see Iterator.clone
  */
  public clone () : SequenceIterator<Element> {
    const copy : SequenceIterator<Element> = new SequenceIterator<Element>()

    copy.copy(this)

    return copy
  }

  /**
  * @see Iterator.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof SequenceIterator) {
      return other.sequence === this.sequence &&
             other.index === this.index
    }

    return false
  }
}

export namespace SequenceIterator {
  /**
  * Return a shallow copy of the given iterator.
  *
  * A shallow-copy *b* of an iterator *a* is an instance that follow both
  * properties :
  *  - b !== a
  *  - b.equals(a)
  *
  * @param toCopy - An iterator to copy.
  *
  * @return A shallow copy of the given iterator.
  */
  export function copy <Element> (toCopy : SequenceIterator<Element>) : SequenceIterator<Element> {
    return toCopy.clone()
  }
}
