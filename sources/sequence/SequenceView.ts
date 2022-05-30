import { Sequence } from '../sequence/Sequence'
import { ForwardCursor } from '../cursor'
import { IsCollection } from '../IsCollection'

/**
* A read-only view over a given sequence.
*/
export class SequenceView<Element> implements Sequence<Element> {
  /**
   * The underlying sequence.
   */
  private _sequence: Sequence<Element>

  /**
   * @see Collection.prototype.size
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
   * @see Collection.prototype[IsCollection.SYMBOL]
   */
  public [IsCollection.SYMBOL](): true {
    return true
  }

  /**
   * @see Collection.prototype.isSequence
   */
  public isSequence(): true {
    return true
  }

  /**
   * @see Collection.prototype.isPack
   */
  public isPack(): false {
    return false
  }

  /**
   * @see Collection.prototype.isList
   */
  public isList(): false {
    return false
  }

  /**
   * @see Collection.prototype.isGroup
   */
  public isGroup(): false {
    return false
  }

  /**
   * @see Collection.prototype.isSet
   */
  public isSet(): false {
    return false
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Element {
    return this._sequence.get(index)
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): Element {
    return this._sequence.first
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): Element {
    return this._sequence.last
  }

  /**
   * @see Collection.prototype.has
   */
  public has(value: Element): boolean {
    return this._sequence.has(value)
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): SequenceView<Element> {
    return SequenceView.wrap(this._sequence)
  }

  /**
   * @see Sequence.prototype.indexOf
   */
  public indexOf(element: Element): number {
    return this._sequence.indexOf(element)
  }

  /**
  * @see Sequence.prototype.indexOfInSubsequence
  */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    return this._sequence.indexOfInSubsequence(element, offset, size)
  }

  /**
   * @see Sequence.prototype.hasInSubsequence
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this._sequence.hasInSubsequence(element, offset, size)
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): SequenceView<Element> {
    return this
  }

  /**
   * @see Collection.prototype.forward
   */
  public forward(): ForwardCursor<Element> {
    return this._sequence.forward().view()
  }

  /**
   * @see Comparable.prototype.equals
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
  * @see Collection.prototype.values
  */
  public values(): IterableIterator<Element> {
    return this._sequence.values()
  }

  /**
  * @see Collection.prototype[Symbol.iterator]
  */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._sequence.values()
  }

  /**
   * @see Object.prototype.toString
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._sequence.constructor.name + ') ' + Sequence.stringify(this)
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
   * @returns A view over the given collection.
   */
  export function wrap<Element>(collection: Sequence<Element>): SequenceView<Element> {
    return new SequenceView<Element>(collection)
  }
}
