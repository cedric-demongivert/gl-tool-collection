/**
 * 
 */
export function* nulls(count: number): IterableIterator<null> {
  for (let index = 0; index < count; ++index) {
    yield null
  }
}