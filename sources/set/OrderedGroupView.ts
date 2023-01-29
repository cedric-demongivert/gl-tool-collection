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
   * @see {@link Collection.size}
   */
  public get size(): number {
    return this._group.size
  }

  /**
   * @see {@link Sequence.first}
   */
  public get first(): Element {
    return this._group.first
  }

  /**
   * @see {@link Sequence.last}
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
   * @see {@link Collection[IsCollection.SYMBOL]}
   */
  public [IsCollection.SYMBOL](): true {
    return true
  }

  /**
   * @see {@link Collection.isSequence}
   */
  public isSequence(): true {
    return true
  }

  /**
   * @see {@link Collection.isPack}
   */
  public isPack(): false {
    return false
  }

  /**
   * @see {@link Collection.isList}
   */
  public isList(): false {
    return false
  }

  /**
   * @see {@link Collection.isGroup}
   */
  public isGroup(): true {
    return true
  }

  /**
   * @see {@link Collection.isSet}
   */
  public isSet(): false {
    return false
  }

  /**
   * @see {@link Collection.has}
   */
  public has(element: Element): boolean {
    return this._group.has(element)
  }

  /**
   * @see {@link Sequence.get}
   */
  public get(index: number): Element {
    return this._group.get(index)
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: Element): number {
    return this._group.indexOf(element)
  }

  /**
   * @see {@link Sequence.indexOfInSubsequence}
   */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    return this._group.indexOfInSubsequence(element, offset, size)
  }

  /**
   * @see {@link Sequence.hasInSubsequence}
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this._group.hasInSubsequence(element, offset, size)
  }

  /**
   * @see {@link Clonable.clone}
   */
  public clone(): OrderedGroupView<Element> {
    return new OrderedGroupView(this._group)
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
    return this._group.forward().view()
  }

  /**
   * @see {@link Collection.values}
   */
  public values(): IterableIterator<Element> {
    return this._group.values()
  }

  /**
   * @see {@link Collection[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._group.values()
  }

  /**
   * @see {@link Comparable.equals}
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
   * @see {@link Object.toString}
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
