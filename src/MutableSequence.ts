import { Sequence } from '@library/Sequence'

export interface MutableSequence<Element> extends Sequence<Element> {
  /**
  * Return the number of elements in this sequence or update the current size of
  * this sequence. An update of the size of a sequence may reallocate it if the
  * next size excess the sequence capacity. For more information about this
  * behaviour please take a look at this sequence implementation.
  *
  * If the given size is greather than the current size all new elements of
  * the sequence are setted to this sequence default value that depends of the
  * sequence implementation and the kind of values it store.
  */
  size : number

  /**
  * Remove the last value of the sequence if any and return it.
  *
  * If this sequence does not have a last element due to is semi-finite or
  * non-finite status this method MUST throw an error.
  *
  * @return The removed value of the sequence if any.
  */
  pop () : Element

  /**
  * Remove the first value of the sequence if any and return it.
  *
  * If this sequence does not have a first element due to is semi-finite or
  * non-finite status this method MUST throw an error.
  *
  * @return The removed value of the sequence if any.
  */
  shift () : Element

  /**
  * Swap two elements of the sequence.
  *
  * @param first - Index of the first element to swap in the sequence.
  * @param second - Index of the second element to swap in the sequence.
  */
  swap (first : number, second : number) : void

  /**
  * Update the value at the given index in this sequence.
  *
  * If the given index is greather than the current sequence size this operation
  * will increase the size of the sequence. As a consequence this sequence may
  * reallocate itself. For more information about this behaviour please take
  * a look at this sequence implementation documentation.
  *
  * @param index - Index of the value to update in this sequence.
  * @param value - The value to set at the given location.
  */
  set (index : number, value : Element) : void

  /**
  * Insert the given value at the given location in this sequence.
  *
  * All values after the insertion index will be moved to their next available
  * location.This operation may increase the current sequence size and as a
  * consequence this sequence may reallocate itself. For more information about
  * this behaviour please take a look at this sequence implementation
  * documentation.
  *
  * @param index - Where to insert the given value.
  * @param value - The value to insert.
  */
  insert (index : number, value : Element) : void

  /**
  * Push the given value at the end of this sequence.
  *
  * This operation will increase the current sequence size and as a consequence
  * this sequence may reallocate itself. For more information about this
  * behaviour please take a look at this sequence implementation.
  *
  * If this sequence does not have a last element due to is semi-finite or
  * non-finite status this method MUST throw an error.
  *
  * @param value - The value to push.
  */
  push (value : Element) : void

  /**
  * Push the given value at the begining of this sequence.
  *
  * This operation will increase the current sequence size and as a consequence
  * this sequence may reallocate itself. For more information about this
  * behaviour please take a look at this sequence implementation.
  *
  * If this sequence does not have a begining element due to is semi-finite or
  * non-finite status this method MUST throw an error.
  *
  * @param value - The value to unshift.
  */
  unshift (value : Element) : void

  /**
  * Delete the element at the given index in this sequence.
  *
  * All values after the insertion index will be moved to their previous
  * available location and the size of will sequence will decrement.
  *
  * @param index - Where to delete an element.
  */
  delete (index : number) : void

  /**
  * Warp out the element at the given location by replacing it with any element
  * of this sequence. This operation will decrease the size of this sequence.
  *
  * A warp MUST be faster than a deletion by selecting a random element of the
  * sequence in order to replace the removed one. The selected element MUST
  * accelerate the deletion operation by not shifting left or right each
  * element cosecutive to the removed one.
  *
  * @param index - Where to warp out an element.
  */
  warp (index : number) : void

  /**
  * Set all element of this sequence to the given value.
  *
  * @param value - The value to set to all element of this sequence.
  */
  fill (value : Element) : void

  /**
  * @return A new instance that is a shallow copy of this pack.
  */
  clone () : MutableSequence<Element>

  /**
  * Shallow copy an existing sequence.
  *
  * This method may update the capacity of this sequence and as a result may
  * reallocate it. For more information about this behaviour please take a look
  * at this sequence implementation.
  *
  * @param toCopy - An existing instance to copy.
  */
  copy (toCopy : Sequence<Element>) : void

  /**
  * Remove all element of this sequence.
  */
  clear () : void
}
