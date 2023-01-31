import { Group } from './Group'
import { EmptyCollection } from '../EmptyCollection'

/**
 * An empty sequence, e.g., a sequence of zero elements.
 */
export class EmptyGroup<Element> extends EmptyCollection<Element> implements Group<Element> {

}

/**
 * 
 */
export const EMPTY_GROUP_INSTANCE: EmptyGroup<any> = new EmptyGroup<any>()

/**
 * 
 */
export function getEmptyGroup<Element>(): EmptyGroup<Element> {
  return EMPTY_GROUP_INSTANCE
}
