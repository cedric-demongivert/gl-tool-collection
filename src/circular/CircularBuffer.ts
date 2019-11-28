import { StaticCollection } from '../StaticCollection'
import { Sequence } from '../Sequence'

/**
* A circular buffer that continuously drop the first inserted item when an
* element is added beyond of its own capacity.
*/
export interface CircularBuffer<Element>
         extends StaticCollection<Element>, Sequence<Element>
{
  /**
  * @return True if the instance is an instance of circular buffer.
  */
  readonly isCircularBuffer : boolean

  /**
  * Set all cells of this buffer to the given value.
  *
  * @param value - The value to set to all cells of this buffer.
  */
  fill (value : Element) : void

  /**
  * Remove the last value of the buffer and return it.
  *
  * @return The last value of the buffer.
  */
  pop () : Element

  /**
  * Remove the first buffer of the pack and return it.
  *
  * @return The first value of the buffer.
  */
  shift () : Element

  /**
  * Add the given value to the end of the buffer.
  *
  * @param value The value to add to the buffer.
  */
  push (value : Element) : void

  /**
  * Insert the given value at the given location.
  *
  * @param index Where to insert the value.
  * @param value The value to insert.
  */
  insert (index : number, value : Element) : void

  /**
  * Set the given value at the given location.
  *
  * @param index Where to set the value.
  * @param value The value to set.
  */
  set (index : number, value : Element) : void

  /**
  * Delete the value at the given index.
  *
  * This method will preserve this buffer internal element order.
  *
  * @param index The index of the value to delete.
  */
  delete (index : number) : void

  /**
  * Warp out the value at the given index.
  *
  * This method will not preserve this buffer internal element order.
  *
  * @param index The index of the value to warp out.
  */
  warp (index : number) : void

  /**
  * Swap two elements of this buffer.
  *
  * @param first Index of the first element to swap.
  * @param second Index of the second element to swap.
  */
  swap (first : number, second : number) : void

  /**
  * Empty this buffer.
  */
  clear () : void
}
