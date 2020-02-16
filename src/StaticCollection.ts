/**
* A static collection is a collection that allocate all the memory it needs to
* store its element at it instantiation and does no further allocation after
* that. A static collection may be reallocable.
*/
export interface StaticCollection {
  /**
  * @return The maximum number of element that this collection can store for the
  *         current memory allocation.
  */
  readonly capacity : number
}
