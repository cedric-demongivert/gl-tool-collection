import { Pack } from '../pack/Pack'
import { Packs } from '../pack/Packs'
import { bissect } from '../bissect'

import { Node } from './Node'

import { BalancedTree } from './BalancedTree'

export class Leaf<Element> {
  private _tree : BalancedTree<Element>
  private _parent : Node<Element>
  private _elements : Pack<Element>

  /**
  * Instantiate an empty leaf for the given tree.
  *
  * @param tree - The parent tree of the leaf to instantiate.
  */
  public constructor (tree : BalancedTree<Element>) {
    this._tree = tree
    this._parent = null
    this._elements = Packs.any(tree.order - 1)
  }

  public get tree () : BalancedTree<Element> {
    return this._tree
  }

  public get parent () : Node<Element> {
    return this._parent
  }

  public set parent (parent : Node<Element>) {
    this._parent = parent
  }

  /**
  * @see Collection.get size
  */
  public get size () : number {
    return this._elements.size
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : Element {
    return this._elements.get(index)
  }

  /**
  * @see Collection.first
  */
  public first () : Element {
    return this._elements.first()
  }

  /**
  * @see Collection.last
  */
  public last () : Element {
    return this._elements.last()
  }

  /**
  * Add the given element into this leaf.
  *
  * @param element - An element to add to this leaf.
  */
  public add (element : Element) : void {
    const elements : Pack<Element> = this._elements
    const index : number = bissect(elements, element, this._tree.comparator)
    elements.insert(index < 0 ? -index - 1 : index, element)
  }

  /**
  * @see Collection.has
  */
  public has (element : Element) : boolean {
    return bissect(this._elements, element, this._tree.comparator) >= 0
  }

  /**
  * @see Collection.indexOf
  */
  public indexOf (element : Element) : number {
    return bissect(this._elements, element, this._tree.comparator)
  }

  /**
  * Split a leaf in two by using a median element.
  *
  * The new leaf will contains all the elements greater than the choosen median.
  * The old leaf will contains all elements less than the choosen median.
  * As a result, the new leaf will replace the old one in its parent in order
  * to keep the parent node valid.
  *
  * @param median - Index of the median element to use.
  *
  * @return The new leaf, result of the split.
  */
  public split (median : number) : Leaf<Element> {
    const result : Leaf<Element> = new Leaf(this._tree)
    const source : Pack<Element> = this._elements
    const destination : Pack<Element> = result._elements
    const offset : number = median + 1

    for (let index = offset, size = source.size; index < size; ++index) {
      destination.push(source.get(index))
    }

    source.size = offset - 1

    if (this._parent) {
      this._parent.replace(source.get(median), result)
    }

    this._parent = null

    return result
  }
}
