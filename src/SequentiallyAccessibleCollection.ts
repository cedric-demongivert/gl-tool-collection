import { Collection } from './Collection'

/**
* A sequentially accessible collection is a collection that allows to reach its
* elements only by accessing them in a given order.
*
* All collection that returns true to the property isSequentiallyAccessible must
* implement this interface.
*
* @see Collection#isSequentiallyAccessible
*/
export interface SequentiallyAccessibleCollection<Element>
         extends Collection<Element>
{}
