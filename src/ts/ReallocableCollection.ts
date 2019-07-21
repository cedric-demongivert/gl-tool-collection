import { StaticCollection } from './StaticCollection'

/**
* A static collection that can be reallocated in order to update its capacity.
*/
export interface ReallocableCollection<T> extends StaticCollection<T> {
  /**
  * Update the capacity of this collection by reallocating it.
  *
  * A reallocation may change the internal state of the collection notably if
  * all the elements that it store before its reallocation can't be stored into
  * the new allocated memory. All extra elements will be automatically
  * discarted during the operation.
  *
  * @param capacity - The new capacity to allocate to the collection.
  */
  reallocate (capacity : number) : void

  /**
  * Optimize the capacity of this collection in order to exactely fit the data
  * that is contains.
  */
  fit () : void
}
