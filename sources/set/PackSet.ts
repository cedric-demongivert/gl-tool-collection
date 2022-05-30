
import { Factory } from '@cedric-demongivert/gl-tool-utils'
import { Pack } from '../sequence'
import { ForwardCursor } from '../cursor'
import { ReallocableCollection } from '../ReallocableCollection'

import { OrderedSet } from './OrderedSet'
import { Group } from './Group'
import { OrderedGroup } from './OrderedGroup'
import { IsCollection } from '../IsCollection'

/**
 * 
 */
export class PackSet<Element> implements ReallocableCollection, OrderedSet<Element>
{
  /**
   * 
   */
  private _elements: Pack<Element>

  /**
   * 
   */
  private readonly _view: OrderedGroup<Element>

  /**
   * Create a new set collection based upon a pack instance.
   *
   * @param pack - An empty pack instance to wrap as a set.
   */
  public constructor(elements: Pack<Element>) {
    this._elements = elements
    this._view = OrderedGroup.view(this)
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
  public isSet(): true {
    return true
  }

  /**
   * @returns This set underlying pack instance.
   */
  public get elements(): Pack<Element> {
    return this._elements
  }

  /**
   * Change the wrapped pack instance.
   *
   * @param elements - The new pack instance to wrap.
   */
  public set elements(elements: Pack<Element>) {
    this._elements = elements
  }

  /**
   * @see Collection.prototype.size
   */
  public get size(): number {
    return this._elements.size
  }

  /**
   * @see StaticCollection.prototype.capacity
   */
  public get capacity(): number {
    return this._elements.capacity
  }

  /**
   * @see Collection.prototype.has
   */
  public has(element: Element): boolean {
    return this._elements.has(element)
  }

  /**
   * @see Sequence.prototype.indexOf
   */
  public indexOf(element: Element): number {
    return this._elements.indexOf(element)
  }

  /**
   * @see Sequence.prototype.hasInSubsequence
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this._elements.hasInSubsequence(element, offset, size)
  }

  /**
   * @see Sequence.prototype.indexOfInSubsequence
   */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    return this._elements.indexOfInSubsequence(element, offset, size)
  }

  /**
   * @see Set.prototype.add
   */
  public add(element: Element): void {
    if (this._elements.indexOf(element) === -1) {
      this._elements.push(element)
    }
  }

  /**
   * @see Set.prototype.delete
   */
  public delete(element: Element): void {
    const index: number = this._elements.indexOf(element)

    if (index >= 0) {
      this._elements.warp(index)
    }
  }

  /**
   * @see Sequence.prototype.get
   */
  public get(index: number): Element {
    return this._elements.get(index)
  }

  /**
   * @see ReallocableCollection.prototype.reallocate
   */
  public reallocate(capacity: number): void {
    this._elements.reallocate(capacity)
  }

  /**
   * @see ReallocableCollection.prototype.fit
   */
  public fit(): void {
    this._elements.fit()
  }

  /**
   * @see Set.prototype.copy
   */
  public copy(toCopy: Group<Element>): void {
    this.clear()

    for (const element of toCopy) {
      this.add(element)
    }
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): PackSet<Element> {
    return new PackSet<Element>(this._elements.clone())
  }

  /**
   * @see Group.prototype.clear
   */
  public clear(): void {
    this._elements.clear()
  }

  /**
   * @see Sequence.prototype.first
   */
  public get first(): Element {
    return this._elements.first
  }

  /**
   * @see Sequence.prototype.last
   */
  public get last(): Element {
    return this._elements.last
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): OrderedGroup<Element> {
    return this._view
  }

