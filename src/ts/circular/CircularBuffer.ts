import { StaticCollection } from '../StaticCollection'

/**
* A circular buffer that continuously drop the first inserted item when an
* element is added beyond of its own capacity.
*/
export interface CircularBuffer<T> extends StaticCollection<T> {
  /**
  * @return True if the instance is an instance of circular buffer.
  */
  public readonly isCircularBuffer : boolean

  /**
  * Add the given value to the end of the buffer.
  *
  * @param value The value to add to the buffer.
  */
  public push (value : T) : void

  /**
  * Insert the given value at the given location.
  *
  * @param index Where to insert the value.
  * @param value The value to insert.
  */
  public insert (index : number, value : T) : void

  /**
  * Set the given value at the given location.
  *
  * @param index Where to set the value.
  * @param value The value to set.
  */
  public set (index : number, value : T) : void

  /**
  * Delete the value at the given index.
  *
  * This method will preserve this buffer internal element order.
  *
  * @param index The index of the value to delete.
  */
  public delete (index : number) : void

  /**
  * Warp out the value at the given index.
  *
  * This method will not preserve this buffer internal element order.
  *
  * @param index The index of the value to warp out.
  */
  public warp (index : number) : void

  /**
  * Swap two elements of this buffer.
  *
  * @param first Index of the first element to swap.
  * @param second Index of the second element to swap.
  */
  public swap (first : number, second : number) : void

  /**
  * Empty this buffer.
  */
  public clear () : void
}
