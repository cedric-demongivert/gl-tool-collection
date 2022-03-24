import { Clearable } from "../Clearable"
import { Allocator } from "./Allocator"

/**
 * 
 */
export class Allocated<Element = any> implements Clearable {
  /**
   * 
   */
  public element: Element | undefined

  /**
   * 
   */
  public source: Allocator<Element> | undefined

  /**
   * 
   */
  public free(): void {
    this.source.free(this.element)
    Allocated.ALLOCATOR.free(this)
  }

  /**
   * 
   */
  public clear(): void {
    this.element = undefined
    this.source = undefined
  }
}

/**
 * 
 */
export namespace Allocated {
  /**
   * 
   */
  export function create<Element>(): Allocated<Element> {
    return new Allocated()
  }

  /**
   * 
   */
  export const ALLOCATOR: Allocator<Allocated> = Allocator.fromFactory(create)
}