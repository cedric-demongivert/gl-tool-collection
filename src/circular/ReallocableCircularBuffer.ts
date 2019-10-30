import { ReallocableCollection } from '../ReallocableCollection'
import { CircularBuffer } from './CircularBuffer'

export interface ReallocableCircularBuffer<T>
         extends CircularBuffer<T>, ReallocableCollection<T>
{ }
