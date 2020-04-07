/**
* Initial value of each new cell of a pack.
*/
export type Allocator<Instance> = {
  /**
  * @return A new instance of the given type.
  */
  allocate () : Instance,

  /**
  * Reset the given instance to its initial state in order to reuse it.
  *
  * @param instance - An instance to reset.
  */
  clear (instance : Instance) : void,

  /**
  * Copy the given instance state into another instance.
  *
  * @param source - An instance to copy.
  * @param destination - An instance to update.
  */
  copy (source : Instance, destination : Instance) : void
}
