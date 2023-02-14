import { equals } from '@cedric-demongivert/gl-tool-utils'

import { areEquallyConstructed } from '../areEquallyConstructed'

/**
 * 
 */
export class IllegalCallError<Cause extends Error> extends Error {
    /**
     * 
     */
    public readonly method?: Function | undefined

    /**
     * 
     */
    public readonly identifier: string

    /**
     * 
     */
    public readonly cause: Cause

    /**
     * 
     */
    public constructor(method: Function | string, cause: Cause) {
        const identifier: string = typeof method === 'string' ? method : method.name

        super(`Illegal call to "${identifier}". ${cause.message}.`)

        this.method = typeof method === 'string' ? undefined : method
        this.identifier = identifier
        this.cause = cause
    }

    /**
     * 
     */
    public equals(other: unknown): boolean {
        if (other === this) return true

        if (areEquallyConstructed(other, this)) {
            return (
                this.method === other.method &&
                this.identifier === other.identifier &&
                equals(this.cause, other.cause)
            )
        }

        return false
    }
}

/**
 * 
 */
export function createIllegalCallError<Cause extends Error>(method: Function | string, cause: Cause) : IllegalCallError<Cause> {
    return new IllegalCallError(method, cause)
}