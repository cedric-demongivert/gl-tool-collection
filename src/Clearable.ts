/**
 * A clearable object is an object that can be reset to the state in which it was after its instantiation.
 */
export interface Clearable {
  /**
   * Reset this instance to the state it was just after its instantiation.
   */
  clear(): void
}
