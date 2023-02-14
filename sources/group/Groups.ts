import { toString } from '@cedric-demongivert/gl-tool-utils'

import { Group } from './Group'

import { EMPTY_GROUP_INSTANCE } from './EmptyGroup'
import { getEmptyGroup } from './EmptyGroup'
import { createGroupView } from './GroupView'

/**
 * 
 */
export namespace Groups {
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
