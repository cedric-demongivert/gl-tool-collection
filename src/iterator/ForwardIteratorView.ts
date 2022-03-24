import { Collection } from "..";
import { CollectionIterator } from "./CollectionIterator";
import { ForwardIterator } from "./ForwardIterator";

/**
 * 
 */
export class ForwardIteratorView<Element> implements ForwardIterator<Element> {
  /**
   * 
   */
  private _iterator: ForwardIterator<Element>

  /**
   * 
   */
  private _collection: Collection<Element>

  /**
   * 
   */
  public constructor(collection: Collection<Element>, iterator: ForwardIterator<Element> = collection.forward()) {
    this._collection = collection
    this._iterator = iterator
  }

  /**
   * 
   */
  public hasNext(): boolean {
    return this._iterator.hasNext()
  }

  /**
   * 
   */
  public next(): void {
    this._iterator.next()
  }

  /**
   * 
   */
  public forward(count: number): void {
    this._iterator.forward(count)
  }

  /**
   * 
   */
  public clone(): ForwardIteratorView<Element> {
    return new ForwardIteratorView(this._collection, this._iterator.clone())
  }

  /**
   * 
   */
  public end(): void {
    this._iterator.end()
  }

  /**
   * 
   */
  public collection(): Collection<Element> {
    return this._collection
  }

  /**
   * 
   */
  public move(iterator: CollectionIterator<Element>): void {
    if (iterator instanceof ForwardIteratorView) {
      this._iterator.move(iterator._iterator)
    } else {
      this._iterator.move(iterator)
    }
  }

  /**
   * 
   */
  public get(): Element {
    return this._iterator.get()
  }

  /**
   * 
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof ForwardIteratorView) {
      return (
        other._iterator.equals(this._iterator) &&
        other._collection.equals(this._collection)
      )
    }

    return false
  }
}
