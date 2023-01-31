import { ForwardCursor } from './cursor/ForwardCursor'

import { Collection } from './Collection'
import { areEquallyConstructed } from './areEquallyConstructed'

/**
 * A read-only view over another collection.
 */
export class CollectionView<
  Element,
  Wrappable extends Collection<Element> = Collection<Element>
> implements Collection<Element> {
  /**
   * 
   */
  protected _collection: Wrappable

  /**
   * @see {@link Collection.size}
   */
  public get size(): number {
    return this._collection.size
  }
  
  /**
   * 
   */
  public constructor(collection: Wrappable) {
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
  public clone(): CollectionView<Element, Wrappable> {
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
  public hasCollection(collection: unknown): boolean {
    return this._collection === collection
  }

  /**
   * 
   */
  public setCollection(collection: Wrappable): void {
    this._collection = collection
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: unknown): boolean {
    if (other === this) return true

    if (areEquallyConstructed(other, this)) {
      return other._collection === this._collection
    }

    return false
  }
  
  /**
   * @see {@link Collection.stringify}
   */
  public stringify(): string {
    return this._collection.stringify()
  }
  
  /**
   * @see {@link Object.toString}
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._collection.constructor.name + ') ' + this._collection.stringify()
  }
}

/**
 * 
 */
export function createCollectionView<Element>(collection: Collection<Element>): CollectionView<Element> {
  return new CollectionView(collection)
}

