import { Sequence } from '@library/Sequence'
import { Comparator } from '@library/Comparator'

/**
* Default comparator used in order to bissect a collection.
*
* @see Comparator
*/
function defaultComparator (left : any, right : any) : number {
  return left < right ? -1 : (left > right ? 1 : 0)
}

/**
* Binary search an element in an ordered sequence and returns its location.
*
* If the given element does not exists into the given sequence this method
* will return its insertion index in the form of a negative number :
* (-insertionIndex -1)
*
* @param sequence - A sequence to search.
* @param value - A value to search.
* @param [comparator = defaultComparator] - A comparison function to use.
* @oaran [offset = 0] - Number of element to skip from the start of the sequence.
* @oaran [size = sequence.size - offset] - Number of element to search.
*/
export function bissect<Item, Search> (
  sequence : Sequence<Item>,
  value : Search,
  comparator : Comparator<Search, Item> = defaultComparator,
  offset : number = 0,
  size : number = sequence.size - offset,
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

export namespace bissect {
  /**
  * @see bissect
  *
  * A bissection that always return the FIRST element that match in the parent
  * sequence.
  *
  * @param sequence - A sequence to search.
  * @param value - A value to search.
  * @param [comparator = defaultComparator] - A comparison function to use.
  * @oaran [offset = 0] - Number of element to skip from the start of the sequence.
  * @oaran [size = sequence.size - offset] - Number of element to search.
  */
  export function first <Item, Search> (
    sequence : Sequence<Item>,
    value : Search,
    comparator : Comparator<Search, Item> = defaultComparator,
    offset : number = 0,
    size : number = sequence.size - offset
  ) {
    let result : number = bissect(sequence, value, comparator, offset, size)

    if (result < 0) return result

    while (result > 0 && comparator(value, sequence.get(result - 1)) === 0) {
      result -= 1
    }

    return result
  }

  /**
  * @see bissect
  *
  * A bissection that always return the LAST element that match in the parent
  * sequence.
  *
  * @param sequence - A sequence to search.
  * @param value - A value to search.
  * @param [comparator = defaultComparator] - A comparison function to use.
  * @oaran [offset = 0] - Number of element to skip from the start of the sequence.
  * @oaran [size = sequence.size - offset] - Number of element to search.
  */
  export function last <Item, Search> (
    sequence : Sequence<Item>,
    value : Search,
    comparator : Comparator<Search, Item> = defaultComparator,
    offset : number = 0,
    size : number = sequence.size - offset
  ) {
    let result : number = bissect(sequence, value, comparator, offset, size)

    if (result < 0) return result

    const end : number = sequence.size - 1

    while (result < end && comparator(value, sequence.get(result + 1)) === 0) {
      result += 1
    }

    return result
  }

  /**
  * @see bissect
  *
  * A bissection that use an invertion of the given comparator.
  *
  * @param sequence - A sequence to search.
  * @param value - A value to search.
  * @param [comparator = defaultComparator] - A comparison function to use.
  * @oaran [offset = 0] - Number of element to skip from the start of the sequence.
  * @oaran [size = sequence.size - offset] - Number of element to search.
  */
  export function invert <Item, Search> (
    sequence : Sequence<Item>,
    value : Search,
    comparator : Comparator<Search, Item> = defaultComparator,
    offset : number = 0,
    size : number = sequence.size - offset,
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
