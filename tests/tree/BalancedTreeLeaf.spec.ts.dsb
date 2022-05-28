/** eslint-env jest */

import { BalancedTreeLeaf } from '../../src/tree/BalancedTreeLeaf'
import { BalancedTree } from '../../src/tree/BalancedTree'

function numberComparator (left : number, right : number) : number {
  return left - right
}

describe('#BalancedTreeLeaf', function () {
  describe('#constructor', function () {
    it('instantiate a new balanced tree leaf', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 5)
      const leaf : BalancedTreeLeaf<number> = new BalancedTreeLeaf(tree)

      expect([...leaf.keys]).toEqual([])
      expect(leaf.ascending).toBe(numberComparator)
      expect(leaf.descending).toBe(tree.descending)
      expect(leaf.tree).toBe(tree)
      expect(leaf.parent).toBeNull()
      expect(leaf.complete).toBeFalsy()
    })
  })

  describe('#get complete', function () {
    it('return true if the leaf is complete, false otherwise', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 40)
      const leaf : BalancedTreeLeaf<number> = new BalancedTreeLeaf(tree)

      expect([...leaf.keys]).toEqual([])

      for (let index = 0; index < 39; ++index) {
        expect(leaf.complete).toBeFalsy()
        leaf.push(Math.random())
      }

      expect(leaf.keys.size).toBe(39)
      expect(leaf.complete).toBeTruthy()
    })
  })

  describe('#has', function () {
    it('return true if the given element exists into the leaf', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 40)
      const leaf : BalancedTreeLeaf<number> = new BalancedTreeLeaf(tree)

      const values : number[] = [1, 3, 4, 5, 8, 9]

      for (const value of values) {
        leaf.push(value)
      }

      for (let index = 0; index < 20; ++index) {
        expect(leaf.has(index)).toBe(values.indexOf(index) >= 0)
      }
    })
  })

  describe('#indexOf', function () {
    it('return the index of the value into the leaf', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 40)
      const leaf : BalancedTreeLeaf<number> = new BalancedTreeLeaf(tree)

      const values : number[] = [1, 3, 4, 5, 8, 9]

      for (const value of values) {
        leaf.push(value)
      }

      for (let index = 0; index < 20; ++index) {
        const result : number = values.indexOf(index)

        if (result >= 0) {
          expect(leaf.indexOf(index)).toBe(values.length - result - 1)
        } else {
          expect(leaf.indexOf(index)).toBeLessThan(0)
        }
      }
    })
  })

  describe('#push', function () {
    it('add an element to the leaf', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 40)
      const leaf : BalancedTreeLeaf<number> = new BalancedTreeLeaf(tree)

      expect([...leaf.keys]).toEqual([])

      const values : number[] = []

      for (let index = 0; index < 32; ++index) {
        const value : number = Math.random()
        leaf.push(value)
        values.push(value)
      }

      values.sort(leaf.descending)

      expect(leaf.keys.size).toBe(32)
      expect([...leaf.keys]).toEqual(values)
    })
  })

  describe('#split', function () {
    it('split a leaf in two by using a median value', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 40)
      const leaf : BalancedTreeLeaf<number> = new BalancedTreeLeaf(tree)

      expect([...leaf.keys]).toEqual([])

      const values : number[] = []

      for (let index = 0; index < 32; ++index) {
        const value : number = Math.random()
        leaf.push(value)
        values.push(value)
      }

      values.sort(leaf.descending)

      expect(leaf.keys.size).toBe(32)
      expect([...leaf.keys]).toEqual(values)

      const split : BalancedTreeLeaf<number> = leaf.split(8)

      expect(leaf.keys.size).toBe(8)
      expect([...leaf.keys]).toEqual(values.slice(0, 8))
      expect(split.keys.size).toBe(32 - 9)
      expect([...split.keys]).toEqual(values.slice(9, 32))
    })
  })
})
