import { ReallocableCollection } from '../ReallocableCollection'
import { StaticSet } from './StaticSet'

export interface ReallocableSet<T>
       extends StaticSet<T>, ReallocableCollection<T>
{ }
