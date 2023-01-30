import { ForwardCursor } from '../cursor/ForwardCursor'
import { CollectionView } from '../CollectionView'

import { Sequence } from './Sequence'

/**
* A read-only view over a given sequence.
*/
export class SequenceView<
  Element,
  Wrappable extends Sequence<Element> = Sequence<Element>
> extends CollectionView<Element, Wrappable> 
  implements Sequence<Element> 
{
  /**
   * @see {@link Sequence.get}
   */
  public get(index: number): Element | undefined {
    return this._collection.get(index)
  }

  /**
   * @see {@link Sequence.first}
   */
  public get first(): Element {
    return this._collection.first
  }

  /**
   * @see {@link Sequence.last}
   */
  public get last(): Element {
    return this._collection.last
  }

  /**
   * @see {@link Sequence.clone}
   */
  public clone(): SequenceView<Element, Wrappable> {
    return new SequenceView(this._collection)
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: Element): number {
    return this._collection.indexOf(element)
  }

  /**
  * @see {@link Sequence.indexOfInSubsequence}
  */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    return this._collection.indexOfInSubsequence(element, offset, size)
  }

  /**
   * @see {@link Sequence.hasInSubsequence}
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this._collection.hasInSubsequence(element, offset, size)
  }

  /**
   * @see {@link Sequence.equals}
   */
  public equals(other: any): boolean {
    if (other === this) return true

    if (isSequenceView(other)) {
      return this._collection === other._collection
    }

    return false
  }

  /**
   * @see {@link Sequence.toString}
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._collection.constructor.name + ') ' + Sequence.stringify(this)
  }
}

/**
 * 
 */
export function isSequenceView<Element>(candidate: unknown): candidate is SequenceView<Element> {
  return candidate != null && candidate.constructor === SequenceView
}

/**
 * Wrap an existing collection.
 *
 * @param collection - A collection to wrap in a view.
 *
 * @returns A view over the given collection.
 */
export function createSequenceView<
  Element,
  Wrappable extends Sequence<Element> = Sequence<Element>
>(collection: Wrappable): SequenceView<Element, Wrappable> {
  return new SequenceView(collection)
}
