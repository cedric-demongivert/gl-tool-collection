import { Collection } from '../Collection'
import { Pack } from '../pack/Pack'

import { PackSet } from './PackSet'
import { IdentifierSet } from './IdentifierSet'

/**
* A collection of elements without order and that does not allows duplicates of
* elements.
*/
export interface Set<Element> extends Collection<Element> {
  /**
  * @see Collection.clone
  */
  clone () : Set<Element>

  /**
  * @return A javascript iterator over this sequence of elements.
  */
  [Symbol.iterator] () : Iterator<Element>
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
