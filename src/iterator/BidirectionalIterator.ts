import { ForwardIterator } from './ForwardIterator'
import { BackwardIterator } from './BackwardIterator'

/**
* Bidirectional iterators are iterators that can move from element to element by
* following a sequence in any order.
*/
export interface BidirectionalIterator<Element>
         extends ForwardIterator<Element>, BackwardIterator<Element>
{
  /**
  * Go to the given location in the parent sequence.
  *
  * @param index - Index of the element to go to.
  */
  go (index : number) : void

  /**
  * @see CollectionIterator#clone
  */
  clone () : BidirectionalIterator<Element>
}