  /**
  * @see Collection.prototype.forward
  */
  public forward(): ForwardCursor<Element> {
    return this._elements.forward()
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
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof PackSet) {
      if (other.size !== this._elements.size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index))) return false
      }

      return true
    }

    return false
  }

  /**
   * @see Object.prototype.toString
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._elements.constructor.name + ') ' + Group.stringify(this)
  }
}

export namespace PackSet {
  /**
  * Return a copy of a given pack set.
  *
  * @param toCopy - A pack set to copy.
  */
  export function copy<Element>(toCopy: PackSet<Element>): PackSet<Element> {
    return new PackSet<Element>(toCopy.elements.clone())
  }

  /**
  * Instantiate a new set that wrap a pack of the given type of instance.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @returns A new set that wrap a pack of the given type of instance.
  */
  export function any<Element>(capacity: number, defaultValue: Factory<Element>): PackSet<Element> {
    return new PackSet(Pack.any(capacity, defaultValue))
  }

  /**
  * Instantiate a new set that wrap a unsigned byte pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @returns A new set that wrap a unsigned byte pack of the given capacity.
  */
  export function uint8(capacity: number): PackSet<number> {
    return new PackSet<number>(Pack.uint8(capacity))
  }

  /**
  * Instantiate a new set that wrap a unsigned short pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @returns A new set that wrap a unsigned short pack of the given capacity.
  */
  export function uint16(capacity: number): PackSet<number> {
    return new PackSet<number>(Pack.uint16(capacity))
  }

  /**
  * Instantiate a new set that wrap a unsigned integer pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @returns A new set that wrap a unsigned integer pack of the given capacity.
  */
  export function uint32(capacity: number): PackSet<number> {
    return new PackSet<number>(Pack.uint32(capacity))
  }

  /**
  * Instantiate a new set that wrap a byte pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @returns A new set that wrap a byte pack of the given capacity.
  */
  export function int8(capacity: number): PackSet<number> {
    return new PackSet<number>(Pack.int8(capacity))
  }

  /**
  * Instantiate a new set that wrap a short pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @returns A new set that wrap a short pack of the given capacity.
  */
  export function int16(capacity: number): PackSet<number> {
    return new PackSet<number>(Pack.int16(capacity))
  }

  /**
  * Instantiate a new set that wrap a integer pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @returns A new set that wrap a integer pack of the given capacity.
  */
  export function int32(capacity: number): PackSet<number> {
    return new PackSet<number>(Pack.int32(capacity))
  }

  /**
  * Instantiate a new set that wrap a float pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @returns A new set that wrap a float pack of the given capacity.
  */
  export function float32(capacity: number): PackSet<number> {
    return new PackSet<number>(Pack.float32(capacity))
  }

  /**
  * Instantiate a new set that wrap a double pack of the given capacity.
  *
  * @param capacity - Capacity of the set to allocate.
  *
  * @returns A new set that wrap a double pack of the given capacity.
  */
  export function float64(capacity: number): PackSet<number> {
    return new PackSet<number>(Pack.float64(capacity))
  }

  /**
  * Instantiate a new set that wrap a unsigned integer pack that can store
  * values in range [0, maximum] and that is of the given capacity.
  *
  * @param maximum - Maximum value that can be stored.
  * @param capacity - Capacity of the set to allocate.
  *
  * @returns A new set that wrap a unsigned integer pack that can store values
  *         in range [0, maximum] and that is of the given capacity.
  */
  export function unsignedUpTo(maximum: number, capacity: number): PackSet<number> {
    return new PackSet<number>(Pack.unsignedUpTo(maximum, capacity))
  }

  /**
  * Instantiate a new set that wrap a signed integer pack that can store
  * values in range [-maximum, maximum] and that is of the given capacity.
  *
  * @param maximum - Maximum value that can be stored.
  * @param capacity - Capacity of the set to allocate.
  *
  * @returns A new set that wrap a signed integer pack that can store values
  *         in range [-maximum, maximum] and that is of the given capacity.
  */
  export function signedUpTo(maximum: number, capacity: number): PackSet<number> {
    return new PackSet<number>(Pack.signedUpTo(maximum, capacity))
  }
}
