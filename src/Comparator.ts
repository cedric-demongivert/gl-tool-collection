/**
 * A function that allows comparing two instances of objects or values.
 *
 * This function must return a number that describes the relationship between the left 
 * operand and the right operand. If the returned value is greater than zero, the left operand 
 * is greater than the right one. If the returned value is less than zero, the left operand 
 * is smaller than the right one. And if the returned number is equal to zero, the left operand 
 * is equal to the right one.
 *
 * @param left - The value to use as a left operand.
 * @param right - The value to use as a right operand.
 *
 * @return A number that describe the type of relation between the operands.
 */
export type Comparator<Left, Right> = (left: Left, right: Right) => number

/**
 * 
 */
export namespace Comparator {
  /**
   * 
   */
  export function compareWithOperator(left: any, right: any): number {
    return left < right ? -1 : (left > right ? 1 : 0)
  }

  /**
   * 
   */
  export function compareNumbers(left: number, right: number): number {
    return left - right
  }

  /**
   * 
   */
  export function compareStrings(left: string, right: string): number {
    return left.localeCompare(right)
  }

  /**
   * 
   */
  export function compareDates(left: Date, right: Date): number {
    return left.valueOf() - right.valueOf()
  }

  /**
   * 
   */
  export function reverse<Left, Right>(comparator: Comparator<Left, Right>): Comparator<Left, Right> {
    return function (left: Left, right: Right): number {
      return -comparator(left, right)
    }
  }

  /**
   * 
   */
  export function withNullsBefore<Left, Right>(comparator: Comparator<Left, Right>): Comparator<Left | null | undefined, Right | null | undefined> {
    return function (left: Left | null | undefined, right: Right | null | undefined): number {
      return left == null ? (right == null ? 0 : -1) : (right == null ? 1 : comparator(left, right))
    }
  }

  /**
   * 
   */
  export function withNullsAfter<Left, Right>(comparator: Comparator<Left, Right>): Comparator<Left | null | undefined, Right | null | undefined> {
    return function (left: Left | null | undefined, right: Right | null | undefined): number {
      return left == null ? (right == null ? 0 : 1) : (right == null ? -1 : comparator(left, right))
    }
  }
}
