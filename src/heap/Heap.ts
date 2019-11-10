import { Sequence } from '../Sequence'
import { Comparator } from '../Comparator'

export interface Heap<Value> extends Sequence<Value> {
  /**
  * @return The comparator used by this heap.
  */
  readonly comparator : Comparator<Value, Value>

  /**
  * Compare the content of two cell of the heap.
  *
  * @param left - Index of the cell to use as a left operand.
  * @param right - Index of the cell to use as a right operand.
  *
  * @return A comparison number.
  */
  compare (left : number, right : number) : number

  /**
  * Add a value to the heap.
  *
  * @param value - A value to add into the heap.
  */
  push (value : Value) : void

  /**
  * Remove a value from the heap.
  *
  * @param index - Index of the value to remove from the heap.
  */
  delete (index : number) : void

  /**
  * Remove the greatest element from the heap and return it.
  *
  * @return The greatest element of the heap.
  */
  next () : Value

  /**
  * Empty this heap of its elements.
  */
  clear () : void

  /**
  * @return True if this object is a heap.
  */
  readonly isHeap : boolean
}
