import { Pack } from '../pack/Pack'

import { BalancedTreeElement } from './BalancedTreeElement'
import { BalancedTree } from './BalancedTree'

export class BalancedTreeLeaf<Element> extends BalancedTreeElement<Element> {
  /**
  * Instantiate an empty leaf for the given tree.
  *
  * @param tree - The parent tree of the leaf to instantiate.
  */
  public constructor(tree: BalancedTree<Element>) {
    super(tree)
  }

  /**
  * Add the given key into this leaf.
  *
  * @param key - A key to add to this leaf.
  */
  public push(key: Element): void {
    this._keys.push(key)
    this._keys.sort(this.descending)
  }

  /**
  * Split a leaf in two by using a median element.
  *
  * @param median - Index of the median element to use.
  *
  * @returns The new leaf, result of the split.
  */
  public split(median: number): BalancedTreeLeaf<Element> {
    const smallers: BalancedTreeLeaf<Element> = new BalancedTreeLeaf(this.tree)
    const source: Pack<Element> = this._keys
    const destination: Pack<Element> = smallers._keys

    for (let index = median + 1, size = source.size; index < size; ++index) {
      destination.push(source.get(index))
    }

    source.size = median

    return smallers
  }
}
