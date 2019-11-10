import { ReallocableCollection } from '../ReallocableCollection'
import { Pack } from '../pack/Pack'
import { Comparator } from '../Comparator'

/**
* A binary tree based uppon a pack collection.
*/
export class PackBinaryTree<Value> implements ReallocableCollection<Value>{
  private _elements : Pack<Value>
  private _comparator : Comparator<Value, Value>

  /**
  * Instantiate a new empty BTree node.
  *
  * @param elements - Pack to use for storing this binary tree.
  * @param comparator - A comparator.
  */
  public constructor (
    elements : Pack<Value>,
    comparator : Comparator<Value, Value>
  ) {
    this._comparator = comparator
    this._elements = elements
  }

  /**
  * Return the index of the smallest value of this tree.
  *
  * @return The index of the smallest value of this tree.
  */
  public getSmallest () : number {
    const size : number = this._elements.size

    let next : number = 0
    let result : number = -1

    while (next < size) {
      result = next
      next = next << 1
    }

    return result
  }

  /**
  * Return the index of the greatest value of this tree.
  *
  * @return The index of the greatest value of this tree.
  */
  public getGreatest () : number {
    const result : number = this._elements.size - 1
    return result & 0b1 ? result : result - 1
  }

  /**
  * Insert the given value into this tree.
  *
  * @param value - A value to insert into this tree.
  */
  public add (value : Value) : void {
    this._elements.push(value)
    this.correct(this._elements.size - 1)
  }

  private correct (index : number) : void {
    const size : number = this._elements.size

    let cell : number = index
    let parent : number = cell >> 1

  }

  private isInvalidChild (child : number, parent : number) : boolean {
    const comparison : number = this.compare(child, parent)
    const greater : number = child & 0b1
    return (greater && comparison < 0) || (!greater && comparison > 0)
  }

  /**
  * Remove a cell from this tree.
  *
  * @param index - Index of the cell to delete.
  */
  public delete (index : number) : void {
    this._elements.warp(index)

    if (index < this._elements.size) {
      let cell : number = index

      while (cell > 0) {
        const parent : number = cell >> 1
        const comparison : number = this.compare(cell, parent)

        if (cell & 0b1) {
          if (comparison < 0) {
            this._elements.swap(cell, parent)
          }
        } else if (comparison > 0) {
          this._elements.swap(cell, parent)
        }
      }
    }
  }

  /**
  * Compare the content of two cell.
  *
  * @param left - Index of the cell to use as a left operand.
  * @param right - Index of the cell to use as a right operand.
  *
  * @return A comparison number.
  */
  private compare (left : number, right : number) : number {
    return this._comparator(this._elements.get(left), this._elements.get(right))
  }

  /**
  * @return The index of the root cell of this binary tree.
  */
  public getRoot () : number {
    return 0
  }

  /**
  * @see Collection#get
  */
  public get (index : number) : Value {
    return this._elements.get(index)
  }

  /**
  * @see Collection#indexOf
  */
  public indexOf (value : Value) : number {
    const size : number = this._elements.size
    let index : number = 0
    let comparison : number = 0

    while (index < size) {
      comparison = this._comparator(this._elements.get(index), value)

      if (comparison < 0) {
        index = index << 1 | 0b1
      } else if (comparison > 0) {
        index = index << 1
      } else {
        return index
      }
    }

    return -1
  }

  /**
  * @see Collection#has
  */
  public has (value : Value) : boolean {
    return this.indexOf(value) >= 0
  }

  /**
  * @see Collection#get size
  */
  public get size () : number {
    return this._elements.size
  }

  /**
  * @see StaticCollection#get capacity
  */
  public get capacity () : number {
    return this._elements.capacity
  }

  /**
  * @see Collection#get isCollection
  */
  public get isCollection () : boolean {
    return true
  }

  public get isBinaryTree () : boolean {
    return true
  }

  /**
  * @see ReallocableCollection#reallocate
  */
  public reallocate (capacity : number) : void {
    this._elements.reallocate(capacity)
  }

  /**
  * @see ReallocableCollection#fit
  */
  public fit () : void {
    this._elements.fit()
  }

  /**
  * Return the index of the smaller child cell of a given cell.
  *
  * @param index - Index of the parent cell.
  *
  * @return The index of the smaller child cell of the given cell.
  */
  public getSmaller (index : number) : number {
    return index << 1
  }

  /**
  * Return the index of the greater child cell of a given cell.
  *
  * @param index - Index of the parent cell.
  *
  * @return The index of the greater child cell of the given cell.
  */
  public getGreater (index : number) : number {
    return index << 1 + 1
  }

  /**
  * Return true if the given cell is a smaller child cell.
  *
  * @param index - Index of the cell to check.
  *
  * @return True if the given cell is a smaller child cell.
  */
  public isSmaller (index : number) : boolean {
    return (index & 0b1) === 0
  }

  /**
  * Return true if the given cell is a greater child cell.
  *
  * @param index - Index of the cell to check.
  *
  * @return True if the given cell is a greater child cell.
  */
  public isGreater (index : number) : boolean {
    return (index & 0b1) === 1
  }

  /**
  * Return true if the given cell has a greater child cell.
  *
  * @param index - Index of the cell to check.
  *
  * @return True if the given cell has a greater child cell.
  */
  public hasGreater (index : number) : boolean {
    return index << 1 + 1 < this._elements.size
  }

  /**
  * Return true if the given cell has a smaller child cell.
  *
  * @param index - Index of the cell to check.
  *
  * @return True if the given cell has a smaller child cell.
  */
  public hasSmaller (index : number) : boolean {
    return index << 1 < this._elements.size
  }

  /**
  * Return true if the given cell is a leaf the tree.
  *
  * @param index - Index of the cell to check.
  *
  * @return True if the given cell is a leaf the tree.
  */
  public isLeaf (index : number) : boolean {
    return index << 1 < this._elements.size
  }

  /**
  * Return true if the given cell is the root of the tree.
  *
  * @param index - Index of the cell to check.
  *
  * @return True if the given cell is the root of this tree.
  */
  public isRoot (index : number) : boolean {
    return index === 0
  }

  /**
  * Return true if the given cell has a parent cell.
  *
  * @param index - Index of the child cell to check.
  *
  * @return True if the given cell has a parent cell.
  */
  public hasParent (index : number) : boolean {
    return index > 0
  }

  /**
  * Return the index of the parent cell of the given cell.
  *
  * @param index - Index of the child cell from wich getting the parent index.
  *
  * @return The index of the parent cell of the given cell.
  */
  public getParent (index : number) : number {
    return index >> 1
  }

  /**
  * Empty this collection of its elements.
  */
  public clear () : void {
    this._elements.clear()
  }

  /**
  * @see Collection#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof PackBinaryTree) {
      if (this.size !== other.size) return false

      for (let index = 0, size = this.size; index < size; ++index) {
        if (this.get(index) !== other.get(index)) {
          return false
        }
      }

      return true
    }

    return false
  }

  /**
  * @see ReallocableCollection#iterator
  */
  public * [Symbol.iterator] () {
    yield * this._elements
  }
}
