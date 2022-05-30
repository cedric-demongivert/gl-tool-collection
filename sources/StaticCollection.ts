/**
 * A static collection is a collection that allocates all the memory it needs to store its element at its 
 * instantiation and does no further allocation after that.
 */
export interface StaticCollection extends Markable {
  /**
   * @returns The maximum number of elements that this collection can store with its current memory allocation.
   */
  readonly capacity: number
}

/**
 * 
 */
export namespace StaticCollection {
}