import { Factory } from "@cedric-demongivert/gl-tool-utils"
import { ForwardCursor } from "../cursor/ForwardCursor"

/**
 * 
 */
export class NativeCursor<Element> implements ForwardCursor<Element> {
  /**
   * 
   */
  private _index: number

  /**
   * 
   */
  private _factory: Factory<Iterator<Element>>

  /**
   * 
   */
  private _iterator: Iterator<Element>

  /**
   * 
   */
  private _result: IteratorResult<Element>

  /**
   * 
   */
  private _view: ForwardCursor<Element> | undefined

  /**
   * @see {@link ForwardCursor.index}
   */
  public get index(): number {
    return this._index
  }

  /**
   * @see {@link Cursor.isRandomAccess}
   */
  public isRandomAccess(): false {
    return false
  }

  /**
   * @see {@link Cursor.isBidirectional}
   */
  public isBidirectional(): false {
    return false
  }

  /**
   * @see {@link Cursor.isForward}
   */
  public isForward(): true {
    return true
  }

  /**
   * 
   */
  public constructor(factory: Factory<Iterator<Element>>, index: number = 0) {
    this._index = index
    this._factory = factory
    this._iterator = factory()
    this._result = this._iterator.next()
    this._view = undefined

    for (let cursor = 0; cursor < index; ++cursor) {
      this._result = this._iterator.next()
    }
  }

  /**
   * 
   */
  public wrap(factory: Factory<Iterator<Element>>, index: number = 0): void {
    this._index = index
    this._factory = factory
    this._iterator = factory()
    this._result = this._iterator.next()

    for (let cursor = 0; cursor < index; ++cursor) {
      this._result = this._iterator.next()
    }
  }

  /**
   * @see {@link Clonable.clone}
   */
  public clone(): NativeCursor<Element> {
    return new NativeCursor(this._factory, this._index)
  }

  /**
   * @see {@link ForwardCursor.forward}
   */
  public forward(count: number): void {
    for (let index = 0; index < count; ++index) {
      this._result = this._iterator.next()
    }

    this._index += count
  }

  /**
   * @see {@link ForwardCursor.isEnd}
   */
  public isEnd(): boolean {
    return this._result.done === true
  }

  /**
   * @see {@link ForwardCursor.isInside}
   */
  public isInside(): boolean {
    return this._result.done !== true
  }

  /**
   * @see {@link ForwardCursor.next}
   */
  public next(): void {
    this._result = this._iterator.next()
  }

  /**
   * @see {@link Cursor.view}
   */
  public view(): ForwardCursor<Element> {
    return this._view = this._view || ForwardCursor.view(this)
  }

  /**
   * @see {@link Cursor.get}
   */
  public get(): Element | undefined {
    return this._result.value
  }

  /**
   * @see {@link ForwardCursor.values}
   */
  public * values(): IterableIterator<Element> {
    let result = this._iterator.next()

    while (!result.done) {
      const value = result.value
      result = this._iterator.next()
      yield value
    }
  }

  /**
   * @see {@link ForwardCursor[Symbol.iterator]}
   */
  public [Symbol.iterator](): IterableIterator<Element> {
    return this.values()
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof NativeCursor) {
      return (
        this._factory === other._factory &&
        this._index === other._index
      )
    }

    return false
  }
}

/**
 * 
 */
export namespace NativeCursor {
  /**
   * 
   */
  export function from<Element>(factory: Factory<Iterator<Element>>, index: number = 0): NativeCursor<Element> {
    return new NativeCursor(factory, index)
  }
}