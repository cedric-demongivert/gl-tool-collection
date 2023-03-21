import { Set as GLToolSet } from './Set'
import { Group } from '../group/Group'
import { createGroupView } from '../group/GroupView'

import { ForwardCursor } from '../cursor/ForwardCursor'
import { NativeCursor } from '../native/NativeCursor'
import { join } from '../algorithm'

/**
 * 
 */
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
    this._view = createGroupView(this)
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
   * @see {@link Collection.size}
   */
  public get size(): number {
    return this._elements.size
  }

  /**
   * @see {@link Collection.has}
   */
  public has(element: Element): boolean {
    return this._elements.has(element)
  }

  /**
   * @see {@link GLToolSet.add}
   */
  public add(element: Element): void {
    this._elements.add(element)
  }

  /**
   * @see {@link GLToolSet.delete}
   */
  public delete(element: Element): void {
    this._elements.delete(element)
  }

  /**
   * @see {@link GLToolSet.copy}
   */
  public copy(toCopy: Group<Element>): void {
    this._elements.clear()

    for (const element of toCopy) {
      this._elements.add(element)
    }
  }

  /**
   * @see {@link Clonable.clone}
   */
  public clone(): NativeSet<Element> {
    return new NativeSet<Element>(new Set<Element>(this._elements))
  }

  /**
   * @see {@link Clearable.clear}
   */
  public clear(): void {
    this._elements.clear()
  }

  /**
   * @see {@link Collection.view}
   */
  public view(): Group<Element> {
    return this._view
  }

  /**
  * @see {@link Collection.forward}
  */
  public forward(): ForwardCursor<Element> {
    return NativeCursor.from(this.values)
  }

  /**
   * @see {@link Collection.values}
   */
  public values(): IterableIterator<Element> {
    return this._elements.values()
  }

  /**
   * @see {@link Collection[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._elements.values()
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof NativeSet) {
      if (other.size !== this._elements.size) return false

      for (const value of other.values()) {
        if (!this.has(value)) return false
      }

      return true
    }

    return false
  }

  /**
   * @see {@link Set.stringify}
   */
  public stringify(): string {
    return '{' + join(this, ', ') + '}'
  }

  /**
   * @see {@link Object.toString}
   */
  public toString(): string {
    return this.constructor.name + ' ' + this.stringify()
  }
}

/**
 * Instantiate a new set that wrap a set of the given type of instance.
 *
 * @returns A new set that wrap a set of the given type of instance.
 */
export function createNativeSet<T>(): NativeSet<T> {
  return new NativeSet<T>(new Set<T>())
}

/**
 * Instantiate a new set that wrap a set of the given type of instance.
 *
 * @param set - The set to wrap.
 *
 * @returns A new set that wrap a set of the given type of instance.
 */
export function wrapAsNativeSet<T>(set: Set<T>): NativeSet<T> {
  return new NativeSet<T>(set)
}
