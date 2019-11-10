import { Collection } from './Collection'

/**
* A collection of element that contains a finite quantity of elements.
*
* All collection that return a finite number from its size property must
* implement this interface.
*
* @see Collection#size
*/
export interface FiniteCollection<Element> extends Collection<Element> {

}
