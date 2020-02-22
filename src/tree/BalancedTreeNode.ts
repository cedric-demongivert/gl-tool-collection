import { Pack } from '../pack/Pack'
import { Sequence } from '../Sequence'
import { bissect } from '../algorithm/bissect'

import { BalancedTree } from './BalancedTree'
import { BalancedTreeElement } from './BalancedTreeElement'

export class BalancedTreeNode<Element> extends BalancedTreeElement<Element> {
  private _children : Pack<BalancedTreeElement<Element>>
  private _childrenView : Sequence<BalancedTreeElement<Element>>

  /**
  * Instantiate a new node for the given tree.
  *
  * @param tree - The parent tree of the node to instantiate.
  */
  public constructor (tree : BalancedTree<Element>) {
    super(tree)
    this._children = Pack.any(tree.order)
    this._childrenView = this._children.view()
  }

  /**
  * @return A view over each child element of this element.
  */
  public get children () : Sequence<BalancedTreeElement<Element>> {
    return this._childrenView
  }

  /**
  * Return the index of the child that must contains the given element.
  *
  * @param element - An element to search.
  *
  * @return The index of the child that must contains the given element.
  */
  public indexOfChildWithElement (element : Element) : number {
    const bissection : number = bissect(this._keys, element, this.descending)
    return bissection < 0 ? -bissection - 1 : bissection + 1
  }

  /**
  * Return the index of the given child.
  *
  * @param child - A child to search.
  *
  * @return The index of the given child.
  */
  public indexOfChild (child : BalancedTreeElement<Element>) : number {
    const keys : Pack<Element> = this._keys
    const children : Pack<BalancedTreeElement<Element>> = this._children

    const key : Element = child.keys.first
    const bissection : number = bissect.first(keys, key, this.descending)
    let index : number = bissection < 0 ? -bissection - 1 : bissection

    while (children.get(index) !== child) {
      index += 1

      if (
        index < keys.size && this.descending(keys.get(index), key) !== 0 ||
        index > children.size
      ) { return -index }
    }

    return index
  }

  /**
  * Return the child that must contains the given element.
  *
  * @param element - An element to search.
  *
  * @return The child that must contains the given element.
  */
  public child (element : Element) : BalancedTreeElement<Element> {
    const bissection : number = bissect(this._keys, element, this.descending)
    return this._children.get(bissection < 0 ? -bissection - 1 : bissection)
  }

  /**
  * Set the given pair into this tree node.
  *
  * @param key
  * @param element
  */
  public push (key : Element, element : BalancedTreeElement<Element>) : void {
    const bissection : number = bissect(this._keys, key, this.descending)
    const index : number = bissection < 0 ? -bissection-1 : bissection

    this._keys.insert(index, key)
    this._children.insert(index + 1, element)

    element.parent = this
  }

  /**
  * Set the tree element that contains the greaters keys.
  *
  * @param element - The new element with the greaters keys.
  */
  public setUpmost (element : BalancedTreeElement<Element>) {
    if (this._children.first != null) {
      this._children.first.parent = null
    }

    this._children.set(0, element)
    this._children.first.parent = this
  }

  /**
  * Split a node of this balanced tree in two by using a median element.
  *
  * @param median - Index of the median element to use.
  *
  * @return The new node, result of the split.
  */
  public split (median : number) : BalancedTreeNode<Element> {
    const smallers : BalancedTreeNode<Element> = new BalancedTreeNode(this.tree)
    const srcKeys : Pack<Element> = this._keys
    const srcChildren : Pack<BalancedTreeElement<Element>> = this._children
    const dstKeys : Pack<Element> = smallers._keys
    const dstChildren : Pack<BalancedTreeElement<Element>> = smallers._children

    for (let index = median + 1, size = srcKeys.size; index < size; ++index) {
      dstKeys.push(srcKeys.get(index))
      dstChildren.push(srcChildren.get(index))
      srcChildren.get(index).parent = smallers
    }

    dstChildren.push(srcChildren.last)
    srcChildren.last.parent = smallers
    srcKeys.size = median
    srcChildren.size = median + 1

    return smallers
  }
}
