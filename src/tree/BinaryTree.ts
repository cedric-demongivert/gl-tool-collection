import { Sequence } from '../Sequence'
import { ReallocableCollection } from '../ReallocableCollection'
import { SequentiallyAccessibleCollection } from '../SequentiallyAccessibleCollection'
import { Comparator } from '../Comparator'
import { Pack } from '../pack/Pack'
import { Packs } from '../pack/Packs'
import { SparseDenseSet } from '../set/SparseDenseSet'
import { Sets } from '../set/Sets'

export class BinaryTree<Element>
  implements Sequence<Element>,
             ReallocableCollection<Element>,
             SequentiallyAccessibleCollection<Element>
{
  private _smaller : Pack<number>
  private _greater : Pack<number>
  private _sizes : Pack<number>
  private _parents : Pack<number>
  private _elements : Pack<Element>
  private _nodes : SparseDenseSet
  private _cursor : number
  private _root : number
  private _comparator : Comparator<Element, Element>

  /**
  * Instanciate a new binary tree.
  *
  * @param comparator - The comparator to use for ordering this binary tree.
  */
  public constructor (
    comparator : Comparator<Element, Element>,
    capacity : number
  ) {
    this._root = 0
    this._cursor = 0
    this._nodes = Sets.SparseDense.adaptative(capacity)
    this._smaller = Packs.upTo(capacity + 1, capacity)
    this._greater = Packs.upTo(capacity + 1, capacity)
    this._parents = Packs.upTo(capacity + 1, capacity)
    this._sizes = Packs.upTo(capacity, capacity)
    this._elements = Packs.any(capacity)
    this._comparator = comparator
  }

  /**
  * @return The comparator used by this binary tree.
  */
  public getComparator () : Comparator<Element, Element> {
    return this._comparator
  }

  /**
  * @return The index of the root element of this tree.
  */
  public getRoot () : number {
    return this._root
  }

  /**
  * Insert the given value into this tree.
  *
  * @param value - A value to insert into this tree.
  */
  public push (value : Element) : void {

  }

  /**
  * Remove the given node from this tree.
  *
  * @param index - Index of the cell to delete.
  */
  public delete (index : number) : void {

  }

  /**
  * Return the index of the parent element of the given element.
  *
  * @param index - Index of the child element.
  *
  * @return The index of the parent element of the given element.
  */
  public getParent (index : number) : number {
    if (index === this._root) {
      return undefined
    } else {
      return this._parents.get(index)
    }
  }

  /**
  * Return the index of the smaller child element of a given element.
  *
  * @param index - Index of the parent element.
  *
  * @return The index of the smaller child element of the given element.
  */
  public getSmaller (index : number) : number {
    const result : number = this._smaller.get(index)

    if (result === this._nodes.capacity) {
      return undefined
    } else {
      return result
    }
  }

  /**
  * Return the index of the greater child element of a given element.
  *
  * @param index - Index of the parent element.
  *
  * @return The index of the greater child element of the given element.
  */
  public getGreater (index : number) : number {
    const result : number = this._greater.get(index)

    if (result === this._nodes.capacity) {
      return undefined
    } else {
      return result
    }
  }

  /**
  * Return true if the given element has a greater child element.
  *
  * @param index - Index of the parent element to check.
  *
  * @return True if the given element has a greater child element.
  */
  public hasGreater (index : number) : boolean {
    return this._greater.get(index) !== this._nodes.capacity
  }

  /**
  * Return true if the given cell has a smaller child cell.
  *
  * @param index - Index of the cell to check.
  *
  * @return True if the given cell has a smaller child cell.
  */
  hasSmaller (index : number) : boolean

  /**
  * Return true if the given cell is a leaf the tree.
  *
  * @param index - Index of the cell to check.
  *
  * @return True if the given cell is a leaf the tree.
  */
  isLeaf (index : number) : boolean

  /**
  * Return true if the given cell is the root of the tree.
  *
  * @param index - Index of the cell to check.
  *
  * @return True if the given cell is the root of this tree.
  */
  isRoot (index : number) : boolean

  /**
  * Return true if the given cell has a parent cell.
  *
  * @param index - Index of the child cell to check.
  *
  * @return True if the given cell has a parent cell.
  */
  hasParent (index : number) : boolean

  /**
  * Return the index of the parent cell of the given cell.
  *
  * @param index - Index of the child cell from wich getting the parent index.
  *
  * @return The index of the parent cell of the given cell.
  */
  getParent (index : number) : number

  /**
  * Empty this collection of its elements.
  */
  clear () : void
}
