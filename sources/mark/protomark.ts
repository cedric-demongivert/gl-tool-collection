import { Mark } from "./Mark"

/**
 * Use the prototype chain of a type to store a given mark.
 * 
 * @param mark - The mark to store.
 * 
 * @returns A decorator.
 */
export function protomark(mark: any): typeof mark {
  return function decorator<Class extends Function>(type: Class) {
    if (type.prototype.is == undefined) {
      type.prototype.is = protomark.is
    } else if (type.prototype.is !== protomark.is) {
      throw new Error(
        'Unable to protomark ' + type.name + ' as the given type already define a custom #is method. ' +
        'For optimization purposes, please protomark types that does not declare a custom marking method by ' +
        'using protomark.is as an implementation.'
      )
    }

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
  export function is(mark: Mark.Alike): boolean {
    return this[Mark.resolve(mark)] === true
  }
}