import { CollectionIterator } from '../iterator/CollectionIterator'
import { BidirectionalIterator } from '../iterator/BidirectionalIterator'
import { CircularBuffer } from '../circular/CircularBuffer'

export class CircularBufferIterator<Element> implements BidirectionalIterator<Element>
{
  /**
  * The parent pack of this iterator.
  */
  public buffer : CircularBuffer<Element>

  /**
  * The location of the element described by this iterator in the parent pack.
  */
  public index : number

  /**
  * Instantiate a new random access iterator instance.
  */
  public constructor () {
    this.buffer = null
    this.index = 0
  }

  /**
  * @see Iterator.collection
  */
  public collection () : CircularBuffer<Element> {
    return this.buffer
  }

  /**
  * @see ForwardIterator.hasNext
  */
  public hasNext () : boolean {
    return this.buffer && this.index < this.buffer.size
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
    this.index = this.buffer ? this.buffer.lastIndex : 0
  }

  /**
  * @see BackwardIterator.hasPrevious
  */
  public hasPrevious () : boolean {
    return this.buffer && this.index > 0
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
    this.index = 0
  }

  /**
  * @see Iterator.get
  */
  public get () : Element {
    return this.buffer.get(this.index)
  }

  /**
  * @see Iterator.move
  */
  public move (iterator : CollectionIterator<Element>) : void {
    if (iterator instanceof CircularBufferIterator) {
      this.buffer = iterator.buffer
      this.index = iterator.index
    } else {
      throw new Error(
        'Trying to move to a location described by an unsupported type of ' +
        'iterator'
      )
    }
  }

  /**
  * @see BidirectionalIterator.go
  */
  public go (index : number) : void {
    this.index = index
  }

  /**
  * Shallow-copy the given instance.
  *
  * @param toCopy
  */
  public copy (toCopy : CircularBufferIterator<Element>) : void {
    this.buffer = toCopy.buffer
    this.index = toCopy.index
  }

  /**
  * @see Iterator.clone
  */
  public clone () : CircularBufferIterator<Element> {
    const copy : CircularBufferIterator<Element> = new CircularBufferIterator<Element>()

    copy.copy(this)

    return copy
  }

  /**
  * @see Iterator.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof CircularBufferIterator) {
      return other.buffer === this.buffer &&
             other.index === this.index
    }

    return false
  }
}

export namespace CircularBufferIterator {
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
  export function copy <Element> (toCopy : CircularBufferIterator<Element>) : CircularBufferIterator<Element> {
    return toCopy.clone()
  }
}
