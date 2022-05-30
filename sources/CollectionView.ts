import { ForwardCursor } from './cursor'

import { Collection } from './Collection'

/**
 * A read-only view over another collection.
 */
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
   * @see Collection.prototype[Collection.IS]
   */
  public [Collection.IS](): true {
    return true
  }

  /**
   * @see Collection.prototype.isSequence
   */
  public isSequence(): false {
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
  public isGroup(): false {
    return false
  }

  /**
   * @see Collection.prototype.isSet
   */
  public isSet(): false {
    return false
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
