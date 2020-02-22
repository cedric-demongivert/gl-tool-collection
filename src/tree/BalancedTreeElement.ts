import { Pack } from '../pack/Pack'
import { Sequence } from '../Sequence'
import { bissect } from '../algorithm/bissect'
import { Comparator } from '../Comparator'

import { BalancedTree } from './BalancedTree'
import { BalancedTreeNode } from './BalancedTreeNode'

export class BalancedTreeElement<Element> {
  protected _keys : Pack<Element>
  private _keysView : Sequence<Element>
  private _tree : BalancedTree<Element>
  private _parent : BalancedTreeNode<Element>

  /**
  * Instantiate a new empty balanced tree element.
  *
  * @param tree - The parent tree of the element to instantiate.
  */
  public constructor (tree : BalancedTree<Element>) {
    this._tree = tree
    this._parent = null
    this._keys = Pack.any(tree.order - 1)
    this._keysView = this._keys.view()
  }

  /**
  * @return True if this balanced tree element can't hold more elements.
  */
  public get complete () : boolean {
    return this._keys.size === this._keys.capacity
  }

  /**
  * @return A view over each keys into this element.
  */
  public get keys() : Sequence<Element> {
    return this._keysView
  }

  /**
  * @return The ascending order of this tree element.
  */
  public get ascending () : Comparator<Element, Element> {
    return this._tree.ascending
  }

  /**
  * @return The descending order of this tree element.
  */
  public get descending () : Comparator<Element, Element> {
    return this._tree.descending
  }

  /**
  * @return The parent tree of this element.
  */
  public get tree () : BalancedTree<Element> {
    return this._tree
  }

  /**
  * @return The parent element of this element if exists.
  */
  public get parent () : BalancedTreeNode<Element> {
    return this._parent
  }

  /**
  * Change the parent of this element.
  *
  * @param parent - The new parent element of this element.
  */
  public set parent (parent : BalancedTreeNode<Element>) {
    this._parent = parent
  }

  /**
  * Return true if this element contains the given key.
  *
  * @param key - A key to search.
  *
  * @return True if this element contains the given key.
  */
  public has (key : Element) : boolean {
    return bissect(this._keys, key, this.descending) >= 0
  }

  /**
  * Return the index of the given key into this element if exists.
  *
  * @param key - A key to search.
  *
  * @return The index of the given key into this element if exists.
  */
  public indexOf (key : Element) : number {
    return bissect(this._keys, key, this.descending)
  }
}
