import { ForwardIterator } from './ForwardIterator'
import { BackwardIterator } from './BackwardIterator'

export interface BidirectionalIterator<Element>
         extends ForwardIterator<Element>,
                 BackwardIterator<Element>
{ }
