import { ForwardCursor } from '../cursor'
import { IsCollection } from '../IsCollection'

import { Group } from './Group'
import { OrderedGroup } from './OrderedGroup'

/**
 * A read-only view over another collection.
 */
export class OrderedGroupView<Element> implements OrderedGroup<Element> {
  /**
   * 
   */
  private _group: OrderedGroup<Element>

  /**
   * @see Collection.prototype.size
   */
  public get size(): number {
    return this._group.size
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): Element {
    return this._group.first
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): Element {
    return this._group.last
  }

  /**
   * 
   */
  public constructor(group: OrderedGroup<Element>) {
    this._group = group
  }

  /**
   * @see Collection.prototype[IsCollection.SYMBOL]
   */
  public [IsCollection.SYMBOL](): true {
    return true
  }

  /**
   * @see Collection.prototype.isSequence
   */
  public isSequence(): true {
    return true
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
  public isGroup(): true {
    return true
  }

  /**
   * @see Collection.prototype.isSet
   */
  public isSet(): false {
    return false
  }

  /**
   * @see Collection.prototype.has
   */
  public has(element: Element): boolean {
    return this._group.has(element)
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Element {
    return this._group.get(index)
  }

  /**
   * @see Sequence.prototype.indexOf
   */
  public indexOf(element: Element): number {
    return this._group.indexOf(element)
  }

  /**
   * @see Sequence.prototype.indexOfInSubsequence
   */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    return this._group.indexOfInSubsequence(element, offset, size)
  }

  /**
   * @see Sequence.prototype.hasInSubsequence
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this._group.hasInSubsequence(element, offset, size)
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): OrderedGroupView<Element> {
    return new OrderedGroupView(this._group)
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
    return this._group.forward().view()
  }

  /**
   * @see Collection.prototype.values
   */
  public values(): IterableIterator<Element> {
    return this._group.values()
  }

  /**
   * @see Collection.prototype[Symbol.iterator]
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._group.values()
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof OrderedGroupView) {
      return other._group.equals(this._group)
    }

    return false
  }

  /**
   * @see Object.prototype.toString
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._group.constructor.name + ') ' + Group.stringify(this)
  }
}

/**
 * 
 */
export namespace OrderedGroupView {
  /**
   * 
   */
  export function wrap<Element>(collection: OrderedGroup<Element>): OrderedGroupView<Element> {
    return new OrderedGroupView(collection)
  }
}
