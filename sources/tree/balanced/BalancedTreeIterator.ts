import { BidirectionalIterator } from '../iterator/BidirectionalIterator'
import { CollectionIterator } from '../iterator/CollectionIterator'

import { BalancedTree } from './BalancedTree'
import { BalancedTreeWalker } from './BalancedTreeWalker'

export class BalancedTreeIterator<Element> implements BidirectionalIterator<Element> {
  private _walker : BalancedTreeWalker<Element>
  private _index : number

  public constructor (balancedTree : BalancedTree<Element>) {
    this._walker = new BalancedTreeWalker()
    this._walker.visit(balancedTree)
    this._index = 0
    this.start()
  }

  /**
  * @see {@link CollectionIterator.collection}
  */
  public collection () : BalancedTree<Element> {
    return this._walker.tree
  }

  /**
  * @see {@link CollectionIterator.move}
  */
  public move (iterator : CollectionIterator<Element>) : void {
    if (iterator instanceof BalancedTreeIterator) {
      this._walker.go((iterator as BalancedTreeIterator<Element>)._walker)
    } else {
      throw new Error(
        'Trying to move to a location described by an unsupported type of ' +
        'iterator'
      )
    }
  }

  /**
  * @see {@link CollectionIterator.get}
  */
  public get () : Element {
    return this._walker.key() as Element
  }

  /**
  * @see {@link ForwardIterator.end}
  */
  public end () : void {
    this._walker.root()

    while (this._walker.canEnter()) {
      this._walker.enter()
    }

    this._walker.next()
    this._index = this._walker.tree.size - 1
  }

  /**
  * @see {@link BackwardIterator.start}
  */
  public start () : void {
    this._walker.root()

    while (this._walker.canEnter()) {
      this._walker.last()
      this._walker.enter()
    }

    this._walker.last()
    this._index = 0
  }

  /**
  * @see {@link BackwardIterator.hasPrevious}
  */
  public hasPrevious () : boolean {
    return this._index > 0
  }

  /**
  * @see {@link ForwardIterator.next}
  */
  public previous () : void {
    if (this._walker.isLeaf() && this._walker.isOnLastElement()) {
      while (this._walker.isOnLastElement() && this._walker.canExit()) {
        this._walker.exit()
      }
    } else {
      while (this._walker.canEnter()) {
        this._walker.enter()
      }
    }

    this._walker.next()

    this._index -= 1
  }

  /**
  * @see {@link BackwardIterator.backward}
  */
  public backward (count : number) : void {
    for (let index = 0; index < count && this.hasPrevious(); ++index) {
      this.previous()
    }
  }

  /**
  * @see {@link ForwardIterator.hasNext}
  */
  public hasNext () : boolean {
    return this._index < this._walker.tree.size - 1
  }

  /**
  * @see {@link ForwardIterator.next}
  */
  public next () : void {
    this._walker.previous()

    while (this._walker.canEnter()) {
      this._walker.enter()
      this._walker.last()
    }

    while (this._walker.isOnFirstElement()) {
      this._walker.exit()
    }

    this._index += 1
  }

  /**
  * @see {@link ForwardIterator.forward}
  */
  public forward (count : number) : void {
    for (let index = 0; index < count && this.hasNext(); ++index) {
      this.next()
    }
  }

  /**
  * @see {@link BidirectionalIterator.go}
  */
  public go (index : number) : void {
    while (this._index > index) this.previous()
    while (this._index < index) this.next()
  }

  public clone () : BalancedTreeIterator<Element> {
    const result : BalancedTreeIterator<Element> = new BalancedTreeIterator(
      this.collection()
    )

    result.move(this)

    return result
  }

  /**
  * @see {@link CollectionIterator.equals}
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof BalancedTreeIterator) {
      return this._walker.equals(other._walker)
    }

    return false
  }
}
