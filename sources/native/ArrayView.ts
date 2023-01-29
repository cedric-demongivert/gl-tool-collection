import { Sequence } from '../sequence/Sequence'
import { ForwardCursor } from '../cursor'
import { IsCollection } from '../IsCollection'
import { SequenceCursor } from '../sequence/SequenceCursor'

/**
* A read-only view over a given array.
*/
export class ArrayView<Element> implements Sequence<Element> {
  /**
   * 
   */
  private _array: Array<Element>

  /**
   * @see {@link Collection.size}
   */
  public get size(): number {
    return this._array.length
  }

  /**
   * Create a new view over an existing array.
   *
   * @param array - An array to wrap.
   */
  public constructor(array: Array<Element>) {
    this._array = array
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
  public isGroup(): false {
    return false
  }

  /**
   * @see {@link Collection.isSet}
   */
  public isSet(): false {
    return false
  }

  /**
   * @see {@link Sequence.get}
   */
  public get(index: number): Element {
    return this._array[index]
  }

  /**
   * @see {@link Sequence.first}
   */
  public get first(): Element {
    return this._array[0]
  }

  /**
   * @see {@link Sequence.last}
   */
  public get last(): Element {
    const array = this._array
    return array[array.length - 1]
  }

  /**
   * @see {@link Collection.has}
   */
  public has(value: Element): boolean {
    return this._array.indexOf(value) > -1
  }

  /**
   * @see {@link Clonable.clone}
   */
  public clone(): ArrayView<Element> {
    return ArrayView.wrap(this._array)
  }

  /**
   * @see {@link Sequence.indexOf}
   */
  public indexOf(element: Element): number {
    return this._array.indexOf(element)
  }

  /**
  * @see {@link Sequence.indexOfInSubsequence}
  */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    const result: number = this._array.indexOf(element, offset)
    return result > -1 && result < offset + size ? result - offset : -1
  }

  /**
   * @see {@link Sequence.hasInSubsequence}
   */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    const result: number = this._array.indexOf(element, offset)
    return result > -1 && result < offset + size
  }

  /**
   * @see {@link Collection.view}
   */
  public view(): ArrayView<Element> {
    return this
  }

  /**
   * @see {@link Collection.forward}
   */
  public forward(): ForwardCursor<Element> {
    return new SequenceCursor(this, 0)
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof ArrayView) {
      return this._array === other._array
    }

    return false
  }

  /**
  * @see {@link Collection.values}
  */
  public values(): IterableIterator<Element> {
    return this._array.values()
  }

  /**
  * @see {@link Collection[Symbol.iterator]}
  */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this._array.values()
  }

  /**
   * @see {@link Object.toString}
   */
  public toString(): string {
    return this.constructor.name + ' ' + Sequence.stringify(this)
  }
}

/**
 * 
 */
export namespace ArrayView {
  /**
   * Wrap an existing array.
   *
   * @param array - An array to wrap in a view.
   *
   * @returns A view over the given array.
   */
  export function wrap<Element>(array: Array<Element>): ArrayView<Element> {
    return new ArrayView<Element>(array)
  }
}
