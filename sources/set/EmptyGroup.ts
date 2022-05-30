import { Group } from './Group'
import { EmptyCollection } from '../EmptyCollection'

/**
 * An empty sequence, e.g., a sequence of zero elements.
 */
export class EmptyGroup<Element> extends EmptyCollection<Element> {
  /**
   * @see Collection.prototype.isGroup
   */
  public isGroup(): true {
    return true
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    return other instanceof EmptyGroup
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
export namespace EmptyGroup {
  /**
   * 
   */
  export const INSTANCE: EmptyGroup<any> = new EmptyGroup<any>()

  /**
   * 
   */
  export function get<Element>(): EmptyGroup<Element> {
    return INSTANCE
  }
}
