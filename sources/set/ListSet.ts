
import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { List } from '../list/List'
import { ForwardCursor } from '../cursor/ForwardCursor'

import { Group } from '../group/Group'
import { OrderedGroup } from '../group/OrderedGroup'
import { createOrderedGroupView } from '../group/OrderedGroupView'

import { join } from '../algorithm/join'
import { areEquallyConstructed } from '../areEquallyConstructed'

import { OrderedSet } from './OrderedSet'

/**
 * 
 */
export class ListSet<Element, Wrapped extends List<Element> = List<Element>> implements OrderedSet<Element>
{
  /**
   * 
   */
  protected _elements: Wrapped

  /**
   * 
   */
  protected _comparator: Comparator<Element>

  /**
   * Create a new set collection based upon a pack instance.
   *
   * @param pack - An empty pack instance to wrap as a set.
   */
  public constructor(elements: Wrapped, comparator: Comparator<Element> = Comparator.compareWithOperator) {
    this._elements = elements
    this._comparator = comparator
  }

  /**
   * 
   */
  public get comparator(): Comparator<Element, Element> {
    return this._comparator
  }

  /**
   * 
   */
  public set comparator(value: Comparator<Element, Element>) {
    this._comparator = value
    this._elements.unique(value)
  }

  /**
   * @see {@link OrderedSet.size}
   */
  public get size(): number {
    return this._elements.size
  }

  /**
   * @see {@link OrderedSet.has}
   */
  public has(element: Element, startOrEnd: number = 0, endOrStart: number = this.size): boolean {
    return this._elements.search(element, this._comparator, startOrEnd, endOrStart) >= 0
  }

  /**
   * @see {@link OrderedSet.indexOf}
   */
  public indexOf(element: Element, startOrEnd: number = 0, endOrStart: number = this.size): number {
    return this._elements.search(element, this._comparator, startOrEnd, endOrStart)
  }

  /**
   * @see {@link OrderedSet.indexOf}
   */
  public search<Key>(key: Key, comparator: Comparator<Key, Element>, startOrEnd: number = 0, endOrStart: number = this.size): number {
    return this._elements.search(key, comparator, startOrEnd, endOrStart)
  }

  /**
   * @see {@link OrderedSet.add}
   */
  public add(element: Element): void {
    const elements = this._elements

    if (elements.indexOf(element) < 0) {
      elements.push(element)
    }
  }

  /**
   * @see {@link OrderedSet.delete}
   */
  public delete(element: Element): void {
    const elements = this._elements

    const index: number = elements.indexOf(element)

    if (index >= 0) {
      this._elements.warp(index)
    }
  }

  /**
   * @see {@link OrderedSet.get}
   */
  public get(index: number): Element {
    return this._elements.get(index)
  }

  /**
   * @see {@link OrderedSet.copy}
   */
  public copy(toCopy: Group<Element>): void {
    const elements = this._elements
    elements.clear()

    for (const element of toCopy) {
      elements.push(element)
    }
  }

  /**
   * @see {@link OrderedSet.clone}
   */
  public clone(): ListSet<Element> {
    return new ListSet<Element>(this._elements.clone(), this._comparator)
  }

  /**
   * @see {@link OrderedSet.stringify}
   */
  public stringify(): string {
    return '{' + join(this._elements) + '}'
  }

  /**
   * @see {@link OrderedSet.clear}
   */
  public clear(): void {
    this._elements.clear()
  }

  /**
   * @see {@link OrderedSet.first}
   */
  public get first(): Element {
    return this._elements.first
  }

  /**
   * @see {@link OrderedSet.last}
   */
  public get last(): Element {
    return this._elements.last
  }

  /**
   * @see {@link OrderedSet.view}
   */
  public view(): OrderedGroup<Element> {
    return createOrderedGroupView(this)
  }

  /**
  * @see {@link OrderedSet.forward}
  */
  public forward(): ForwardCursor<Element> {
    return this._elements.forward()
  }

  /**
  * @see {@link OrderedSet.values}
  */
  public values(): IterableIterator<Element> {
    return this._elements.values()
  }


  /**
  * @see {@link OrderedSet[Symbol.iterator]}
  */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._elements.values()
  }

  /**
  * @see {@link OrderedSet.equals}
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (areEquallyConstructed(other, this)) {
      return (
        other._elements.equals(this._elements) &&
        other._comparator === this._comparator
      )
    }

    return false
  }

  /**
   * @see {@link OrderedSet.toString}
   */
  public toString(): string {
    return this.constructor.name + ' (' + this._elements.constructor.name + ', ' + this._comparator.name + ') ' + this.stringify()
  }
}

/**
 * 
 */
export function createListSet<Element>(list: List<Element>, comparator: Comparator<Element> = Comparator.compareWithOperator): ListSet<Element> {
  return new ListSet(list, comparator)
}