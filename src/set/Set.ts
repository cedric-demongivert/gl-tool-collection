import { Collection } from '../Collection'
import { Pack } from '../pack/Pack'

import { PackSet } from './PackSet'
import { IdentifierSet } from './IdentifierSet'
import { NativeSet } from './NativeSet'
import { BitSet } from './BitSet'

/**
 * A collection of elements without order and that does not allows duplicates of elements.
 */
export interface Set<Element> extends Collection<Element> {
  /**
   * @see Collection.clone
   */
  clone(): Set<Element>

  /**
   * @see Collection.view
   */
  is(marker: Set.MARKER): true

  /**
   * @see Collection.view
   */
  is(marker: Symbol): boolean

  /**
   * @return A javascript iterator over this sequence of elements.
   */
  [Symbol.iterator](): IterableIterator<Element>
}

export namespace Set {
  /**
   * 
   */
  export const MARKER: unique symbol = Symbol('gl-tool-collection/set-marker')

  /**
   * 
   */
  export type MARKER = typeof MARKER

  /**
   * Return true if the given collection is a pack.
   *
   * @param collection - A collection to assert.
   *
   * @return True if the given collection is a pack.
   */
  export function is<Element>(collection: Collection<Element>): collection is Set<Element> {
    return collection.is(MARKER)
  }

  /**
   * Return a shallow copy of the given set instance.
   *
   * @param toCopy - A set instance to shallow copy.
   *
   * @return A shallow copy of the given set instance.
   */
  export function copy<T>(toCopy: Set<T>): Set<T> {
    return toCopy == null ? null : toCopy.clone()
  }

  /**
   * Return a set that wrap an existing pack instance.
   *
   * @param pack - A pack instance to wrap into a set.
   *
   * @return A set that wrap the given pack instance.
   */
  export function native<T>(): NativeSet<T> {
    return NativeSet.any()
  }

  /**
   * Return a set that wrap an existing pack instance.
   *
   * @param pack - A pack instance to wrap into a set.
   *
   * @return A set that wrap the given pack instance.
   */
  export function fromPack<T>(pack: Pack<T>): PackSet<T> {
    return new PackSet<T>(pack)
  }

  /**
   *
   */
  export function identifier(capacity: number): IdentifierSet {
    return new IdentifierSet(capacity)
  }

  /**
   *
   */
  export function bitset(capacity: number): BitSet {
    return new BitSet(capacity)
  }
}
