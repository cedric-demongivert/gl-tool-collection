import { FiniteCollection } from './FiniteCollection'

/**
* A collection that have a fixed capacity of elements.
*
* A static collection can't be non-finite.
*/
export interface StaticCollection<Element> extends FiniteCollection<Element> {
  /**
  * @return The maximum number of elements that this collection can store with
  *         its available memory.
  */
  readonly capacity : number
}
