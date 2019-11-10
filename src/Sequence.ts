import { Collection } from './Collection'

/**
* A sequence is an ordered collection of elements in wich repetitions are
* allowed. A sequence can be non-finite.
*
* All collections that returns true to the readonly property isSequence must
* implement this interface.
*
* @see Collection#isSequence
*/
export interface Sequence<Element> extends Collection<Element> {

}
