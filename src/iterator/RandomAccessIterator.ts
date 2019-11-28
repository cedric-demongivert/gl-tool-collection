import { RandomlyAccessibleCollection } from '../RandomlyAccessibleCollection'
import { START, END } from './symbols'
import { Iterator } from './Iterator'
import { BidirectionalIterator } from './BidirectionalIterator'

export class RandomAccessIterator<Element>
  implements BidirectionalIterator<Element>
{
  private _collection : RandomlyAccessibleCollection<Element>
  private _offset : number

  /**
  * Instantiate a new random access iterator instance.
  */
  public RandomAccessIterator () {
    this._collection = null
    this._offset = 0
  }

  /**
  * @return The number of elements skipped from the begining of the collection.
  */
  public getOffset () : number {
    return this._offset
  }

  /**
  * @see Iterator.getCollection
  */
  public getCollection () : RandomlyAccessibleCollection<Element> {
    return this._collection
  }

  /**
  * Reset this iterator to the start of the given collection.
  *
  * @param collection - The new collection to iterate.
  */
  public reset (collection : RandomlyAccessibleCollection<Element>) : void {
    this._collection = collection
    this._offset = 0
  }

  /**
  * @see ForwardIterator.hasNext
  */
  public hasNext () : boolean {
    return this._collection && this._offset < this._collection.size
  }

  /**
  * @see ForwardIterator.next
  */
  public next () : void {
    this._offset += 1
  }

  /**
  * @see ForwardIterator.forward
  */
  public forward (count : number) : void {
    this._offset += count
  }

  /**
  * @see ForwardIterator.end
  */
  public end () : void {
    this._offset = this._collection ? this._collection.size - 1 : 0
  }

  /**
  * @see BackwardIterator.hasPrevious
  */
  public hasPrevious () : boolean {
    return this._collection && this._offset > 0
  }

  /**
  * @see BackwardIterator.previous
  */
  public previous () : void {
    this._offset -= 1
  }

  /**
  * @see BackwardIterator.backward
  */
  public backward (count : number) : void {
    this._offset -= count
  }

  /**
  * @see BackwardIterator.start
  */
  public start () : void {
    this._offset = 0
  }

  /**
  * @see Iterator.get
  */
  public get () : Element {
    return this._collection.get(this._offset)
  }

  /**
  * @see Iterator.move
  */
  public move (iterator : Iterator<Element> | Symbol) : void {
    if (iterator instanceof Symbol) {
      if (iterator === START) this.start()
      else if (iterator === END) this.end()
    }
    if (iterator instanceof RandomAccessIterator) {
      this._collection = iterator._collection
      this._offset = iterator._offset
    }
  }

  /**
  * Update the number of elements to skip from the begining of the underlying
  * collection.
  *
  * @param offset - The new number of elements to skip from the begining of the
  *                 underlying collection.
  */
  public setOffset (offset : number) : void {
    this._offset = offset
  }

  /**
  * @see Iterator.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Symbol) {
      return other === START && this._offset === 0 ||
             other === END &&
             this._offset === (this._collection ? this._collection.size - 1 : 0)
    }

    if (other instanceof RandomAccessIterator) {
      return other._collection === this._collection &&
             other._offset === this._offset
    }

    return false
  }
}
