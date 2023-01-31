import { SequenceView } from '../sequence/SequenceView'

import { OrderedGroup } from './OrderedGroup'

/**
 * A read-only view over another collection.
 */
export class OrderedGroupView<
  Element, 
  Wrappable extends OrderedGroup<Element> = OrderedGroup<Element>
> extends SequenceView<Element, Wrappable> implements OrderedGroup<Element> {
  /**
   * @see {@link Clonable.clone}
   */
  public clone(): OrderedGroupView<Element, Wrappable> {
    return new OrderedGroupView(this._collection)
  }
}

/**
 * 
 */
export function createOrderedGroupView<
  Element,
  Wrappable extends OrderedGroup<Element> = OrderedGroup<Element>
>(collection: Wrappable): OrderedGroupView<Element, Wrappable> {
  return new OrderedGroupView(collection)
}
