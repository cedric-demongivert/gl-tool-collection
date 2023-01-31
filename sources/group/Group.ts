import { toString } from '@cedric-demongivert/gl-tool-utils'

import { Collection } from '../Collection'

import { EMPTY_GROUP_INSTANCE } from './EmptyGroup'
import { getEmptyGroup } from './EmptyGroup'
import { createGroupView } from './GroupView'

/**
 * A group is a read-only, unordered collection that does not accept duplicates.
 */
export interface Group<Element> extends Collection<Element> {
  /**
   * @see {@link Collection.view}
   */
  view(): Group<Element>

  /**
   * @see {@link Collection.clone}
   */
  clone(): Group<Element>
}

/**
 * 
 */
export namespace Group {
  /**
   * 
   */
  export function stringify(group: Group<unknown>): string {
    let result: string = '{'
    let iterator: IterableIterator<unknown> = group.values()
    let iteratorResult: IteratorResult<unknown> = iterator.next()

    if (!iteratorResult.done) {
      result += toString(iteratorResult.value)
      iteratorResult = iterator.next()
    }

    while (!iteratorResult.done) {
      result += ', '
      result += toString(iteratorResult.value)
      iteratorResult = iterator.next()
    }

    return result + '}'
  }

  /**
   * @see {@link EMPTY_GROUP_INSTANCE}
   */
  export const EMPTY = EMPTY_GROUP_INSTANCE

  /**
   * @see {@link getEmptyGroup}
   */
  export const empty = getEmptyGroup

  /**
   * @see {@link createGroupView}
   */
  export const view = createGroupView
}
