import { Sequence } from '../Sequence'
import { Comparator } from '../Comparator'
import { bissect } from '../algorithm/bissect'
import { View } from '../view/View'
import { Collection } from '../Collection'
import { CollectionIterator } from '../iterator/CollectionIterator'

import { BalancedTreeWalker } from './BalancedTreeWalker'
import { BalancedTreeElement } from './BalancedTreeElement'
import { BalancedTreeNode } from './BalancedTreeNode'
import { BalancedTreeLeaf } from './BalancedTreeLeaf'
import { BalancedTreeIterator } from './BalancedTreeIterator'

function indent(depth: number): string {
  return '  '.repeat(depth)
}

function invert<A, B>(comparator: Comparator<A, B>): Comparator<A, B> {
  return (left: A, right: B) => -comparator(left, right)
}

export class BalancedTree<Element> implements Sequence<Element>
{
  private _size: number
  private _order: number
  private _root: BalancedTreeElement<Element>
  private _ascending: Comparator<Element, Element>
  private _descending: Comparator<Element, Element>
  private _walker: BalancedTreeWalker<Element>
  private _iterator: BalancedTreeIterator<Element>

  /**
  * Instanciate a new balanced tree.
  *
  * @param comparator - The comparator to use for ordering this balanced tree.
  * @param order - Order of the balanced tree.
  * @param capacity - Capacity in nodes to allocate for the tree.
  */
  public constructor(
    comparator: Comparator<Element, Element>,
    order: number
  ) {
    this._order = order
    this._ascending = comparator
    this._descending = invert(comparator)
    this._size = 0
    this._root = new BalancedTreeLeaf<Element>(this)
    this._walker = new BalancedTreeWalker<Element>()
    this._iterator = new BalancedTreeIterator(this)
    this.acceptWalker(this._walker)
  }

  /**
  * Return the order of this balanced tree.
  *
  * The order of a balanced tree is the number of elements that each of this
  * node can store.
  *
  * @returns The order of this balanced tree.
  */
  public get order(): number {
    return this._order
  }

  /**
  * @returns The number of elements stored into this balanced tree.
  */
  public get size(): number {
    return this._size
  }

  /**
  * @returns The ascending order of this balanced tree.
  */
  public get ascending(): Comparator<Element, Element> {
    return this._ascending
  }

  /**
  * @returns The descending order of this balanced tree.
  */
  public get descending(): Comparator<Element, Element> {
    return this._descending
  }

  /**
  * Accept the given walker as a visitor of this tree.
  *
  * @param walker - A walker to accept as a visitor of this tree.
  */
  public acceptWalker(walker: BalancedTreeWalker<Element>): void {
    walker.initialize(this._root)
  }

  /**
  * @returns A new walker over this tree.
  */
  public walker(): BalancedTreeWalker<Element> {
    const result: BalancedTreeWalker<Element> = new BalancedTreeWalker()
    result.visit(this)
    return result
  }

