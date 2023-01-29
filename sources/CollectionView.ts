import { ForwardCursor } from './cursor/ForwardCursor'

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
   * @see {@link Collection.size}
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
   * @see {@link Collection.has}
   */
  public has(element: Element): boolean {
    return this._collection.has(element)
  }

  /**
   * @see {@link Clonable.clone}
   */
  public clone(): CollectionView<Element> {
    return new CollectionView(this._collection)
  }

  /**
   * @see {@link Collection.view}
   */
  public view(): this {
    return this
  }

  /**
   * @see {@link Collection.forward}
   */
  public forward(): ForwardCursor<Element> {
    return this._collection.forward().view()
  }

  /**
   * @see {@link Collection.values}
   */
  public values(): IterableIterator<Element> {
    return this._collection.values()
  }

  /**
   * @see {@link Collection[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._collection.values()
  }

  /**
   * 
   */
  public hasCollection(collection: Collection<unknown>): boolean {
    return this._collection === collection
  }

  /**
   * 
   */
  public setCollection(collection: Collection<Element>): void {
    this._collection = collection
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof CollectionView) {
      return other._collection === this._collection
    }

    return false
  }
}

/**
 * 
 */
export function createCollectionView<Element>(collection: Collection<Element>): CollectionView<Element> {
  return new CollectionView(collection)
}

