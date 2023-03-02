import { Comparator } from '@cedric-demongivert/gl-tool-utils'
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
  public get(index: number): Element {
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
  public indexOf(element: Element, startOrEnd: number = 0, endOrStart: number = this.size): number {
    return this._collection.indexOf(element, startOrEnd, endOrStart)
  }

  /**
   * @see {@link Sequence.has}
   */
  public has(element: Element, startOrEnd: number = 0, endOrStart: number = this.size): boolean {
    return this._collection.has(element, startOrEnd, endOrStart)
  }
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
