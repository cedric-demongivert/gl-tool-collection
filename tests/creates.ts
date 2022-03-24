import { Factory } from "../src/Factory";

/**
 * 
 */
export function* creates<Element>(factory: Factory<Element>, count: number, context: any = undefined): IterableIterator<Element> {
  for (let index = 0; index < count; ++index) {
    yield factory.call(context)
  }
}