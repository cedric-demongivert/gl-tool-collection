import { Pack } from '../pack/Pack'
import { Packs } from '../pack/Packs'
import { bissect } from '../bissect'

import { BalancedTree } from './BalancedTree'
import { BalancedTreeElement } from './BalancedTreeElement'

export class BalancedTreeNode<Element> extends BalancedTreeElement<Element> {
  private _children : Pack<BalancedTreeElement<Element>>
  private _keys : Pack<Element>

  /**
  * Instanciate a new node for the given tree.
  *
  * @param tree - Parent tree of the node to instanciate.
  */
  public constructor (tree : BalancedTree<Element>) {
    super(tree)
    this._children = Packs.any(tree.order + 1)
    this._keys = Packs.any(tree.order)
  }

  /**
  * @return A pack that contains each children of this tree node.
  */
  public get children () : Pack<BalancedTreeElement<Element>> {
    return this._children
  }

  /**
  * @return A pack that contains each key used by this node.
  */
  public get keys () : Pack<Element> {
    return this._keys
  }

  /**
  * Push the given key / value pair into this node.
  *
  * @param key - A key to store.
  * @param element - An element to store.
  */
  public push (key : Element, element : BalancedTreeElement<Element>) : void {
    const index : number = bissect(this._keys, key, this.tree.comparator)

    this._keys.insert(index < 0 ? -index-1 : index, key)
    this._children.insert(index < 0 ? -index-1 : index, element)

    element.parent = this
  }

  public set (key : Element, element : BalancedTreeElement<Element>) : void {
    const bissection : number = bissect(this._keys, key, this.tree.comparator)
    const index : number = bissection < 0 ? -bissection-1 : bissection
    const oldChildren = this._children.get(index)

    this._children.set(index, element)

    element.parent = this
    oldChildren.parent = null
  }

  public initialize (
    key : Element,
    smallers : BalancedTreeElement<Element>,
    greaters : BalancedTreeElement<Element>
  ) {
    this._keys.size = 1
    this._keys.set(0, key)
    this._children.size = 2
    this._children.push(smallers)
    this._children.push(greaters)

    smallers.parent = this
    greaters.parent = this
  }

  public indexOfChildWithElement (element : Element) : number {
    const index : number = bissect(this._keys, element, this.tree.comparator)

    return index < 0 ? -index - 1 : index
  }
}
