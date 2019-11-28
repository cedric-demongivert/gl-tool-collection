import { ReallocableCollection } from '../ReallocableCollection'
import { RandomlyAccessibleCollection } from '../RandomlyAccessibleCollection'
import { Sequence } from '../Sequence'
import { Comparator } from '../Comparator'
import { RandomAccessIterator } from '../iterator/RandomAccessIterator'

export interface Pack<Element>
         extends Sequence<Element>,
                 ReallocableCollection<Element>,
                 RandomlyAccessibleCollection<Element>
{
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
  * Remove the last value of the pack and return it.
  *
  * @return The last value of the pack.
  */
  pop () : Element

  /**
  * Remove the first value of the pack and return it.
  *
  * @return The first value of the pack.
  */
  shift () : Element

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
  set (index : number, value : Element) : void

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
  insert (index : number, value : Element) : void

  /**
  * @see Array.sort
  */
  sort (comparator : Comparator<Element, Element>) : void

  /**
  * Like Array.sort but on a given range of this pack.
  *
  * @param offset - Number of elements to ignore from the start of the pack.
  * @param size - Number of elements to sort.
  */
  subSort (
    offset : number,
    size : number,
    comparator : Comparator<Element, Element>
  ) : void

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
  push (value : Element) : void

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
  * Warp out the element at the given location by replacing it with the last
  * element of this array. This operation will decrease the size of this pack.
  *
  * @param index - Where to warp out an element.
  */
  warp (index : number) : void

  /**
  * Set all cells of this pack to the given value.
  *
  * @param value - The value to set to all cells of this pack.
  */
  fill (value : Element) : void

  /**
  * Allocate a new pack of the same type of this one with the given capacity.
  *
  * @param capacity - Capacity of the new pack to instantiate.
  *
  * @return A new pack instance of the same type of this one with the given capacity.
  */
  allocate (capacity : number) : Pack<Element>

  /**
  * @return A symbol that represents the first element of this collection.
  */
  start () : Symbol

  /**
  * @return A symbol that represents the last element of this collection.
  */
  end () : Symbol

  /**
  * @see Collection.iterator
  */
  iterator () : RandomAccessIterator<Element>

  /**
  * Empty this pack of its elements.
  */
  clear () : void
}
