import { ForwardCursor } from '../cursor'
import { Readonly, protomark, Markable, Mark } from '../mark'

import { Collection } from '../Collection'

import { Group } from './Group'

/**
 * A read-only view over another collection.
 */
@protomark(Readonly)
@protomark(Collection)
@protomark(Group)
export class GroupView<Element> implements Group<Element> {
  /**
   * 
   */
  private _group: Group<Element>

  /**
   * @see Collection.prototype.size
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
   * @see Collection.prototype.has
   */
  public has(element: Element): boolean {
    return this._group.has(element)
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): GroupView<Element> {
    return new GroupView(this._group)
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

    if (other instanceof GroupView) {
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

  /**
   * @see Markable.prototype.is
   */
  public is(markLike: Mark.Alike): boolean {
    return protomark.is(this.constructor, markLike)
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
