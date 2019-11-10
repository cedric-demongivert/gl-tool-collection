import { RandomlyAccessibleCollection } from '../RandomlyAccessibleCollection'
import { StaticSet } from './StaticSet'

export interface SparseDenseSet
         extends StaticSet<number>,
                 RandomlyAccessibleCollection<number>
{ }
