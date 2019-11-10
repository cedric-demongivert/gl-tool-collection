import { ReallocableCollection } from '../ReallocableCollection'
import { CircularBuffer } from './CircularBuffer'

/**
* A circular buffer that allows to change its capacity on-the-fly.
*/
export interface ReallocableCircularBuffer<Element>
         extends CircularBuffer<Element>,
                 ReallocableCollection<Element>
{ }
