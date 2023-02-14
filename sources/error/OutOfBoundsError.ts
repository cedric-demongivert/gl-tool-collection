import { equals } from '@cedric-demongivert/gl-tool-utils'

import { areEquallyConstructed } from '../areEquallyConstructed'

/**
 * 
 */
export class OutOfBoundsError extends RangeError {
    /**
     * 
     */
    public readonly value: number

    /**
     * 
     */
    public readonly lowerBound: number

    /**
     * 
     */
    public readonly upperBound: number

    /**
     * 
     */
    public readonly cause: Error | undefined

    /**
     * 
     */
    public constructor(properties: OutOfBoundsErrorProperties) {
        super(`The value (${properties.value}) is out of bounds : (${properties.value}) is not in range [${properties.lowerBound}, ${properties.upperBound}[`)
        this.value = properties.value
        this.lowerBound = properties.lowerBound
        this.upperBound = properties.upperBound
        this.cause = properties.cause
    }

    /**
     * 
     */
    public equals(other: unknown): boolean {
        if (other === this) return true

        if (areEquallyConstructed(other, this)) {
            return (
                this.value === other.value &&
                this.lowerBound === other.lowerBound &&
                this.upperBound === other.upperBound &&
                equals(this.cause, other.cause)
            )
        }

        return false
    }
}

/**
 * 
 */
export type OutOfBoundsErrorProperties = {
    /**
     * 
     */
    value: number, 

    /**
     * 
     */
    lowerBound: number, 

    /**
     * 
     */
    upperBound: number,

    /**
     * 
     */
    cause?: Error | undefined
}

/**
 * 
 */
export function createOutOfBoundsError(properties: OutOfBoundsErrorProperties) : OutOfBoundsError {
    return new OutOfBoundsError(properties)
}