import { StaticCollection } from '../StaticCollection'
import { Set } from './Set'

export interface StaticSet<Element>
         extends Set<Element>, StaticCollection<Element>
{ }
