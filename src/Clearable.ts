/**
* A clearable object is an object taht can be reset to the state it was just after it's instantiation.
*/
export interface Clearable {
  /**
  * Reset this instance to the state it was just after it's instantiation.
  */
  clear(): void
}
