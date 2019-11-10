import { Collection } from './Collection'

/**
* A collection of element that contains an infinite quantity of elements.
*
* All collection that returns Number.POSITIVE_INFINITY as a size property must
* implement this interface.
*/
export interface InfiniteCollection<Element> extends Collection<Element> {

}
