import { equals } from '@cedric-demongivert/gl-tool-utils'
import { areEquallyConstructed } from '../../areEquallyConstructed'

/**
 * 
 */
export class NegativeSequenceIndexError extends RangeError {
    /**
     * 
     */
    public readonly value: number

    /**
     * 
     */
    public readonly cause: Error | undefined

    /**
     * 
     */
    public constructor(value: number, cause?: Error | undefined) {
        super(
            `The index (${value}) is out of bounds : (${value}) ` +
            `is negative.`
        )
        
        this.value = value
        this.cause = cause
    }

    /**
     * 
     */
    public equals(other: unknown): boolean {
        if (other === this) return true

        if (areEquallyConstructed(other, this)) {
            return (
                this.value === other.value &&
                equals(this.cause, other.cause)
            )
        }

        return false
    }
}

/**
 * 
 */
export function createNegativeIndexError(value: number, cause?: Error | undefined) : NegativeSequenceIndexError {
    return new NegativeSequenceIndexError(value, cause)
}