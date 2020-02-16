/**
* A collection size.
*/
export type Size = number

export namespace Size {
  /**
  * Value that describe an infinity quantity of element.
  */
  export const INFINITY : Size = 0x7fffffff

  /**
  * Return a string representation of the given size.
  *
  * @param size - A size to stringify.
  *
  * @return A string representation of the given size.
  */
  export function toString (size : Size) : string {
    switch (size) {
      case INFINITY: return 'infinity'
      default: return size.toString()
    }
  }
}
