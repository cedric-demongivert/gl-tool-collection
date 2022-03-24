import { ForwardIterator } from '../iterator'
import { ForwardIteratorView } from '../iterator/ForwardIteratorView'
import { ImmutableCollection } from '../marker/ImmutableCollection'
import { Sequence } from '../sequence/Sequence'

/**
* A read-only view over a given sequence.
*/
export class SequenceView<Element> implements Sequence<Element>, ImmutableCollection<Element> {
  /**
   * The underlying sequence.
   */
  private _sequence: Sequence<Element>

  /**
   * @see Collection.size
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
   * @see Sequence.get
   */
  public get(index: number): Element {
    return this._sequence.get(index)
  }

  /**
   * @see Sequence.firstIndex
   */
  public get firstIndex(): number {
    return this._sequence.firstIndex
  }

  /**
   * @see Sequence.first
   */
  public get first(): Element {
    return this._sequence.first
  }

  /**
   * @see Sequence.lastIndex
   */
  public get lastIndex(): number {
    return this._sequence.lastIndex
  }

  /**
   * @see Sequence.last
   */
  public get last(): Element {
    return this._sequence.last
  }

  /**
   * @see Collection.has
   */
  public has(value: Element): boolean {
    return this._sequence.has(value)
  }

  /**
   * @see Collection.clone
   */
  public clone(): SequenceView<Element> {
    return SequenceView.wrap(this._sequence)
  }

  /**
   * @see Sequence.indexOf
   */
  public indexOf(element: Element): number | undefined {
    return this._sequence.indexOf(element)
  }

  /**
  * @see Sequence.indexOfInSubsequence
  */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number | undefined {
    return this._sequence.indexOfInSubsequence(element, offset, size)
  }

  /**
   * @see Sequence.hasInSubsequence
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this._sequence.hasInSubsequence(element, offset, size)
  }

  /**
   * @see Sequence.is
   */
  public is(marker: Sequence.MARKER): true
  /**
   * 
   */
  public is(marker: ImmutableCollection.MARKER): true
  /**
 * 
 */
  public is(marker: Symbol): boolean
  public is(marker: Symbol): boolean {
    return marker === Sequence.MARKER || marker === ImmutableCollection.MARKER
  }

  /**
   * @see Sequence.view
   */
  public view(): SequenceView<Element> {
    return this
  }

  /**
   * @see Sequence.view
   */
  public forward(): ForwardIterator<Element> {
    return new ForwardIteratorView(this, this._sequence.forward())
  }

  /**
   * @see Collection.equals
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
  * @see Sequence.iterator
  */
  public values(): IterableIterator<Element> {
    return this._sequence.values()
  }

  /**
  * @see Sequence.iterator
  */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._sequence.values()
  }
}

/**
 * 
 */
export namespace SequenceView {
  /**
   * Wrap an existing collection.
   *
   * @param collection - A collection to wrap in a view.
   *
   * @return A view over the given collection.
   */
  export function wrap<Element>(collection: Sequence<Element>): SequenceView<Element> {
    if (collection instanceof SequenceView) {
      return collection
    } else {
      return new SequenceView<Element>(collection)
    }
  }
}
