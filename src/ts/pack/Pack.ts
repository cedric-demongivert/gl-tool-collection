import { ReallocableCollection } from '../ReallocableCollection'

export interface Pack<T> extends ReallocableCollection<T> {
  /**
  * Return the number of elements in this pack or update the current size of
  * this pack.
  *
  * An update of the size of a pack may reallocate it if the next size excess
  * the current pack capacity.
  *
  * If the given size is greather than the current size all new elements of the
  * pack are setted to its default value that depends of the pack implementation
  * and the kind of values it store.
  */
  size : number

  /**
  * Swap two elements of this pack.
  *
  * @param first - The first element to swap.
  * @param second - The second element to swap.
  */
  swap (first : number, second : number) : void

  /**
  * Set the given value at the given index.
  *
  * If the given index is greather than the current pack size this operation
  * will increase the size of the pack. As a consequence this pack may
  * reallocate itself. For more information about this behaviour please take
  * a look at the size property documentation.
  *
  * @see Pack.size
  *
  * @param index - Where to set the given value.
  * @param value - The value to set.
  */
  set (index : number, value : T) : void

  /**
  * Insert the given value at the given location.
  *
  * All values after the insertion index will be moved to their next available
  * location.
  *
  * This operation may increase the current pack size and as a consequence this
  * pack may reallocate itself. For more information about this behaviour please
  * take a look at the size property documentation.
  *
  * @see Pack.size
  *
  * @param index - Where to insert the given value.
  * @param value - The value to insert.
  */
  insert (index : number, value : T) : void

  /**
  * Push the given value at the end of this pack.
  *
  * This operation will increase the current pack size and as a consequence this
  * pack may reallocate itself. For more information about this behaviour please
  * take a look at the size property documentation.
  *
  * @see Pack.size
  *
  * @param value - The value to push.
  */
  push (value : T) : void

  /**
  * Delete the element at the given index.
  *
  * All values after the insertion index will be moved to their previous
  * available location and the size of will pack will decrement.
  *
  * @param index - Where to delete an element.
  */
  delete (index : number) : void

  /**
  * Sort the content of this pack.
  *
  * This method act like Array#sort except that a comparator MUST be specified.
  *
  * @param comparator - A comparison function to use.
  */
  sort (comparator : (left : T, right : T) => number)

  /**
  * Warp out the element at the given location by replacing it with the last
  * element of this array. This operation will decrease the size of this pack.
  *
  * @param index - Where to warp out an element.
  */
  warp (index : number) : void

  /**
  * Empty this pack of its elements.
  */
  clear () : void
}
