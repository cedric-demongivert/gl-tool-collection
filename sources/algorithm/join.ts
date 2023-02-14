import { Empty, toString } from "@cedric-demongivert/gl-tool-utils"

/**
 * 
 */
export function join(sequence: Iterable<unknown>, glue: string = ', '): string {
    let result: string = Empty.STRING
    let iterator: Iterator<unknown> = sequence[Symbol.iterator]()
    let iteratorResult: IteratorResult<unknown> = iterator.next()

    if (!iteratorResult.done) {
        result += toString(iteratorResult.value)
        iteratorResult = iterator.next()
    }

    while (!iteratorResult.done) {
        result += glue
        result += toString(iteratorResult.value)
        iteratorResult = iterator.next()
    }

    return result
}