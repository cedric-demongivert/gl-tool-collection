import { StaticCollection } from './StaticCollection'

/**
* A static collection that is able to change is capacity on-the-fly.
*/
export interface ReallocableCollection<T> extends StaticCollection<T> {
  /**
  * Update the capacity of this collection by reallocating it.
  *
  * A reallocation may change the internal state of the collection notably if
  * its previous size exceed its new capacity. All extra elements MUST be
  * automatically discarded during the operation.
  *
  * @param capacity - The new capacity to allocate to the collection.
  */
  reallocate (capacity : number) : void

  /**
  * Reallocate this collection in order to match it's capacity to the number of
  * element that it contains.
  */
  fit () : void
}
