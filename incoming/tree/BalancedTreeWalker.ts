import { Pack } from '../pack/Pack'
import { Packs } from '../pack/Packs'
import { View } from '../View'

import { BalancedTree } from './BalancedTree'
import * as nodes from './nodes'
import * as elements from './elements'

function first<Element>(
  isMovingForward : boolean,
  node : elements.TreeElement<Element>
) : number {
  return isMovingForward ? 0 : elements.sizeOf(node) + (node.isLeaf ? 0 : 1)
}

export class BalancedTreeWalker<Element> {
  private _tree : BalancedTree<Element>
  private _path : Pack<elements.TreeElement<Element>>
  private _indexes : Pack<number>
  private _forward : boolean
  private _indexesView : View<number>

  /**
  * Instanciate a new balanced tree walker.
  */
  public constructor () {
    this._tree = null
    this._path = Packs.any(16)
    this._indexes = Packs.uint32(16)
    this._forward = true
    this._indexesView = View.wrap(this._indexes)
  }

  /**
  * @return True if this walker does not visit a tree.
  */
  public get isDetached () : boolean {
    return this._tree === null
  }

  /**
  * @return True if this walker visiting a tree.
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
  * @return True if this walker is moving forward.
  */
  public get isForward () : boolean {
    return this._forward
  }

  /**
  * @return True if this walker is moving backward.
  */
  public get isBackward () : boolean {
    return !this._forward
  }

  /**
  * @return The location of this walker as an array of index.
  */
  public get indexes () : View<number> {
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
  * Start moving forward.
  */
  public forward () : void {
    this.setMovingForward(true)
  }

  /**
  * Start moving backward.
  */
  public backward () : void {
    this.setMovingForward(false)
  }

  /**
  * Start moving forward or backward.
  *
  * @param isMovingForward - True if this walker must go forward, false otherwise.
  */
  public setMovingForward (isMovingForward : boolean) : void {
    if (this._forward !== isMovingForward) {
      this._forward = isMovingForward

      for (let index = 0, size = this._indexes.size; index < size; ++index) {
        this._indexes.set(
          index,
          this._indexes.get(index) + (isMovingForward ? -1 : +1)
        )
      }
    }
  }

  /**
  * Reset this walker and place it at the first element of the tree.
  */
  public start () : void {
    this._path.size = 1
    this._indexes.clear()
    this._indexes.push(0)
  }

  /**
  * Reset this walker and place it at the last element of the tree.
  */
  public end () : void {
    this._path.size = 1
    this._indexes.clear()
    this._indexes.push(first(false, this._path.last()))
  }

  /**
  * @return True if this walker is at the start of the tree.
  */
  public isAtStart () : boolean {
    return this._path.size === 1 && this._indexes.get(0) === 0
  }

  /**
  * @return True if this walker is at the end of the tree.
  */
  public isAtEnd () : boolean {
    return this._path.size === 1 &&
           this._indexes.get(0) === elements.sizeOf(this._path.get(0))
  }

  /**
  * Set this walker at the location of the given one.
  *
  * @param walker - Another walker to access.
  */
  public goToLocation (walker : BalancedTreeWalker<Element>) : void {
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
  * Return true if this walker is a the same location as the given one.
  *
  * @param walker - Another walker.
  *
  * @return True if this walker is a the same location as the given one.
  */
  public isAtLocation (walker : BalancedTreeWalker<Element>) : boolean {
    return walker._path.get(walker._path.size - 1) == (
      this._path.get(this._path.size - 1)
    ) && walker._indexes.equals(this._indexes)
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
  public initialize (root : elements.TreeElement<Element>) : void {
    this._path.clear()
    this._indexes.clear()
    this._tree = root.tree
    this._path.push(root)

    if (this._forward) {
      this.start()
    } else {
      this.end()
    }
  }

  /**
  * @return True if the current element is a leaf.
  */
  public isLeaf () : boolean {
    return this._tree && this._path.get(this._path.size - 1).isLeaf
  }

  /**
  * @return True if the current element is a node.
  */
  public isNode () : boolean {
    return this._tree && !this._path.get(this._path.size - 1).isLeaf
  }

  /**
  * @return True if the current element is the root element of the tree.
  */
  public isRoot () : boolean {
    return this._tree && this._path.get(this._path.size - 1).parent == null
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
    const path : Pack<elements.TreeElement<Element>> = this._path
    const indexes : Pack<number> = this._indexes

    indexes.pop()
    path.pop()

    const index : number = indexes.pop()

    indexes.push(index + (this._forward ? 1 : -1))
  }

  public hasNext () : boolean {
    const index : number = this._indexes.last()
    const current : elements.TreeElement<Element> = this._path.last()

    return this._forward ? index < elements.sizeOf(current) : index > 0
  }

  public next () : Element {
    const index : number = this._indexes.pop() + (this._forward ? 0 : -1)
    const current : elements.TreeElement<Element> = this._path.last()

    const result : Element = elements.get(current, index)

    this._indexes.push(index + (this._forward ? 1 : 0))

    return result
  }

  /**
  * @return True if this walker can enter into another children.
  */
  public canEnter () : boolean {
    const current : elements.TreeElement<Element> = this._path.last()
    const index : number = this._indexes.last() + (this._forward ? 0 : -1)

    return !current.isLeaf && index >= 0 && index <= elements.sizeOf(current)
  }

  /**
  * Enter into the child that must contain the given element.
  */
  public enterWith (element : Element) : void {
    const path : Pack<elements.TreeElement<Element>> = this._path
    const indexes : Pack<number> = this._indexes

    const current : elements.TreeElement<Element> = path.last()

    if (!current.isLeaf) {
      const node : nodes.Node<Element> = current as nodes.Node<Element>
      const bissection : number = nodes.indexOf(node, element)
      const index : number = bissection < 0 ? -bissection - 1 : bissection

      path.push(node.children.get(index))
      indexes.set(indexes.size - 1, index + (this._forward ? 0 : 1))
      indexes.push(this._forward ? 0 : elements.sizeOf(node.children.get(index)) + 1)
    }
  }

  /**
  * Enter into the next available children of the current node.
  */
  public enter () : void {
    const current : elements.TreeElement<Element> = this._path.last()
    const index : number = this._indexes.last() + (this._forward ? 0 : -1)

    const next : elements.TreeElement<Element> = (
      (current as nodes.Node<Element>).children.get(index)
    )

    this._path.push(next)
    this._indexes.push(first(this._forward, next))
  }

  /**
  * @return The current tree walker index.
  */
  public getIndex () : number {
    return this._indexes.last()
  }

  /**
  * @return The number of elements into the current node.
  */
  public getSize () : number {
    return elements.sizeOf(this._path.last())
  }

  /**
  * Get the ith element of the current node.
  *
  * @param index - Index of the element of the current node to retrieve.
  *
  * @return The requested element.
  */
  public get (index : number) : Element {
    return elements.get(this._path.last(), index)
  }

  /**
  * Return true if this node contains the given element.
  *
  * @param element - Element to search.
  *
  * @return True if this node contains the given element.
  */
  public has (element : Element) : boolean {
    return elements.has(this._path.last(), element)
  }

  /**
  * Return the index of the given element into the current node.
  *
  * @param element - Element to search.
  *
  * @return The index of the given element into the current node.
  */
  public indexOf (element : Element) : number {
    return elements.indexOf(this._path.last(), element)
  }
}
