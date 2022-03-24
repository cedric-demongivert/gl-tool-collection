/**
 * 
 */
export function* repeat<Element>(value: Element, count: number): IterableIterator<Element> {
  for (let index = 0; index < count; ++index) {
    yield value
  }
}