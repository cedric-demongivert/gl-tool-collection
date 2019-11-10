import { StaticCollection } from '../StaticCollection'

import { Heap } from './Heap'

export interface StaticHeap<Value>
       extends Heap<Value>, StaticCollection<Value>
{ }
