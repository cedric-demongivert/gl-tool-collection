/**
 * 
 */
export function* range(until: number = Number.POSITIVE_INFINITY, step: number = 1, offset: number = 0): IterableIterator<number> {
  for (let index = offset; index < until; index += step) {
    yield index
  }
}