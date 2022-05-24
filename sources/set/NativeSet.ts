import { Collection } from '../Collection'
import { CollectionIterator } from '../iterator/CollectionIterator'
import { View } from '../view/View'

import { MutableSet } from './MutableSet'
import { Set as GLToolSet } from './Set'

export class NativeSet<Element> implements MutableSet<Element>
{
  private _elements: Set<Element>

  /**
  * Create a new native set collection based upon the given set instance.
  *
  * @param elements - A set instance to wrap.
  */
  public constructor(elements: Set<Element>) {
    this._elements = elements
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
  * @see Collection.size
  */
  public get size(): number {
    return this._elements.size
  }

  /**
  * @see Collection.has
  */
  public has(element: Element): boolean {
    return this._elements.has(element)
  }

  /**
  * @see Set.add
  */
  public add(element: Element): void {
    this._elements.add(element)
  }

  /**
  * @see Set.delete
  */
  public delete(element: Element): void {
    this._elements.delete(element)
  }

  /**
  * @see Collection.get
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
  * @see Set.copy
  */
  public copy(toCopy: GLToolSet<Element>): void {
    this._elements.clear()

    for (const element of toCopy) {
      this._elements.add(element)
    }
  }

  /**
  * @see Collection.clone
  */
  public clone(): NativeSet<Element> {
    return new NativeSet<Element>(new Set<Element>(this._elements))
  }

  /**
  * @see Set.clear
  */
  public clear(): void {
    this._elements.clear()
  }

  /**
  * @see Collection.view
  */
  public view(): Collection<Element> {
    return View.wrap(this)
  }

  /**
  * @see Collection.iterator
  */
  public iterator(): CollectionIterator<Element> {
    throw new Error('Native iterators are not supported yet.')
  }

  /**
  * @see Set.iterator
  */
  public *[Symbol.iterator](): Iterator<Element> {
    yield* this._elements
  }

  /**
  * @see Collection.equals
  */
  public equals(other: any): boolean {
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
}

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
