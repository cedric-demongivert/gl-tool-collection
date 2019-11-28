import { Pack } from '../pack/Pack'
import { Packs } from '../pack/Packs'
import { bissect } from '../bissect'

import { BalancedTree } from './BalancedTree'
import { TreeElement } from './elements'

export class Node<Element> {
  private _tree : BalancedTree<Element>
  private _parent : Node<Element>
  private _keys : Pack<Element>
  private _children : Pack<TreeElement<Element>>

  /**
  * Instantiate a new node for the given tree.
  *
  * @param tree - The parent tree of the node to instantiate.
  */
  public constructor (tree : BalancedTree<Element>) {
    this._tree = tree
    this._parent = null
    this._keys = Packs.any(tree.order - 1)
    this._children = Packs.any(tree.order)
  }

  public get size () : number {
    return this._keys.size
  }

  public indexOfChildWithElement (
    node : Node<Element>,
    element : Element
  ) : number {
    const bissection : number = bissect(this._keys, element, this._tree.comparator)
    return bissection < 0 ? -bissection - 1 : bissection
  }

  public get (index : number) : Element {
    return this._keys.get(index)
  }

  public getChild (index : number) : TreeElement<Element> {
    return this._children.get(index)
  }

  public has (element : Element) : boolean {
    return bissect(this._keys, element, this._tree.comparator) >= 0
  }

  public indexOf (element : Element) : number {
    return bissect(this._keys, element, this._tree.comparator)
  }

  public push (median : Element, smallers : TreeElement<Element>) : void {
    const bissection : number = bissect(this._keys, median, this._tree.comparator)
    const index : number = bissection < 0 ? -bissection-1 : bissection

    this._keys.insert(index, median)
    this._children.insert(index, smallers)

    smallers.parent = this
  }

  public replace(key : Element, value : TreeElement<Element>) : void {
    const bissection : number = bissect(this._keys, key, this._tree.comparator)
    const index : number = bissection < 0 ? -bissection-1 : bissection
    const oldChildren = this._children.get(index)

    this._children.set(index, value)

    value.parent = this
    oldChildren.parent = null
  }

  public initialize(
    key : Element,
    smallers : TreeElement<Element>,
    greaters : TreeElement<Element>
  ) {
    this._keys.size = 1
    this._keys.set(0, key)

    for (let index = 0, size = this._children.size; index < size; ++index) {
      this._children.get(index).parent = null
    }

    this._children.size = 2
    this._children.set(0, smallers)
    this._children.set(1, greaters)

    smallers.parent = this
    greaters.parent = this
  }

  /**
  * Split a node of this balanced tree in two by using a median element.
  *
  * The new node will contains all the elements greater than the choosen median.
  * The old node will contains all elements less than the choosen median.
  * As a result, the new node will replace the old one in its parent in order
  * to keep the parent node valid.
  *
  * @param median - Index of the median element to use.
  *
  * @return The new node, result of the split.
  */
  public split (median : number) : Node<Element> {
    const smallers : Node<Element> = this
    const greaters : Node<Element> = new Node(this._tree)
    const srcKeys : Pack<Element> = smallers._keys
    const srcChildren : Pack<TreeElement<Element>> = smallers._children
    const dstKeys : Pack<Element> = greaters._keys
    const dstChildren : Pack<TreeElement<Element>> = greaters._children

    const offset : number = median + 1

    for (let index = offset, size = srcChildren.size; index < size; ++index) {
      dstKeys.push(srcKeys.get(index))
      dstChildren.push(srcChildren.get(index))
    }

    dstChildren.push(srcChildren.last())
    srcKeys.size = median - 1
    srcChildren.size = median

    greaters._parent = this._parent

    return greaters
  }
}
