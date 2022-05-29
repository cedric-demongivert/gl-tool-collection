import { Factory } from "@cedric-demongivert/gl-tool-utils"
import { Mark, protomark } from "../mark"
import { Cursor } from "./Cursor"
import { ForwardCursor } from "./ForwardCursor"

/**
 * 
 */
@protomark(Cursor)
@protomark(ForwardCursor)
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
   * @see ForwardCursor.prototype.index
   */
  public get index(): number {
    return this._index
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
   * @see Clonable.prototype.clone
   */
  public clone(): NativeCursor<Element> {
    return new NativeCursor(this._factory, this._index)
  }

  /**
   * @see ForwardCursor.prototype.forward
   */
  public forward(count: number): void {
    for (let index = 0; index < count; ++index) {
      this._result = this._iterator.next()
    }

    this._index += count
  }

  /**
   * @see ForwardCursor.prototype.isEnd
   */
  public isEnd(): boolean {
    return this._result.done === true
  }

  /**
   * @see ForwardCursor.prototype.isInside
   */
  public isInside(): boolean {
    return this._result.done !== true
  }

  /**
   * @see ForwardCursor.prototype.next
   */
  public next(): void {
    this._result = this._iterator.next()
  }

  /**
   * @see Cursor.prototype.view
   */
  public view(): ForwardCursor<Element> {
    return this._view = this._view || ForwardCursor.view(this)
  }

  /**
   * @see Cursor.prototype.get
   */
  public get(): Element | undefined {
    return this._result.value
  }

  /**
   * @see Comparable.prototype.equals
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
export namespace NativeCursor {
  /**
   * 
   */
  export function from<Element>(factory: Factory<Iterator<Element>>, index: number = 0): NativeCursor<Element> {
    return new NativeCursor(factory, index)
  }
}