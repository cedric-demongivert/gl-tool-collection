import { createArrayCircularPackAdapter } from './CircularPackAdapter'
import { createUint8CircularPackAdapter } from './CircularPackAdapter'
import { createUint16CircularPackAdapter } from './CircularPackAdapter'
import { createUint32CircularPackAdapter } from './CircularPackAdapter'
import { createInt8CircularPackAdapter } from './CircularPackAdapter'
import { createInt16CircularPackAdapter } from './CircularPackAdapter'
import { createInt32CircularPackAdapter } from './CircularPackAdapter'
import { createFloat32CircularPackAdapter } from './CircularPackAdapter'
import { createFloat64CircularPackAdapter } from './CircularPackAdapter'

/**
 * 
 */
export namespace CircularPacks {
    /**
     * 
     */
    export const any = createArrayCircularPackAdapter

    /**
     * 
     */
    export const uint8 = createUint8CircularPackAdapter

    /**
     * 
     */
    export const uint16 = createUint16CircularPackAdapter

    /**
     * 
     */
    export const uint32 = createUint32CircularPackAdapter

    /**
     * 
     */
    export const int8 = createInt8CircularPackAdapter

    /**
     * 
     */
    export const int16 = createInt16CircularPackAdapter

    /**
     * 
     */
    export const int32 = createInt32CircularPackAdapter

    /**
     * 
     */
    export const float32 = createFloat32CircularPackAdapter

    /**
     * 
     */
    export const float64 = createFloat64CircularPackAdapter
}