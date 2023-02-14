import { EMPTY_SEQUENCE_INSTANCE } from './EmptySequence'
import { getEmptySequence } from './EmptySequence'
import { createSequenceView } from './SequenceView'
import { createSubsequence } from './Subsequence'
import { createSequenceCursor } from './SequenceCursor'

/**
 * 
 */
export namespace Sequences {
  /**
   * @see {@link EMPTY_SEQUENCE_INSTANCE}
   */
  export const EMPTY = EMPTY_SEQUENCE_INSTANCE

  /**
   * @see {@link getEmptySequence}
   */
  export const empty = getEmptySequence

  /**
   * @see {@link createSequenceView}
   */
  export const view = createSequenceView

  /**
   * @see {@link createSubsequence}
   */
  export const subsequence = createSubsequence

  /**
   * @see {@link createSequenceCursor}
   */
  export const cursor = createSequenceCursor
}
  