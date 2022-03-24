/**
 * 
 */
export function* range(size: number = Number.POSITIVE_INFINITY): IterableIterator<number> {
  for (let index = 0; index < size; ++index) {
    yield index
  }
}