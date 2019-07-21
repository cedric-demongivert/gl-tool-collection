import { Collection } from './Collection'

/**
* A collection that have a fixed capacity of elements.
*/
export interface StaticCollection<T> extends Collection<T> {
  /**
  * @return The number of elements that this collection can store without reallocating memory.
  */
  readonly capacity : number
}
