import { Collection } from '../Collection'

import { Set as GLToolSet } from './Set'
import { Group } from './Group'
import { Markable, protomark } from '../mark'
import { Cursor, ForwardCursor, NativeCursor } from '../cursor'

/**
 * 
 */
@protomark(Set)
@protomark(Group)
@protomark(Collection)
export class NativeSet<Element> implements GLToolSet<Element>
{
  /**
   * 
   */
  private _elements: Set<Element>

  /**
   * 
   */
  private readonly _view: Group<Element>

  /**
   * Create a new native set collection based upon the given set instance.
   *
   * @param elements - A set instance to wrap.
   */
  public constructor(elements: Set<Element>) {
    this._elements = elements
    this._view = Group.view(this)
    this.values = this.values.bind(this)
  }

  /**
   * @returns This set underlying native instance.
   */
  public get elements(): Set<Element> {
    return this._elements
  }

  /**
   * Change the wrapped set instance.
   *
   * @param elements - The new set instance to wrap.
   */
  public set elements(elements: Set<Element>) {
    this._elements = elements
  }

  /**
   * @see Collection.prototype.size
   */
  public get size(): number {
    return this._elements.size
  }

  /**
   * @see Collection.prototype.has
   */
  public has(element: Element): boolean {
    return this._elements.has(element)
  }

  /**
   * @see GLToolSet.prototype.add
   */
  public add(element: Element): void {
    this._elements.add(element)
  }

  /**
   * @see GLToolSet.prototype.delete
   */
  public delete(element: Element): void {
    this._elements.delete(element)
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Element {
    if (index < 0) {
      return undefined
    }

    let cursor: number = 0

    for (const element of this._elements) {
      if (cursor === index) {
        return element
      } else {
        cursor += 1
      }
    }

    return undefined
  }

  /**
   * @see GLToolSet.prototype.copy
   */
  public copy(toCopy: Group<Element>): void {
    this._elements.clear()

    for (const element of toCopy) {
      this._elements.add(element)
    }
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): NativeSet<Element> {
    return new NativeSet<Element>(new Set<Element>(this._elements))
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): void {
    this._elements.clear()
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): Group<Element> {
    return this._view
  }

  /**
  * @see Collection.prototype.forward
  */
  public forward(): ForwardCursor<Element> {
    return NativeCursor.from(this.values)
  }

  /**
   * @see Collection.prototype.values
   */
  public values(): IterableIterator<Element> {
    return this._elements.values()
  }

  /**
   * @see Collection.prototype[Symbol.iterator]
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._elements.values()
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof NativeSet) {
      if (other.size !== this._elements.size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index))) return false
      }

      return true
    }

    return false
  }

  /**
   * @see Markable.prototype.is
   */
  public is: Markable.Predicate

  /**
   * @see Object.prototype.toString
   */
  public toString(): string {
    return this.constructor.name + ' ' + Group.stringify(this)
  }
}

/**
 * 
 */
NativeSet.prototype.is = protomark.is

export namespace NativeSet {
  /**
  * Return a copy of a given native set.
  *
  * @param toCopy - A native set to copy.
  */
  export function clone<Element>(toCopy: NativeSet<Element>): NativeSet<Element> {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  /**
  * Instantiate a new set that wrap a set of the given type of instance.
  *
  * @returns A new set that wrap a set of the given type of instance.
  */
  export function any<T>(): NativeSet<T> {
    return new NativeSet<T>(new Set<T>())
  }

  /**
  * Instantiate a new set that wrap a set of the given type of instance.
  *
  * @param set - The set to wrap.
  *
  * @returns A new set that wrap a set of the given type of instance.
  */
  export function wrap<T>(set: Set<T>): NativeSet<T> {
    return new NativeSet<T>(set)
  }
}
