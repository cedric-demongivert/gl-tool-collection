import { equals } from '@cedric-demongivert/gl-tool-utils'

import { areEquallyConstructed } from '../areEquallyConstructed'
import { Collection } from '../Collection'

/**
 * 
 */
export class InfiniteCollectionError extends Error {
    /**
     * 
     */
    public readonly collection: Collection<unknown>

    /**
     * 
     */
    public readonly cause: Error | undefined

    /**
     * 
     */
    public constructor(collection: Collection<unknown>, cause?: Error | undefined) {
        super(`Illegal access to an infinite collection (${collection.constructor.name}).`)
        this.collection = collection
        this.cause = cause
    }

    /**
     * 
     */
    public equals(other: unknown): boolean {
        if (other === this) return true

        if (areEquallyConstructed(other, this)) {
            return (
                this.collection === other.collection &&
                equals(this.cause, other.cause)
            )
        }

        return false
    }
}

/**
 * 
 */
export function createInfiniteCollectionError(collection: Collection<unknown>, cause?: Error | undefined) : InfiniteCollectionError {
    return new InfiniteCollectionError(collection, cause)
}