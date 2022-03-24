/**
 * 
 */
export function* pick<Element>(iterator: Iterator<Element>, count: number, defaultValue: Element = undefined): Generator<Element> {
  for (let index = 0; index < count; ++index) {
    const next: IteratorResult<Element> = iterator.next()
    yield next.done ? defaultValue : next.value
  }
}