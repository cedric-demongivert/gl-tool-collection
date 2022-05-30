import { ForwardCursor } from './cursor'

import { Collection } from './Collection'

/**
 * An empty collection, e.g., a collection of zero elements.
 */
export class EmptyCollection<Element> implements Collection<Element> {
  /**
   * @see Collection.prototype[Collection.IS]
   */
  public [Collection.IS](): true {
    return true
  }

  /**
   * @see Collection.prototype.isSequence
   */
  public isSequence(): boolean {
    return false
  }

  /**
   * @see Collection.prototype.isPack
   */
  public isPack(): false {
    return false
  }

  /**
   * @see Collection.prototype.isList
   */
  public isList(): false {
    return false
  }

  /**
   * @see Collection.prototype.isGroup
   */
  public isGroup(): boolean {
    return false
  }

  /**
   * @see Collection.prototype.isSet
   */
  public isSet(): false {
    return false
  }

  /**
   * @see Collection.prototype.size
   */
  public get size(): number {
    return 0
  }

  /**
   * @see Collection.prototype.has
   */
  public has(element: Element): false {
    return false
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): this {
    return this
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): this {
    return this
  }

  /**
   * @see Collection.prototype.forward
   */
  public forward(): ForwardCursor<Element> {
    return ForwardCursor.empty()
  }

  /**
   * @see Collection.prototype.values
   */
  public *values(): IterableIterator<Element> {

  }

  /**
   * @see Collection.prototype[Symbol.iterator]
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this.values()
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    return other instanceof EmptyCollection
  }
}

/**
 * 
 */
export namespace EmptyCollection {
  /**
   * 
   */
  export const INSTANCE: EmptyCollection<any> = new EmptyCollection<any>()

  /**
   * 
   */
  export function get<Element>(): EmptyCollection<Element> {
    return INSTANCE
  }
}
