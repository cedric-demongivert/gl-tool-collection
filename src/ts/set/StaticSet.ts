import { StaticCollection } from '../StaticCollection'
import { Set } from './Set'

export interface StaticSet<T> extends Set<T>, StaticCollection<T> {

}
