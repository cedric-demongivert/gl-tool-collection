import { EmptySequence } from '../sequence/EmptySequence'
import { OrderedGroup } from './OrderedGroup'

/**
 * An empty sequence, e.g., a sequence of zero elements.
 */
export class EmptyOrderedGroup<Element> extends EmptySequence<Element> implements OrderedGroup<Element> {
 
}

/**
 * 
 */
export const EMPTY_ORDERED_GROUP_INSTANCE: EmptyOrderedGroup<any> = new EmptyOrderedGroup<any>()

/**
 * 
 */
export function getEmptyOrderedGroup<Element>(): EmptyOrderedGroup<Element> {
  return EMPTY_ORDERED_GROUP_INSTANCE
}
