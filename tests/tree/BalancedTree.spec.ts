/** eslint-env jest */

import { BalancedTree } from '../../src/tree/BalancedTree'
import { toArray } from '../../src/toArray'

function numberComparator (left : number, right : number) : number {
  return left - right
}

describe('#BalancedTree', function () {
  describe('#constructor', function () {
    it('instantiate a new balanced tree', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 5)

      expect(tree.order).toBe(5)
      expect(tree.ascending).toBe(numberComparator)
      expect(tree.size).toBe(0)
      expect(toArray(tree)).toEqual([])
    })
  })

  describe('#push', function () {
    it('add an element in a tree', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 5)

      expect(tree.size).toBe(0)
      expect(toArray(tree)).toEqual([])

      tree.push(5)

      expect(tree.size).toBe(1)
      expect(toArray(tree)).toEqual([5])
    })

    it('is able to fill leaf nodes', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 5)

      for (let index = 0; index < 20; ++index) {
        expect(tree.size).toBe(0)
        expect(toArray(tree)).toEqual([])

        const values : number[] = [
          Math.random(), Math.random(),
          Math.random(), Math.random()
        ]

        values.forEach(tree.push.bind(tree))
        values.sort(tree.ascending)

        expect(tree.size).toBe(4)
        expect(toArray(tree)).toEqual(values)

        tree.clear()
      }
    })

    it('is able to split leaf nodes', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 5)

      for (let index = 0; index < 20; ++index) {
        expect(tree.size).toBe(0)
        expect(toArray(tree)).toEqual([])

        const values : number[] = [
          Math.random(), Math.random(),
          Math.random(), Math.random(),
          Math.random(), Math.random()
        ]

        values.forEach(tree.push.bind(tree))
        values.sort(tree.ascending)

        expect(tree.size).toBe(6)
        expect(toArray(tree)).toEqual(values)

        tree.clear()
      }
    })

    it('is able to balance itself', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 4)

      for (let index = 0; index < 20; ++index) {
        expect(tree.size).toBe(0)
        expect(toArray(tree)).toEqual([])

        const values : number[] = []

        while (values.length < 100) {
          values.push(Math.random())
        }

        for (const value of values) {
          tree.push(value)
        }

        values.sort(numberComparator)

        expect(tree.size).toBe(values.length)
        expect(toArray(tree)).toEqual(values)

        tree.clear()
      }
    })

    it('work if it is a big tree', function () {
      const tree : BalancedTree<number> = new BalancedTree(numberComparator, 32)

      expect(tree.size).toBe(0)
      expect(toArray(tree)).toEqual([])

      const values : number[] = []

      while (values.length < 3000) {
        values.push(Math.random())
      }

      for (const value of values) {
        tree.push(value)
      }

      values.sort(numberComparator)

      expect(tree.size).toBe(values.length)
      expect(toArray(tree)).toEqual(values)

      tree.clear()
    })
  })
})
