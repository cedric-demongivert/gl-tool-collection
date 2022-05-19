import { Cursor } from './Cursor'

/**
 * A cursor over a sequence of values that can only move from an element to its consecutive one.
 */
export interface ForwardCursor<Element> extends Cursor<Element> {
  /**
   * Returns the location of this cursor into its underlying sequence.
   * 
   * @return Returns the location of this cursor into its underlying sequence.
   */
  readonly index: number

  /**
   * @see CollectionIterator.clone
   */
  clone(): ForwardCursor<Element>

  /**
   * Moves this cursor forward of the given number of elements.
   *
   * @param count - Number of elements to skip.
   * 
   * @return This cursor instance for chaining purposes.
   */
  forward(count: number): this

  /**
   * Returns true if this cursor points to the end of its underlying sequence.
   * 
   * @return True if this cursor points to the end of its underlying sequence.
   */
  isEnd(): boolean

  /**
   * Returns true if this cursor points to an element of its underlying sequence.
   * 
   * @return True if this cursor points to an element of its underlying sequence.
   */
  isInside(): boolean

  /**
   * Moves this cursor to the next available element or the end of its underlying sequence.
   * 
   * @return This cursor instance for chaining purposes.
   */
  next(): this
}
