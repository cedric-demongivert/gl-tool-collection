/**
 * 
 */
export function* zeroes(count: number): IterableIterator<0> {
  for (let index = 0; index < count; ++index) {
    yield 0
  }
}