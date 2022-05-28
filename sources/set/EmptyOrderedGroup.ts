import { protomark } from '../mark'

import { Group } from './Group'
import { EmptySequence } from '../sequence'
import { OrderedGroup } from './OrderedGroup'

/**
 * An empty sequence, e.g., a sequence of zero elements.
 */
@protomark(Group)
export class EmptyOrderedGroup<Element> extends EmptySequence<Element> implements OrderedGroup<Element> {
  /**
   * @see Clonable.prototype.clone
   */
  public clone(): this {
    return this
  }

  /**
   * @see Collection.prototype.view
   */
  public view(): this {
    return this
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    return other instanceof EmptyOrderedGroup
  }

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
