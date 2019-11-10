import { Collection } from './Collection'

/**
* A randomly accessible collection is a collection from wich all elements are
* accessible in constant time.
*
* All collection that returns true to the property isRandomlyAccessible must
* implement this interface.
*
* @see Collection#isRandomlyAccessible
*/
export interface RandomlyAccessibleCollection<Element>
         extends Collection<Element>
{}
