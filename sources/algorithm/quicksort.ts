import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { List } from '../list/List'

/**
 * Quicksort the given sequence.
 *
 * @param sequence - A sequence to quicksort.
 * @param [comparator = Comparator.compareWithOperator] - A definition of the order to use.
 * @param [offset = 0] - Number of element to skip from the begining of the sequence.
 * @param [size = sequence.size - offset] - Number of element to sort.
 */
export function quicksort<Element>(
  sequence: List<Element>,
  comparator: Comparator<Element, Element> = Comparator.compareWithOperator,
  offset: number = 0,
  size: number = sequence.size - offset
) { rquicksort(sequence, comparator, offset, offset + size - 1) }

/**
 * 
 */
function rquicksort<Element>(
  sequence: List<Element>,
  comparator: Comparator<Element, Element>,
  left: number,
  right: number
) {
  if (left < right) {
    const pivot: number = partition(sequence, comparator, left, right)
    rquicksort(sequence, comparator, left, pivot)
    rquicksort(sequence, comparator, pivot + 1, right)
  }
}

/**
 * 
 */
function partition<Element>(
  sequence: List<Element>,
  comparator: Comparator<Element, Element>,
  left: number, right: number
): number {
  const pivot: Element = sequence.get((left + right) >>> 1)!
  let lower: number = left - 1
  let upper: number = right + 1

  do {
    do {
      lower += 1
    } while (comparator(sequence.get(lower)!, pivot) < 0)

    do {
      upper -= 1
    } while (comparator(sequence.get(upper)!, pivot) > 0)

    if (lower >= upper) {
      return upper
    }

    sequence.swap(lower, upper)
  } while (true)
}
