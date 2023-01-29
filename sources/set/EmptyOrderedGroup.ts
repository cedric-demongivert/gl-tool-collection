import { Group } from './Group'
import { EmptySequence } from '../sequence'
import { OrderedGroup } from './OrderedGroup'

/**
 * An empty sequence, e.g., a sequence of zero elements.
 */
export class EmptyOrderedGroup<Element> extends EmptySequence<Element> implements OrderedGroup<Element> {
  /**
   * @see {@link Collection.isGroup}
   */
  public isGroup(): true {
    return true
  }

  /**
   * @see {@link Clonable.clone}
   */
  public clone(): this {
    return this
  }

  /**
   * @see {@link Collection.view}
   */
  public view(): this {
    return this
  }

  /**
   * @see {@link Comparable.equals}
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    return other instanceof EmptyOrderedGroup
  }

  /**
   * @see {@link Object.toString}
   */
  public toString(): string {
    return this.constructor.name + ' ' + Group.stringify(this)
  }
}

/**
 * 
 */
export namespace EmptyOrderedGroup {
  /**
   * 
   */
  export const INSTANCE: EmptyOrderedGroup<any> = new EmptyOrderedGroup<any>()

  /**
   * 
   */
  export function get<Element>(): EmptyOrderedGroup<Element> {
    return INSTANCE
  }
}