  /**
  * @see Sequence.get
  */
  public get(index: number): Element {
    let current: number = 0

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
  * @see Sequence.indexOf
  */
  public indexOf(element: Element): number {
    let current: number = 0

    for (const value of this) {
      if (this._ascending(value, element) === 0) {
        return current
      } else {
        current += 1
      }
    }

    return -1
  }

  /**
  * @see Sequence.hasInSubsequence
  */
  public hasInSubsequence(element: Element, offset: number, size: number): boolean {
    return this.indexOfInSubsequence(element, offset, size) >= 0
  }

  /**
  * @see Sequence.indexOfInSubsequence
  */
  public indexOfInSubsequence(element: Element, offset: number, size: number): number {
    const index: number = this.indexOf(element)
    return index >= offset && index < offset + size ? index : -1
  }

  /**
  * @see Sequence.first
  */
  public get first(): Element {
    let current: BalancedTreeElement<Element> = this._root

    while (current instanceof BalancedTreeNode) {
      current = current.children.last
    }

    return current.keys.last
  }

  /**
  * @see Sequence.firstIndex
  */
  public get firstIndex(): number {
    return 0
  }

  /**
  * @see Sequence.last
  */
  public get last(): Element {
    let current: BalancedTreeElement<Element> = this._root

    while (current instanceof BalancedTreeNode) {
      current = current.children.first
    }

    return current.keys.first
  }

  /**
  * @see Sequence.lastIndex
  */
  public get lastIndex(): number {
    return this._size - 1
  }

  /**
  *
  */
  public search<T>(value: T, comparator: Comparator<T, Element>): Element {
    let current: BalancedTreeElement<Element> = this._root

    while (current instanceof BalancedTreeNode) {
      const bissection: number = bissect.invert(
        current.keys, value, comparator
      )

      current = current.children.get(
        bissection < 0 ? -bissection - 1 : bissection
      )
    }

    const bissection: number = bissect.invert(
      current.keys, value, comparator
    )

    return bissection < 0 ? null : current.keys.get(bissection)
  }

  /**
  * @see Collection.has
  */
  public has(element: Element): boolean {
    let current: BalancedTreeElement<Element> = this._root

    while (!current.has(element)) {
      if (current instanceof BalancedTreeNode) {
        current = current.child(element)
      } else {
        return false
      }
    }

    return true
  }

  /**
  * Return the leaf of this tree that must contains the given element.
  *
  * @param element - An element to search.
  *
  * @returns The leaf of this tree that must contains the given element.
  */
  private getLeafWith(element: Element): BalancedTreeLeaf<Element> {
    let current: BalancedTreeElement<Element> = this._root

    while (current instanceof BalancedTreeNode) {
      current = current.child(element)
    }

    return current as BalancedTreeLeaf<Element>
  }

  /**
  * Add the given element into this balanced tree.
  *
  * @param element - The element to add into this balanced tree.
  */
  public push(element: Element): void {
    const leaf: BalancedTreeLeaf<Element> = this.getLeafWith(element)

    if (leaf.complete) {
      const median: number = (this._order - 1) >> 1
      const key: Element = leaf.keys.get(median)
      const smallers: BalancedTreeLeaf<Element> = leaf.split(median)

      if (this._ascending(element, key) > 0) {
        leaf.push(element)
      } else {
        smallers.push(element)
      }

      this.bubbleUp(key, smallers, leaf, leaf.parent)
    } else {
      leaf.push(element)
    }

    this._size += 1
  }

  /**
  * Insert back the given key / value pair into the given node
  *
  * @param key - The key to insert.
  * @param value - The tree element that contains the data.
  * @param node - The node to mutate.
  */
  public bubbleUp(
    key: Element,
    smallers: BalancedTreeElement<Element>,
    greaters: BalancedTreeElement<Element>,
    node: BalancedTreeNode<Element>
  ) {
    while (node && node.complete) {
      const median: number = (this._order - 1) >> 1
      const nextKey: Element = node.keys.get(median)
      const nextSmallers: BalancedTreeNode<Element> = node.split(median)
      const nextGreaters: BalancedTreeNode<Element> = node

      if (this._ascending(key, nextKey) > 0) {
        nextGreaters.push(key, smallers)
      } else {
        nextSmallers.push(key, smallers)
      }

      smallers = nextSmallers
      greaters = nextGreaters
      key = nextKey
      node = greaters.parent
    }

    if (node) {
      node.push(key, smallers)
    } else {
      const root: BalancedTreeNode<Element> = new BalancedTreeNode(this)
      root.setUpmost(greaters)
      root.push(key, smallers)
      this._root = root
    }
  }

  /**
  * Empty this collection of its elements.
  */
  public clear(): void {
    this._root = new BalancedTreeLeaf<Element>(this)
    this._size = 0
  }

  /**
  * @see Collection.clone
  */
  public clone(): BalancedTree<Element> {
    return this
  }

  /**
  * @see Collection.clone
  */
  public view(): Collection<Element> {
    return View.wrap(this)
  }

  /**
  * @see Collection.iterator
  */
  public iterator(): CollectionIterator<Element> {
    return new BalancedTreeIterator<Element>(this)
  }

  public xml(): string {
    const walker: BalancedTreeWalker<Element> = this._walker
    const result: string[] = []

    walker.visit(this)
    walker.root()

    let depth = 1

    result.push('<root>')
    do {
      while (walker.canEnter()) {
        result.push(`${indent(depth)}<node key="${walker.key().toString()}">`)
        walker.enter()
        depth += 1
      }

      for (let index = 0, size = walker.getSize(); index < size; ++index) {
        walker.select(index)
        result.push(`${indent(depth)}<value>${walker.key().toString()}</value>`)
      }

      while (walker.isOnLastElement() && walker.tryExit()) {
        depth -= 1;
        result.push(
          `${indent(depth)}</node>` +
          `<!-- /key #${walker.getIndex()} ${walker.key().toString()} -->`
        )
      }
    } while (walker.tryNext())
    result.push('</root>')

    return result.join('\n\r')
  }

  /**
  * @see Collection.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof BalancedTree) {
      if (other.size !== this._size) return false
      if (other.size === 0) return true

      const a: BalancedTreeIterator<Element> = this._iterator
      const b: BalancedTreeIterator<Element> = other._iterator

      if (a.next() !== b.next()) return false

      while (a.hasNext()) {
        if (a.next() !== b.next()) return false
      }

      return true
    }

    return false
  }

  /**
  * @see Collection.iterator
  */
  public *[Symbol.iterator](): Iterator<Element> {
    if (this._size > 0) {
      const iterator: BalancedTreeIterator<Element> = this._iterator
      iterator.start()

      yield iterator.get()

      while (iterator.hasNext()) {
        iterator.next()
        yield iterator.get()
      }
    }
  }
}
