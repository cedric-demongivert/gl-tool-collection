import { toString } from '@cedric-demongivert/gl-tool-utils'

import { Collection } from '../Collection'

import { EmptyGroup } from './EmptyGroup'
import { GroupView } from './GroupView'

/**
 * A group is a read-only, unordered collection that does not accept duplicates.
 */
export interface Group<Element> extends Collection<Element> {
  /**
   * @see {@link Collection.isGroup}
   */
  isGroup(): true

  /**
   * @see {@link Clonable.clone}
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
  export function is<Element>(collection: Collection<Element>): collection is Group<Element> {
    return collection.isGroup()
  }

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
   * @see {@link EmptyGroup.INSTANCE}
   */
  export const EMPTY = EmptyGroup.INSTANCE

  /**
   * @see {@link EmptyGroup.get}
   */
  export const empty = EmptyGroup.get

  /**
   * @see {@link GroupView.wrap}
   */
  export const view = GroupView.wrap
}
