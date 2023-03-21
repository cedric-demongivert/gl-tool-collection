
import { Comparator } from '@cedric-demongivert/gl-tool-utils'

import { Pack } from '../pack/Pack'

import { ListSet } from './ListSet'

/**
 * 
 */
export class PackSet<Element, Wrapped extends Pack<Element>> extends ListSet<Element, Wrapped>
{
  /**
   * @see {@link Pack.capacity}
   */
  public get capacity(): number {
    return this._elements.capacity
  }

  /**
   * @see {@link Pack.reallocate}
   */
  public reallocate(capacity: number): void {
    this._elements.reallocate(capacity)
  }

  /**
   * @see {@link Pack.fit}
   */
  public fit(): void {
    this._elements.fit()
  }
}

/**
* Instantiate a new set that wrap a pack of the given type of instance.
*
* @param capacity - Capacity of the set to allocate.
*
* @returns A new set that wrap a pack of the given type of instance.
*/
export function createPackSet<Element, Wrapped extends Pack<Element>>(pack: Wrapped, comparator: Comparator<Element> = Comparator.compareWithOperator): PackSet<Element, Wrapped> {
  return new PackSet(pack, comparator)
}
