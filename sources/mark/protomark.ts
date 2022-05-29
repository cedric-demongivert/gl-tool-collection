import { Mark } from "./Mark"
import { Markable } from "./Markable"

/**
 * Use the prototype chain of a type to store a given mark.
 * 
 * @param mark - The mark to store.
 * 
 * @returns A decorator.
 */
export function protomark(mark: Mark.Alike) {
  return function decorator<Class extends Function>(type: Class) {
    type.prototype[Mark.resolve(mark)] = true
    return type
  }
}

/**
 * 
 */
export namespace protomark {
  /**
   * Implements the "is" method by using the prototype chain of the given instance to check if it contains a given mark.
   */
  export function is(instance: Function, mark: Mark.Alike): boolean {
    return instance.prototype[Mark.resolve(mark)] === true || Mark.resolve(mark) === Markable.MARK
  }
}