import { equals } from '@cedric-demongivert/gl-tool-utils'

import { areEquallyConstructed } from '../areEquallyConstructed'


/**
 * 
 */
function createMessageFrom(args: Arguments, cause: Error): string {
    const names = Object.keys(args)

    if (names.length < 1) {
        throw new IllegalArgumentsError({ args }, new Error('You MUST give at least one illegal parameter.'))
    }

    let message: string = 'Illegal argument'

    if (names.length > 1) {
        message += 's'
    }

    message += ' '
    message += JSON.stringify(args)
    message += '. '
    message += cause.message
    message += '.'

    return message
}

/**
 * 
 */
export class IllegalArgumentsError<Cause extends Error> extends Error {
    /**
     * 
     */
    public readonly arguments: Arguments

    /**
     * 
     */
    public readonly cause: Cause

    /**
     * 
     */
    public constructor(args: Arguments, cause: Cause) {
        super(createMessageFrom(args, cause))

        this.arguments = args
        this.cause = cause
    }

    /**
     * 
     */
    public equals(other: unknown): boolean {
        if (other === this) return true

        if (areEquallyConstructed(other, this)) {
            const otherArguments = other.arguments
            const thisArguments = this.arguments

            const otherKeys = Object.keys(otherArguments)
            const thisKeys = Object.keys(thisArguments)

            if (otherKeys.length !== thisKeys.length) return false

            for (const key of thisKeys) {
                if (!(key in otherArguments) || otherArguments[key] !== thisArguments) return false
            }

            return equals(this.cause, other.cause)
        }

        return false
    }
}

/**
 * 
 */
type Arguments = { [key:string]: unknown }

/**
 * 
 */
export function createIllegalArgumentError<Cause extends Error>(args: Arguments, cause: Cause) : IllegalArgumentsError<Cause> {
    return new IllegalArgumentsError(args, cause)
}