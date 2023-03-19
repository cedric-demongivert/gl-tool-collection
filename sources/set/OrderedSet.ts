import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { OrderedGroup } from '../group/OrderedGroup'

import { Collection } from '../Collection'

import { Set } from './Set'

/**
 * A set is an unordered collection that does not accept duplicates.
 */
export interface OrderedSet<Element> extends OrderedGroup<Element>, Set<Element> {
  /**
   * @see {@link Sequence.has}
   */
  has(element: Element, startOrEnd?: number, endOrStart?: number): boolean

  /**
   * @see {@link Collection.view}
   */
  view(): OrderedGroup<Element>

  /**
   * @see {@link Clonable.clone}
   */
  clone(): OrderedSet<Element>
}