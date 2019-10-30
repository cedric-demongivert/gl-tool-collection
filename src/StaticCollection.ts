import { Collection } from './Collection'

/**
* A collection that have a fixed capacity of elements.
*
* A static collection can't be non-finite.
*/
export interface StaticCollection<Element> extends Collection<Element> {
  /**
  * @return The maximum number of elements that this collection can store with
  *         its available memory.
  */
  readonly capacity : number
}
