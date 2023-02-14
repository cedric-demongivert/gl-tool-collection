import { equals } from '@cedric-demongivert/gl-tool-utils'
import { areEquallyConstructed } from '../../areEquallyConstructed'

import { Sequence } from '../Sequence'

/**
 * 
 */
export class IllegalSubsequenceError extends RangeError {
    /**
     * 
     */
    public readonly start: number

    /**
     * 
     */
    public readonly end: number

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
    public constructor(sequence: Sequence<unknown>, startOrEnd: number, endOrStart: number, cause?: Error | undefined) {
        const start = Math.min(startOrEnd, endOrStart)
        const end = Math.max(startOrEnd, endOrStart)

        super(
            `The range of indices [${start}, ${end}[ is out of bounds : [${start}, ${end}[ ` +
            `is not a valid subsequence of [0, ${sequence.size}[`
        )

        this.start = start
        this.end = end
        this.sequence = sequence
        this.cause = cause
    }

    /**
     * 
     */
    public equals(other: unknown): boolean {
        if (other === this) return true

        if (areEquallyConstructed(other, this)) {
            return (
                this.start === other.start &&
                this.end === other.end &&
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
export function createIllegalSubsequenceError(sequence: Sequence<unknown>, startOrEnd: number, endOrStart: number, cause?: Error | undefined) : IllegalSubsequenceError {
    return new IllegalSubsequenceError(sequence, startOrEnd, endOrStart, cause)
}