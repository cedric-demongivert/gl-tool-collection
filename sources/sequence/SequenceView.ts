import { Sequence } from '../sequence/Sequence'
import { ForwardCursor } from '../cursor/ForwardCursor'

/**
* A read-only view over a given sequence.
*/
export class SequenceView<Element> implements Sequence<Element> {
  /**
   * The underlying sequence.
   */
  private _sequence: Sequence<Element>

  /**
   * @see {@link Sequence.size}
   */
  public get size(): number {
    return this._sequence.size
  }

  /**
   * Create a new view over an existing collection.
   *
   * @param collection - A collection to wrap.
   */
  public constructor(collection: Sequence<Element>) {
    this._sequence = collection
  }

  /**
   * @see {@link Sequence.get}
   */
  public get(index: number): Element | undefined {
    return this._sequence.get(index)
  }

  /**
   * @see {@link Sequence.first}
   */
  public get first(): Element {
    return this._sequence.first
  }

  /**
   * @see {@link Sequence.last}
   */
  public get last(): Element {
    return this._sequence.last
  }

  /**
   * @see {@link Sequence.has}
   */
  public has(value: Element): boolean {
    return this._sequence.has(value)
  }

  /**
   * @see {@link Sequence.clone}
   */
  public clone(): SequenceView<Element> {
    return new SequenceView(this._sequence)
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: Element): number {
    return this._sequence.indexOf(element)
  }

  /**
  * @see {@link Sequence.indexOfInSubsequence}
  */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    return this._sequence.indexOfInSubsequence(element, offset, size)
  }

  /**
   * @see {@link Sequence.hasInSubsequence}
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this._sequence.hasInSubsequence(element, offset, size)
  }

  /**
   * @see {@link Sequence.view}
   */
  public view(): SequenceView<Element> {
    return this
  }

  /**
   * @see {@link Sequence.forward}
   */
  public forward(): ForwardCursor<Element> {
    return this._sequence.forward().view()
  }

  /**
   * @see {@link Sequence.equals}
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof SequenceView) {
      return this._sequence.equals(other._sequence)
    }

    return false
  }

  /**
  * @see {@link Sequence.values}
  */
  public values(): IterableIterator<Element> {
    return this._sequence.values()
  }

  /**
  * @see {@link Sequence[Symbol.iterator]}
  */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._sequence.values()
  }

  /**
   * @see {@link Sequence.toString}
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._sequence.constructor.name + ') ' + Sequence.stringify(this)
  }
}

/**
 * Wrap an existing collection.
 *
 * @param collection - A collection to wrap in a view.
 *
 * @returns A view over the given collection.
 */
export function createSequenceView<Element>(collection: Sequence<Element>): SequenceView<Element> {
  return new SequenceView<Element>(collection)
}
