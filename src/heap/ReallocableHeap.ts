import { ReallocableCollection } from '../ReallocableCollection'

import { StaticHeap } from './StaticHeap'

export interface ReallocableHeap<Value>
       extends StaticHeap<Value>, ReallocableCollection<Value>
{ }
