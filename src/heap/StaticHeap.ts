import { StaticCollection } from '../StaticCollection'
import { Heap } from './Heap'

export interface StaticHeap<Element>
         extends Heap<Element>,
                 StaticCollection<Element>
{ }
