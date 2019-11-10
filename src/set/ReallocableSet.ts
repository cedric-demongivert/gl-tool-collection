import { ReallocableCollection } from '../ReallocableCollection'
import { StaticSet } from './StaticSet'

export interface ReallocableSet<Element>
         extends StaticSet<Element>,
                 ReallocableCollection<Element>
{ }
