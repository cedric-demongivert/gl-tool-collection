import { Collection } from '../Collection'
import { Mark, Markable } from '../mark'

import { EmptyGroup } from './EmptyGroup'
import { GroupView } from './GroupView'

/**
 * A group is a read-only, unordered collection that does not accept duplicates.
 */
export interface Group<Element> extends Collection<Element>, Markable {
  /**
   * @see Clonable.prototype.clone
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
  export const MARK: Mark = Symbol('gl-tool-collection/mark/collection/group')

  /**
   * @see Mark.Container
   */
  export function mark(): Mark {
    return MARK
  }

  /**
   * Return true if the given collection is a group.
   *
   * @param collection - A collection to assert.
   *
   * @returns True if the given collection is a group.
   */
  export function is<Element>(collection: Markable): collection is Group<Element> {
    return collection.is(MARK)
  }

  /**
   * 
   */
  export function stringify(group: Group<unknown>): string {
    let result: string = '{'
    let iterator: IterableIterator<unknown> = group.values()
    let iteratorResult: IteratorResult<unknown> = iterator.next()

    if (!iteratorResult.done) {
      result += iteratorResult.value.toString()
      iteratorResult = iterator.next()
    }

    while (!iteratorResult.done) {
      result += ', '
      result += iteratorResult.value.toString()
      iteratorResult = iterator.next()
    }

    return result + '}'
  }

  /**
   * @see EmptyGroup.INSTANCE
   */
  export const EMPTY = EmptyGroup.INSTANCE

  /**
   * @see EmptyGroup.get
   */
  export const empty = EmptyGroup.get

  /**
   * @see GroupView.wrap
   */
  export const view = GroupView.wrap
}
