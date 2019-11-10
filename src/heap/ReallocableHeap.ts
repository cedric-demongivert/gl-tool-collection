import { ReallocableCollection } from '../ReallocableCollection'
import { StaticHeap } from './StaticHeap'

export interface ReallocableHeap<Element>
         extends StaticHeap<Element>,
                 ReallocableCollection<Element>
{ }
