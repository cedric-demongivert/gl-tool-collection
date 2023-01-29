import { ForwardCursor } from '../cursor'
import { IsCollection } from '../IsCollection'

import { Group } from './Group'

/**
 * A read-only view over another collection.
 */
export class GroupView<Element> implements Group<Element> {
  /**
   * 
   */
  private _group: Group<Element>

  /**
   * @see {@link Collection.size}
   */
  public get size(): number {
    return this._group.size
  }

  /**
   * 
   */
  public constructor(group: Group<Element>) {
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
   * @see {@link Clonable.clone}
   */
  public clone(): GroupView<Element> {
    return new GroupView(this._group)
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

    if (other instanceof GroupView) {
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
export namespace GroupView {
  /**
   * 
   */
  export function wrap<Element>(collection: Group<Element>): GroupView<Element> {
    return new GroupView(collection)
  }
}
