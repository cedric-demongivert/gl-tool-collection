import { EmptyForwardCursor } from './cursor'
import { Readonly, Empty, protomark } from './mark'

import { Collection } from './Collection'

/**
 * An empty collection, e.g., a collection of zero elements.
 */
@protomark(Readonly)
@protomark(Empty)
@protomark(Collection)
export class EmptyCollection<Element> implements Collection<Element> {
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
  public forward(): EmptyForwardCursor<Element> {
    return EmptyForwardCursor.get()
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
   * @see Markable.prototype.is
   */
  public is = protomark.is

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
