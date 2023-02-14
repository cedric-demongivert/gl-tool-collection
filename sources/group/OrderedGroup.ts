import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { Collection } from '../Collection'

import { Sequence } from '../sequence/Sequence'

import { Group } from './Group'

/**
 * 
 */
export interface OrderedGroup<Element> extends Group<Element>, Sequence<Element> {
  /**
   * @see {@link Sequence.has}
   */
  has<Key = Element>(key: Key, comparator?: Comparator<Key, Element>, startOrEnd?: number, endOrStart?: number): boolean

  /**
   * @see {@link Clonable.clone}
   */
  clone(): OrderedGroup<Element>

  /**
   * @see {@link Collection.view}
   */
  view(): OrderedGroup<Element>
}