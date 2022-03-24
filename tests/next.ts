/**
 * 
 */
export function next<Element>(values: Iterator<Element>, defaultValue: Element = undefined): Element {
  const result: IteratorResult<Element> = values.next()
  return result.done ? defaultValue : result.value
}