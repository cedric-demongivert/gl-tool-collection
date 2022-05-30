import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { Sequence } from '../Sequence'

/**
 * Binary search an element in an ordered sequence and returns its location.
 *
 * If the given element does not exist in the given sequence, this method will 
 * return its insertion index in the form of a negative number : (-insertionIndex -1).
 *
 * @param sequence - A sequence to search.
 * @param value - A value to search.
 * @param [comparator = Comparator.compareWithOperator] - A comparison function to use.
 * @oaran [offset = 0] - Number of element to skip from the start of the sequence.
 * @oaran [size = sequence.size - offset] - Number of element to search.
 */
export function bisect<Item, Search>(
  sequence: Sequence<Item>,
  value: Search,
  comparator: Comparator<Search, Item> = Comparator.compareWithOperator,
  offset: number = 0,
  size: number = sequence.size - offset,
) {
  if (size > 0) {
    let left = offset
    let right = offset + size

    while (left !== right) {
      const cursor = left + ((right - left) >>> 1)
      const comparison = comparator(value, sequence.get(cursor))

      if (comparison === 0) {
        return cursor
      } else if (comparison > 0) {
        left = cursor + 1
      } else {
        right = cursor
      }
    }

    return - (left + 1)
  } else {
    return -1
  }
}

/**
 * 
 */
export namespace bisect {
  /**
   * @see bisect
   *
   * A bisection implementation that always returns the FIRST element of the parent sequence that matches the given value.
   *
   * @param sequence - A sequence to search.
   * @param value - A value to search.
   * @param [comparator = Comparator.compareWithOperator] - A comparison function to use.
   * @oaran [offset = 0] - Number of element to skip from the start of the sequence.
   * @oaran [size = sequence.size - offset] - Number of element to search.
   */
  export function first<Item, Search>(
    sequence: Sequence<Item>,
    value: Search,
    comparator: Comparator<Search, Item> = Comparator.compareWithOperator,
    offset: number = 0,
    size: number = sequence.size - offset
  ) {
    let result: number = bisect(sequence, value, comparator, offset, size)

    if (result < 0) return result

    while (result > 0 && comparator(value, sequence.get(result - 1)) === 0) {
      result -= 1
    }

    return result
  }

  /**
   * @see bisect
   *
   * A bisection implementation that always returns the LAST element of the parent sequence that matches the given value.
   *
   * @param sequence - A sequence to search.
   * @param value - A value to search.
   * @param [comparator = Comparator.compareWithOperator] - A comparison function to use.
   * @oaran [offset = 0] - Number of element to skip from the start of the sequence.
   * @oaran [size = sequence.size - offset] - Number of element to search.
   */
  export function last<Item, Search>(
    sequence: Sequence<Item>,
    value: Search,
    comparator: Comparator<Search, Item> = Comparator.compareWithOperator,
    offset: number = 0,
    size: number = sequence.size - offset
  ) {
    let result: number = bisect(sequence, value, comparator, offset, size)

    if (result < 0) return result

    const end: number = sequence.size - 1

    while (result < end && comparator(value, sequence.get(result + 1)) === 0) {
      result += 1
    }

    return result
  }

  /**
   * @see bisect
   *
   * A bisection that use an invertion of the given comparator.
   *
   * @param sequence - A sequence to search.
   * @param value - A value to search.
   * @param [comparator = Comparator.compareWithOperator] - A comparison function to use.
   * @param [offset = 0] - Number of element to skip from the start of the sequence.
   * @param [size = sequence.size - offset] - Number of element to search.
   */
  export function invert<Item, Search>(
    sequence: Sequence<Item>,
    value: Search,
    comparator: Comparator<Search, Item> = Comparator.compareWithOperator,
    offset: number = 0,
    size: number = sequence.size - offset,
  ) {
    if (size > 0) {
      let left = offset
      let right = offset + size

      while (left !== right) {
        const cursor = left + ((right - left) >>> 1)
        const comparison = -comparator(value, sequence.get(cursor))

        if (comparison === 0) {
          return cursor
        } else if (comparison > 0) {
          left = cursor + 1
        } else {
          right = cursor
        }
      }

      return - (left + 1)
    } else {
      return -1
    }
  }
}
