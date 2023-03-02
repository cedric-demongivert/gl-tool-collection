import { Sequence } from "./Sequence"

/**
 * 
 */
export interface SortableSequence<Element> extends Sequence<Element> { 
  /**
   * Swaps two elements of the sequence.
   * 
   * @throws {@link IllegalArgumentsError<IllegalSequenceIndexError>} (MUST) if the first index is out of bounds.
   * @throws {@link IllegalArgumentsError<IllegalSequenceIndexError>} (MUST) if the second index is out of bounds.
   *
   * @param first - Index of the first element to swap in the sequence.
   * @param second - Index of the second element to swap in the sequence.
   */
  swap(first: number, second: number): void
}