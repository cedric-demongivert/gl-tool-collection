import { RandomAccessCursor } from '../cursor/RandomAccessCursor'

import { Sequence } from './Sequence'

/**
 * An iterator over any sequence instance.
 */
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
   * @see {@link RandomAccessCursor.isInside}
   */
  public isInside(): boolean {
    const index: number = this.index
    return index < this.sequence.size && index > -1
  }

  /**
   * @see {@link RandomAccessCursor.isEnd}
   */
  public isEnd(): boolean {
    return this.index >= this.sequence.size
  }

  /**
   * @see {@link RandomAccessCursor.isStart}
   */
  public isStart(): boolean {
    return this.index < 0
  }

  /**
   * @see {@link RandomAccessCursor.next}
   */
  public next(): void {
    this.index += 1
  }

  /**
   * @see {@link RandomAccessCursor.forward}
   */
  public forward(count: number): void {
    this.index += count
  }

  /**
   * @see {@link RandomAccessCursor.previous}
   */
  public previous(): void {
    this.index -= 1
  }

  /**
   * @see {@link RandomAccessCursor.backward}
   */
  public backward(count: number): void {
    this.index -= count
  }

  /**
   * @see {@link RandomAccessCursor.get}
   */
  public get(): Element {
    return this.sequence.get(this.index)
  }

  /**
   * @see {@link RandomAccessCursor.at}
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
   * @see {@link RandomAccessCursor.clone}
   */
  public clone(): SequenceCursor<Element> {
    return new SequenceCursor<Element>(this.sequence, this.index)
  }

  /**
   * @see {@link RandomAccessCursor.view}
   */
  public view(): RandomAccessCursor<Element> {
    return this._view = this._view || RandomAccessCursor.view(this)
  }

  /**
   * 
   */
  public set(sequence: Sequence<Element>, index: number): void {
    this.sequence = sequence
    this.index = index
  }

  /**
   * @see {@link Comparable.equals}
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
}

/**
 * 
 */
export function createSequenceCursor<Element>(sequence: Sequence<Element>, index: number = 0): SequenceCursor<Element> {
  return new SequenceCursor(sequence, index)
}
