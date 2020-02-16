import { CollectionIterator } from '@library/iterator/CollectionIterator'
import { BidirectionalIterator } from '@library/iterator/BidirectionalIterator'
import { Pack } from '@library/Pack'

export class PackIterator<Element> implements BidirectionalIterator<Element>
{
  /**
  * The parent pack of this iterator.
  */
  public pack : Pack<Element>

  /**
  * The location of the element described by this iterator in the parent pack.
  */
  public index : number

  /**
  * Instantiate a new random access iterator instance.
  */
  public constructor () {
    this.pack = null
    this.index = 0
  }

  /**
  * @see Iterator.collection
  */
  public collection () : Pack<Element> {
    return this.pack
  }

  /**
  * @see ForwardIterator.hasNext
  */
  public hasNext () : boolean {
    return this.pack && this.index < this.pack.size
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
    this.index = this.pack ? this.pack.lastIndex : 0
  }

  /**
  * @see BackwardIterator.hasPrevious
  */
  public hasPrevious () : boolean {
    return this.pack && this.index > 0
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
    return this.pack.get(this.index)
  }

  /**
  * @see Iterator.move
  */
  public move (iterator : CollectionIterator<Element>) : void {
    if (iterator instanceof PackIterator) {
      this.pack = iterator.pack
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
  public copy (toCopy : PackIterator<Element>) : void {
    this.pack = toCopy.pack
    this.index = toCopy.index
  }

  /**
  * @see Iterator.clone
  */
  public clone () : PackIterator<Element> {
    const copy : PackIterator<Element> = new PackIterator<Element>()

    copy.copy(this)

    return copy
  }

  /**
  * @see Iterator.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof PackIterator) {
      return other.pack === this.pack &&
             other.index === this.index
    }

    return false
  }
}

export namespace PackIterator {
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
  export function copy <Element> (toCopy : PackIterator<Element>) : PackIterator<Element> {
    return toCopy.clone()
  }
}
