import { BidirectionalIterator } from '@library/iterator/BidirectionalIterator'
import { CollectionIterator } from '@library/iterator/CollectionIterator'
import { BalancedTree } from '@library/tree/BalancedTree'
import { BalancedTreeWalker } from '@library/tree/BalancedTreeWalker'

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
  * @see CollectionIterator.collection
  */
  public collection () : BalancedTree<Element> {
    return this._walker.tree
  }

  /**
  * @see CollectionIterator.move
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
  * @see CollectionIterator.get
  */
  public get () : Element {
    return this._walker.key() as Element
  }

  /**
  * @see ForwardIterator.end
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
  * @see BackwardIterator.start
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
  * @see BackwardIterator.hasPrevious
  */
  public hasPrevious () : boolean {
    return this._index > 0
  }

  /**
  * @see ForwardIterator.next
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
  * @see BackwardIterator.backward
  */
  public backward (count : number) : void {
    for (let index = 0; index < count && this.hasPrevious(); ++index) {
      this.previous()
    }
  }

  /**
  * @see ForwardIterator.hasNext
  */
  public hasNext () : boolean {
    return this._index < this._walker.tree.size - 1
  }

  /**
  * @see ForwardIterator.next
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
  * @see ForwardIterator.forward
  */
  public forward (count : number) : void {
    for (let index = 0; index < count && this.hasNext(); ++index) {
      this.next()
    }
  }

  /**
  * @see BidirectionalIterator.go
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
  * @see CollectionIterator.equals
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
