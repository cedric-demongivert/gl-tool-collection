import { Pack } from '@library/pack/Pack'
import { Sequence } from '@library/Sequence'

import { BalancedTree } from '@library/tree/BalancedTree'
import { BalancedTreeElement } from '@library/tree/BalancedTreeElement'
import { BalancedTreeNode } from '@library/tree/BalancedTreeNode'
import { BalancedTreeLeaf } from '@library/tree/BalancedTreeLeaf'

export class BalancedTreeWalker<Element>
{
  public static POSITIVE_INFINITY = Symbol('infinity')

  private _tree : BalancedTree<Element>
  private _path : Pack<BalancedTreeElement<Element>>
  private _indexes : Pack<number>
  private _indexesView : Sequence<number>

  /**
  * Instanciate a new balanced tree walker.
  */
  public constructor () {
    this._tree = null
    this._path = Pack.any(16)
    this._indexes = Pack.uint32(16)
    this._indexesView = this._indexes.view()
  }

  /**
  * @return True if this walker does not visit a tree.
  */
  public get isDetached () : boolean {
    return this._tree === null
  }

  /**
  * @return True if this walker is visiting a tree.
  */
  public get isAttached () : boolean {
    return this._tree !== null
  }

  /**
  * @return The tree that is visited by this walker if any.
  */
  public get tree () : BalancedTree<Element> {
    return this._tree
  }

  /**
  * @return The location of this walker as an array of index.
  */
  public get indexes () : Sequence<number> {
    return this._indexesView
  }

  /**
  * Detach this walker from its tree.
  */
  public detach () : void {
    this._tree = null
    this._path.clear()
    this._indexes.clear()
  }

  /**
  * Reset this walker and place it at the root of the tree.
  */
  public root () : void {
    this._tree.acceptWalker(this)
  }

  /**
  * Set this walker at the location of the given one.
  *
  * @param walker - Another walker to access.
  */
  public go (walker : BalancedTreeWalker<Element>) : void {
    this._path.clear()
    this._indexes.clear()

    for (let index = 0, size = walker._path.size; index < size; ++index) {
      this._path.push(walker._path.get(index))
    }

    for (let index = 0, size = walker._indexes.size; index < size; ++index) {
      this._indexes.push(walker._indexes.get(index))
    }
  }

  /**
  * Reset this walker and make it start at the begining of a new tree.
  *
  * @param tree - The new tree to visit.
  */
  public visit (tree : BalancedTree<Element>) : void {
    tree.acceptWalker(this)
  }

  /**
  * Reset this walker to its initial state.
  */
  public reset () : void {
    this._tree.acceptWalker(this)
  }

  /**
  * Initialize the current walker to the given root element.
  *
  * @param root - The new root element of this walker.
  */
  public initialize (root : BalancedTreeElement<Element>) : void {
    this._path.clear()
    this._indexes.clear()
    this._tree = root.tree
    this._path.push(root)
    this._indexes.push(0)
  }

  /**
  * @return True if the current element is a leaf.
  */
  public isLeaf () : boolean {
    return this._tree && this._path.last instanceof BalancedTreeLeaf
  }

  /**
  * @return True if the current element is a node.
  */
  public isNode () : boolean {
    return this._tree && this._path.last instanceof BalancedTreeNode
  }

  /**
  * @return True if the current element is the root element of the tree.
  */
  public isRoot () : boolean {
    return this._tree && this._path.last.parent == null
  }

  /**
  * Return true if this walker can exit the current element.
  */
  public canExit () : boolean {
    return this._path.size > 1
  }

  /**
  * Exit the current element.
  */
  public exit () : void {
    this._indexes.pop()
    this._path.pop()
  }

  public tryExit () : boolean {
    if (this.canExit()) {
      this.exit()
      return true
    } else {
      return false
    }
  }

  /**
  * @return True if there is another key next to the current one.
  */
  public hasNext () : boolean {
    const index : number = this._indexes.last
    const current : BalancedTreeElement<Element> = this._path.last

    return index < current.keys.size
  }

  /**
  * Select the given key of the current node.
  *
  * @param index - Index of the key to select.
  */
  public select (index : number) : void {
    this._indexes.set(this._indexes.size - 1, index)
  }

  public last () : void {
    this._indexes.set(
      this._indexes.size - 1,
      this._path.last.keys.size
    )
  }

  public isOnLastElement () : boolean {
    return this._indexes.last === this._path.last.keys.size
  }

  public first () : void {
    this._indexes.set(this._indexes.size - 1, 0)
  }

  public isOnFirstElement () : boolean {
    return this._indexes.last === 0
  }

  /**
  * Move to the next available key.
  */
  public next () : void {
    this._indexes.push(this._indexes.pop() + 1)
  }

  public tryNext () : boolean {
    if (this.hasNext()) {
      this.next()
      return true
    } else {
      return false
    }
  }

  /**
  * @return True if there is another key previous to the current one.
  */
  public hasPrevious () : boolean {
    const index : number = this._indexes.last

    return index > 0
  }

  /**
  * Move to the next available key.
  */
  public previous () : void {
    this._indexes.push(this._indexes.pop() - 1)
  }

  /**
  * @return True if this walker can enter into another children.
  */
  public canEnter () : boolean {
    const current : BalancedTreeElement<Element> = this._path.last
    const index : number = this._indexes.last

    return current instanceof BalancedTreeNode &&
           index < current.keys.size + 1
  }

  /**
  * Enter into the child that must contain the given element.
  *
  * @param element - Element to search.
  */
  public enterWith (element : Element) : void {
    const path : Pack<BalancedTreeElement<Element>> = this._path
    const indexes : Pack<number> = this._indexes

    const current : BalancedTreeElement<Element> = path.last
    indexes.pop()

    if (current instanceof BalancedTreeNode) {
      const bissection : number = current.indexOf(element)
      const index : number = bissection < 0 ? -bissection - 1 : bissection

      path.push(current.children.get(index))
      indexes.push(index)
      indexes.push(0)
    }
  }

  /**
  * Enter into the selected child of the current element.
  */
  public enter () : void {
    const current : BalancedTreeElement<Element> = this._path.last
    const index : number = this._indexes.last

    const next : BalancedTreeElement<Element> = (
      (current as BalancedTreeNode<Element>).children.get(index)
    )

    this._path.push(next)
    this._indexes.push(0)
  }

  /**
  * @return The current key index selected by this tree walker.
  */
  public getIndex () : number {
    return this._indexes.last
  }

  /**
  * @return The number of keys into the current element.
  */
  public getSize () : number {
    return this._path.last.keys.size + 1
  }

  /**
  * Return the key selected by this tree walker.
  *
  * @return The current key.
  */
  public key () : Element | Symbol {
    const index : number = this._indexes.last
    const current : BalancedTreeElement<Element> = this._path.last

    if (index === 0) {
      return BalancedTreeWalker.POSITIVE_INFINITY
    } else {
      return current.keys.get(index - 1)
    }
  }

  /**
  * Return true if this node contains the given element.
  *
  * @param element - Element to search.
  *
  * @return True if this node contains the given element.
  */
  public has (element : Element) : boolean {
    return this._path.last.has(element)
  }

  /**
  * Return the index of the given element into the current node.
  *
  * @param element - Element to search.
  *
  * @return The index of the given element into the current node.
  */
  public indexOf (element : Element) : number {
    return this._path.last.indexOf(element) + 1
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return other
    if (other === this) return true

    if (other instanceof BalancedTreeWalker) {
      return other.tree === this._tree &&
             other._path.last === this._path.last &&
             other._indexes.equals(this._indexes)
    }

    return false
  }
}
