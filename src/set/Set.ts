import { Collection } from '../Collection'

/**
* A collection of elements without order and that does not allows duplicates of
* elements.
*/
export interface Set<Element> extends Collection<Element> {
  /**
  * Add a new element to the collection.
  *
  * @param value - Elementhe value to add to the collection.
  */
  add (value : Element) : void

  /**
  * Remove an element from the collection.
  *
  * @param value - Elementhe value to remove from the collection.
  */
  delete (value : Element) : void

  /**
  * Shallow copy an existing set instance.
  *
  * @param toCopy - An existing set instance to shallow copy.
  */
  copy (toCopy : Set<Element>) : void

  /**
  * @return A shallow copy of this set as a new instance.
  */
  clone () : Set<Element>

  /**
  * Empty the collection.
  */
  clear () : void
}

export namespace Set {
  /**
  * Return a shallow copy of the given set instance.
  *
  * @param toCopy - A set instance to shallow copy.
  *
  * @return A shallow copy of the given set instance.
  */
  export function copy <T> (toCopy : Set<T>) : Set<T> {
    return toCopy == null ? null : toCopy.clone()
  }

  /**
  * Return a set that wrap an existing pack instance.
  *
  * @param pack - A pack instance to wrap into a set.
  *
  * @return A set that wrap the given pack instance.
  */
  export function fromPack <T> (pack : Pack<T>) : PackSet<T> {
    return new PackSet<T>(pack)
  }

  export function identifier (capacity : number) : IdentifierSet {
    return new IdentifierSet(capacity)
  }
}
