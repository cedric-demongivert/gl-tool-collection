/**
 * 
 */
export function* undefineds(count: number): IterableIterator<undefined> {
  for (let index = 0; index < count; ++index) {
    yield undefined
  }
}