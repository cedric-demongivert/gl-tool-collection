/** eslint-env jest */

import { BalancedTreeNode } from '../../src/tree/BalancedTreeNode'
import { BalancedTree } from '../../src/tree/BalancedTree'
import { toArray } from '../../src/toArray'

function numberComparator (left : number, right : number) : number {
  return left - right
}

describe('#BalancedTreeNode', function () {
  describe('#constructor', function () {
    it('instantiate a new balanced tree node', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 5)
      const node : BalancedTreeNode<number> = new BalancedTreeNode(tree)

      expect(toArray(node.keys)).toEqual([])
      expect(toArray(node.children)).toEqual([])
      expect(node.ascending).toBe(numberComparator)
      expect(node.descending).toBe(tree.descending)
      expect(node.tree).toBe(tree)
      expect(node.parent).toBeNull()
      expect(node.complete).toBeFalsy()
    })
  })

  describe('#get complete', function () {
    it('return true if the node is complete, false otherwise', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 40)
      const node : BalancedTreeNode<number> = new BalancedTreeNode(tree)

      expect(toArray(node.keys)).toEqual([])
      expect(toArray(node.children)).toEqual([])


      for (let index = 0; index < 39; ++index) {
        expect(node.complete).toBeFalsy()
        node.push(Math.random(), new BalancedTreeNode(tree))
      }

      expect(node.keys.size).toBe(39)
      expect(node.complete).toBeTruthy()
    })
  })

  describe('#has', function () {
    it('return true if the given element exists into the node', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 40)
      const node : BalancedTreeNode<number> = new BalancedTreeNode(tree)

      const values : number[] = [1, 3, 4, 5, 8, 9]

      for (const value of values) {
        node.push(value, new BalancedTreeNode(tree))
      }

      for (let index = 0; index < 20; ++index) {
        expect(node.has(index)).toBe(values.indexOf(index) >= 0)
      }
    })
  })

  describe('#indexOf', function () {
    it('return the index of the value into the node', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 40)
      const node : BalancedTreeNode<number> = new BalancedTreeNode(tree)

      const values : number[] = [1, 3, 4, 5, 8, 9]

      for (const value of values) {
        node.push(value, new BalancedTreeNode(tree))
      }

      for (let index = 0; index < 20; ++index) {
        const result : number = values.indexOf(index)

        if (result >= 0) {
          expect(node.indexOf(index)).toBe(values.length - result - 1)
        } else {
          expect(node.indexOf(index)).toBeLessThan(0)
        }
      }
    })
  })

  describe('#push', function () {
    it('add an element to the node', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 40)
      const node : BalancedTreeNode<number> = new BalancedTreeNode(tree)

      expect(toArray(node.keys)).toEqual([])
      expect(toArray(node.children)).toEqual([])

      const values : [number, BalancedTreeNode<number>][] = []

      for (let index = 0; index < 32; ++index) {
        const key : number = Math.random()
        const value : BalancedTreeNode<number> = new BalancedTreeNode(tree)
        node.push(key, value)
        values.push([key, value])
      }

      values.sort(function (a, b) { return node.descending(a[0], b[0]) })

      expect(node.keys.size).toBe(32)
      expect(toArray(node.keys)).toEqual(values.map(x => x[0]))
      expect(toArray(node.children)).toEqual([null, ...values.map(x => x[1])])
    })
  })

  describe('#indexOfChildWithElement', function () {
    it('return the index of the child node that must contains the given element', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 40)
      const node : BalancedTreeNode<number> = new BalancedTreeNode(tree)

      expect(toArray(node.keys)).toEqual([])

      const values : [number, BalancedTreeNode<number>][] = [
        [1, new BalancedTreeNode(tree)],
        [8, new BalancedTreeNode(tree)],
        [13, new BalancedTreeNode(tree)],
        [32, new BalancedTreeNode(tree)],
        [128, new BalancedTreeNode(tree)],
        [200, new BalancedTreeNode(tree)],
        [400, new BalancedTreeNode(tree)]
      ]

      node.setUpmost(new BalancedTreeNode(tree))

      for (let index = 0; index < values.length; ++index) {
        node.push(values[index][0], values[index][1])
      }

      expect(node.indexOfChildWithElement(-6)).toBe(values.length)
      expect(node.indexOfChildWithElement(1)).toBe(values.length)
      expect(node.indexOfChildWithElement(12)).toBe(values.length - 2)
      expect(node.indexOfChildWithElement(13)).toBe(values.length - 2)
      expect(node.indexOfChildWithElement(14)).toBe(values.length - 3)
      expect(node.indexOfChildWithElement(2600)).toBe(0)
    })
  })

  describe('#split', function () {
    it('split a node in two by using a median value', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 40)
      const node : BalancedTreeNode<number> = new BalancedTreeNode(tree)

      expect(toArray(node.keys)).toEqual([])
      expect(toArray(node.children)).toEqual([])

      const upmost : BalancedTreeNode<number> = new BalancedTreeNode(tree)
      const refs : any[] = [ upmost ]

      node.setUpmost(upmost)

      const values : [number, BalancedTreeNode<number>][] = []

      for (let index = 0; index < 32; ++index) {
        const key : number = Math.random()
        const value : BalancedTreeNode<number> = new BalancedTreeNode(tree)
        node.push(key, value)
        values.push([key, value])

        refs.push(value)
      }

      values.sort(function (a, b) { return node.descending(a[0], b[0]) })

      expect(node.keys.size).toBe(32)
      expect(toArray(node.keys)).toEqual(values.map(x => x[0]))
      expect(toArray(node.children)).toEqual([upmost, ...values.map(x => x[1])])

      const split : BalancedTreeNode<number> = node.split(8)

      expect(node.keys.size).toBe(8)
      expect(split.keys.size).toBe(32 - 9)
      expect(node.children.size).toBe(9)
      expect(split.children.size).toBe(33 - 9)

      expect(toArray(node.keys)).toEqual(
        values.slice(0, 8).map(x => x[0])
      )
      expect(toArray(split.keys)).toEqual(
        values.slice(9, 32).map(x => x[0])
      )

      expect(toArray(node.children)).toEqual([
        upmost, ...values.slice(0, 8).map(x => x[1])
      ])
      expect(toArray(split.children)).toEqual(
        values.slice(8, 32).map(x => x[1])
      )
    })
  })
})
