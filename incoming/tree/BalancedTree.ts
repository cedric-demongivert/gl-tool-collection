import { Sequence } from '../Sequence'
import { SequentiallyAccessibleCollection } from '../SequentiallyAccessibleCollection'
import { Comparator } from '../Comparator'

import { BalancedTreeWalker } from './BalancedTreeWalker'

import * as elements from './elements'
import * as nodes from './nodes'
import * as leafs from './leafs'

export class BalancedTree<Element>
  implements Sequence<Element>,
             SequentiallyAccessibleCollection<Element>
{
  private _size : number
  private _order : number
  private _root : elements.TreeElement<Element>
  private _comparator : Comparator<Element, Element>
  private _walker : BalancedTreeWalker<Element>

  /**
  * Instanciate a new balanced tree.
  *
  * @param comparator - The comparator to use for ordering this balanced tree.
  * @param order - Order of the balanced tree.
  * @param capacity - Capacity in nodes to allocate for the tree.
  */
  public constructor (
    comparator : Comparator<Element, Element>,
    order : number
  ) {
    this._order = order
    this._comparator = comparator
    this._size = 0
    this._root = leafs.create(this)
    this._walker = new BalancedTreeWalker<Element>()
    this.acceptWalker(this._walker)
  }

  /**
  * @see Collection.isRandomlyAccessible
  */
  public get isRandomlyAccessible () : boolean {
    return false
  }

  /**
  * @see Collection.isSequentiallyAccessible
  */
  public get isSequentiallyAccessible () : boolean {
    return true
  }

  /**
  * @see Collection.isSet
  */
  public get isSet () : boolean {
    return false
  }

  /**
  * @see Collection.isStatic
  */
  public get isStatic () : boolean {
    return false
  }

  /**
  * @see Collection.isReallocable
  */
  public get isReallocable () : boolean {
    return false
  }

  /**
  * @see Collection.isSequence
  */
  public get isSequence () : boolean {
    return true
  }

  /**
  * Return the order of this balanced tree.
  *
  * The order of a balanced tree is the number of elements that each of this
  * node can store.
  *
  * @return The order of this balanced tree.
  */
  public get order () : number {
    return this._order
  }

  /**
  * @return The number of elements stored into this balanced tree.
  */
  public get size () : number {
    return this._size
  }

  /**
  * @return The comparator used by this balanced tree.
  */
  public get comparator () : Comparator<Element, Element> {
    return this._comparator
  }

  /**
  * Accept the given walker as a visitor of this tree.
  *
  * @param walker - A walker to accept as a visitor of this tree.
  */
  public acceptWalker (walker : BalancedTreeWalker<Element>) : void {
    walker.initialize(this._root)
  }

  /**
  * @return A new walker over this tree.
  */
  public walker () : BalancedTreeWalker<Element> {
    const result : BalancedTreeWalker<Element> = new BalancedTreeWalker()
    result.visit(this)
    return result
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : Element {
    let current : number = 0

    for (const value of this) {
      if (current === index) {
        return value
      } else {
        current += 1
      }
    }

    return undefined
  }

  /**
  * @see Collection.indexOf
  */
  public indexOf (element : Element) : number {
    let current : number = 0

    for (const value of this) {
      if (this._comparator(value, element) === 0) {
        return current
      } else {
        current += 1
      }
    }

    return -1
  }

  /**
  * @see Collection.has
  */
  public has (element : Element) : boolean {
    let current : elements.TreeElement<Element> = this._root

    while (current) {
      if (elements.has(current, element)) {
        return true
      }

      if (current.isLeaf) {
        current = null
      }

      const node : nodes.Node<Element> = current as nodes.Node<Element>
      const bissection : number = nodes.indexOf(node, element)

      current = node.children.get(bissection < 0 ? -bissection -1 : bissection)
    }

    return false
  }

  /**
  * Add the given element into this balanced tree.
  */
  public push (element : Element) : void {
    const leaf : leafs.Leaf<Element> = elements.getLeafWith(this._root, element)

    if (leaf.elements.size !== leaf.elements.capacity) {
      leafs.push(leaf, element)
    } else {
      const median : number = (leaf.elements.size >> 1) - 1
      const key : Element = leaf.elements.get(median)
      const smallers : leafs.Leaf<Element> = leaf
      const greaters : leafs.Leaf<Element> = leafs.split(leaf, median)

      if (this._comparator(element, key) > 0) {
        leafs.push(greaters, element)
      } else {
        leafs.push(smallers, element)
      }

      this.bubbleUp(smallers, greaters, key)
    }

    this._size += 1
  }

  /**
  * Bubble the given split up to the root of the tree.
  *
  * @param smallers - The tree element that contains the smaller data.
  * @param greaters - The tree element that contains the greater data.
  * @param key - The median used for the split.
  */
  public bubbleUp (
    smallers : elements.TreeElement<Element>,
    greaters : elements.TreeElement<Element>,
    key : Element
  ) {
    let parent : nodes.Node<Element> = greaters.parent

    while (parent && parent.children.capacity === parent.children.size) {
      const median : number = (parent.keys.size >> 1) - 1
      const nextKey : Element = parent.keys.get(median)
      const nextSmallers : nodes.Node<Element> = parent
      const nextGreaters : nodes.Node<Element> = nodes.split(parent, median)

      if (this._comparator(key, nextKey) > 0) {
        nodes.push(nextGreaters, key, smallers)
      } else {
        nodes.push(nextSmallers, key, smallers)
      }

      smallers = nextSmallers
      greaters = nextGreaters
      key = nextKey
      parent = greaters.parent
    }

    if (parent) {
      nodes.push(parent, key, smallers)
    } else {
      const node : nodes.Node<Element> = nodes.create(this)
      nodes.initialize(node, key, smallers, greaters)
      this._root = node
    }
  }

  /**
  * Empty this collection of its elements.
  */
  public clear () : void {
    this._root = leafs.create(this)
    this._size = 0
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof BalancedTree) {
      if (other.size !== this._size) return false

      throw new Error("Not implemented yet.")
    }

    return false
  }

  public xml () : string {
    const walker : BalancedTreeWalker<Element> = this._walker
    const result : string[] = []

    walker.visit(this)
    walker.forward()
    walker.start()

    let depth = 0

    while (!walker.isAtEnd()) {
      while (walker.canEnter()) {
        if (walker.getIndex() === 0) {
          result.push(`${' '.repeat(depth)}<node>`)

          result.push(`${' '.repeat(depth + 1)}<keys>`)
          for (let index = 0, size = walker.getSize(); index < size; ++index) {
            result.push(`${' '.repeat(depth + 2)}<key>${walker.get(index)}</key>`)
          }
          result.push(`${' '.repeat(depth + 1)}</keys>`)
        }

        walker.enter()

        depth += 1
      }

      result.push(`${' '.repeat(depth)}<leaf>`)
      result.push(`${' '.repeat(depth + 1)}<values>`)
      while (walker.hasNext()) {
        result.push(`${' '.repeat(depth + 2)}<value>${walker.next()}</value>`)
      }
      result.push(`${' '.repeat(depth + 1)}</values>`)
      result.push(`${' '.repeat(depth)}</leaf>`)

      if (walker.canExit()) {
        walker.exit()

        depth -= 1

        if (!walker.canEnter()) {
          result.push(`${' '.repeat(depth)}</node>`)
        }
      }
    }

    return result.join('\n\r')
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<Element> {
    const walker = this._walker
    walker.visit(this)
    walker.forward()
    walker.start()

    while (!walker.isAtEnd()) {
      console.log(`from ${[...walker.indexes].join(', ')}`)
      while (walker.canEnter()) {
        walker.enter()
        console.log(`entered in ${[...walker.indexes].join(', ')}`)
      }

      while (walker.hasNext()) {
        yield walker.next()
      }

      if (walker.canExit()) {
        walker.exit()
        console.log(`exited to ${[...walker.indexes].join(', ')}`)

        if (walker.canEnter()) {
          yield walker.get(walker.getIndex() - 1)
        }
      }
    }
  }
}
