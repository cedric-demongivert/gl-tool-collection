import { CollectionView } from '../CollectionView'

import { Group } from './Group'

/**
 * A read-only view over another collection.
 */
export class GroupView<Element, Wrappable extends Group<Element> = Group<Element>> extends CollectionView<Element, Wrappable> implements Group<Element> {
  /**
   * @see {@link Group.clone}
   */
  public clone(): GroupView<Element, Wrappable> {
    return new GroupView(this._collection)
  }
}

/**
 * 
 */
export function createGroupView<
  Element, 
  Wrappable extends Group<Element> = Group<Element>
>(collection: Wrappable): GroupView<Element, Wrappable> {
  return new GroupView(collection)
}
