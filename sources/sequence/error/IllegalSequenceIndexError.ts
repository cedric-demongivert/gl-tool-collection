import { equals } from '@cedric-demongivert/gl-tool-utils'
import { areEquallyConstructed } from '../../areEquallyConstructed'

import { Sequence } from '../Sequence'

/**
 * 
 */
export class IllegalSequenceIndexError extends RangeError {
    /**
     * 
     */
    public readonly value: number

    /**
     * 
     */
    public readonly sequence: Sequence<unknown>

    /**
     * 
     */
    public readonly cause: Error | undefined

    /**
     * 
     */
    public constructor(properties: IllegalSequenceIndexErrorProperties) {
        super(
            `The index (${properties.value}) is out of bounds : (${properties.value}) ` +
            `is not in range [0, ${properties.sequence.size}[`
        )
        this.value = properties.value
        this.sequence = properties.sequence
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
                this.sequence === other.sequence &&
                equals(this.cause, other.cause)
            )
        }

        return false
    }
}

/**
 * 
 */
export type IllegalSequenceIndexErrorProperties = {
    /**
     * 
     */
    value: number, 

    /**
     * 
     */
    sequence: Sequence<unknown>,

    /**
     * 
     */
    cause?: Error | undefined
}

/**
 * 
 */
export function createIllegalSequenceIndexError(properties: IllegalSequenceIndexErrorProperties) : IllegalSequenceIndexError {
    return new IllegalSequenceIndexError(properties)
}