import { ForwardCursor } from './cursor'
import { Readonly, protomark, Mark } from './mark'

import { Collection } from './Collection'

/**
 * A read-only view over another collection.
 */
@protomark(Readonly)
@protomark(Collection)
export class CollectionView<Element> implements Collection<Element> {
  /**
   * 
   */
  private _collection: Collection<Element>

  /**
   * @see Collection.prototype.size
   */
  public get size(): number {
    return this._collection.size
  }

  /**
   * 
   */
  public constructor(collection: Collection<Element>) {
    this._collection = collection
  }

  /**
   * @see Collection.prototype.has
   */
  public has(element: Element): boolean {
    return this._collection.has(element)
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): CollectionView<Element> {
    return new CollectionView(this._collection)
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
    return this._collection.forward().view()
  }

  /**
   * @see Collection.prototype.values
   */
  public values(): IterableIterator<Element> {
    return this._collection.values()
  }

  /**
   * @see Collection.prototype[Symbol.iterator]
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._collection.values()
  }

  /**
   * @see Markable.prototype.is
   */
  public is(markLike: Mark.Alike): boolean {
    return protomark.is(this.constructor, markLike)
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof CollectionView) {
      return other._collection.equals(this._collection)
    }

    return false
  }
}

/**
 * 
 */
export namespace CollectionView {
  /**
   * 
   */
  export function wrap<Element>(collection: Collection<Element>): CollectionView<Element> {
    return new CollectionView(collection)
  }
}
