import { Comparator } from '@cedric-demongivert/gl-tool-utils'
import { IllegalArgumentsError } from '../error/IllegalArgumentsError'

import { SortableSequence } from '../sequence/SortableSequence'
import { IllegalSubsequenceError } from '../sequence/error/IllegalSubsequenceError'

/**
 * Quicksort the given sequence.
 *
 * @param sequence - A sequence to quicksort.
 * @param [comparator = Comparator.compareWithOperator] - A definition of the order to use.
 * @param [startOrEnd = 0]
 * @param [endOrStart = sequence.size] 
 */
export function quicksort<Element>(
  sequence: SortableSequence<Element>,
  comparator: Comparator<Element, Element> = Comparator.compareWithOperator,
  startOrEnd: number = 0,
  endOrStart: number = sequence.size
) { 
  const size = sequence.size
  const start = startOrEnd < endOrStart ? startOrEnd : endOrStart
  const end = startOrEnd < endOrStart ? endOrStart : startOrEnd

  if (start < 0 || start > size || end > size) {
    throw new IllegalArgumentsError({ startOrEnd, endOrStart }, new IllegalSubsequenceError(sequence, startOrEnd, endOrStart))
  }
  
  rquicksort(sequence, comparator, start, end - 1) 
}

/**
 * 
 */
function rquicksort<Element>(
  sequence: SortableSequence<Element>,
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
  sequence: SortableSequence<Element>,
  comparator: Comparator<Element, Element>,
  left: number, 
  right: number
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
