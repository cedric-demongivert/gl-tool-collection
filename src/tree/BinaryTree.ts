import { ReallocableCollection } from '../ReallocableCollection'

export interface BTree<Value> extends ReallocableCollection<Value> {
  /**
  * Return the index of the parent cell of the given cell.
  *
  * @param index - Index of the child cell.
  *
  * @return The index of the parent cell of the given cell.
  */
  getParent (index : number) : number
}
