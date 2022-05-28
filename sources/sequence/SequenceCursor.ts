import { Cursor, ForwardCursor, BidirectionalCursor, RandomAccessCursor } from '../cursor'
import { Markable, protomark } from '../mark'

import { Sequence } from './Sequence'

/**
 * An iterator over any sequence instance.
 */
@protomark(Cursor)
@protomark(ForwardCursor)
@protomark(BidirectionalCursor)
@protomark(RandomAccessCursor)
export class SequenceCursor<Element> implements RandomAccessCursor<Element>
{
  /**
   * The parent sequence of this iterator.
   */
  public sequence: Sequence<Element>

  /**
   * The location of the element described by this iterator in the parent sequence.
   */
  public index: number

  /**
   *  
   */
  private _view: RandomAccessCursor<Element> | undefined

  /**
   * 
   */
  public constructor(sequence: Sequence<Element>, index: number = 0) {
    this.sequence = sequence
    this.index = index
    this._view = undefined
  }

  /**
   * @see ForwardCursor.prototype.isInside
   */
  public isInside(): boolean {
    const index: number = this.index
    return index < this.sequence.size && index > -1
  }

  /**
   * @see ForwardCursor.prototype.isEnd
   */
  public isEnd(): boolean {
    return this.index >= this.sequence.size
  }

  /**
   * @see BidirectionalCursor.prototype.isStart
   */
  public isStart(): boolean {
    return this.index < 0
  }

  /**
   * @see ForwardCursor.prototype.next
   */
  public next(): void {
    this.index += 1
  }

  /**
   * @see ForwardCursor.prototype.forward
   */
  public forward(count: number): void {
    this.index += count
  }

  /**
   * @see BidirectionalCursor.prototype.previous
   */
  public previous(): void {
    this.index -= 1
  }

  /**
   * @see BidirectionalCursor.prototype.backward
   */
  public backward(count: number): void {
    this.index -= count
  }

  /**
   * @see Cursor.prototype.get
   */
  public get(): Element | undefined {
    return this.sequence.get(this.index)
  }

  /**
   * @see BidirectionalIterator.prototype.go
   */
  public at(index: number): void {
    this.index = index
  }

  /**
   * 
   */
  public copy(toCopy: SequenceCursor<Element>): void {
    this.sequence = toCopy.sequence
    this.index = toCopy.index
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): SequenceCursor<Element> {
    return new SequenceCursor<Element>(this.sequence, this.index)
  }

  /**
   * @see Cursor.prototype.view
   */
  public view(): RandomAccessCursor<Element> {
    return this._view = this._view || RandomAccessCursor.view(this)
  }

  /**
   * 
   */
  public wrap(sequence: Sequence<Element>, index: number): void {
    this.sequence = sequence
    this.index = index
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof SequenceCursor) {
      return (
        other.sequence === this.sequence &&
        other.index === this.index
      )
    }

    return false
  }

  /**
   * @see Markable.prototype.is
   */
  public is: Markable.Predicate
}

/**
 * 
 */
SequenceCursor.prototype.is = protomark.is

/**
 * 
 */
export namespace SequenceCursor {

}
