/**
 * Use the prototype chain of a type to store a given mark.
 * 
 * @param mark - The mark to store.
 * 
 * @return A decorator.
 */
export function Protomark(mark: symbol) {
  return function decorator<Class extends Function>(type: Class) {
    if (type.prototype.is == undefined) {
      type.prototype.is = Protomark.is
    } else if (type.prototype.is !== Protomark.is) {
      throw new Error(
        'Unable to protomark ' + type.name + ' as the given type already define a custom #is method.' +
        ' For optimization purposes, please protomark types that does not declare a custom marking method.'
      )
    }

    type.prototype[mark] = true

    return type
  }
}

/**
 * 
 */
export namespace Protomark {
  /**
   * Implements the "is" method by using the prototype chain of the given instance to check if it contains a mark.
   */
  export function is(mark: symbol): boolean {
    return this[mark] === true
  }
}