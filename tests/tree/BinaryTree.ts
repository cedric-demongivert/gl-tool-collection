/** eslint-env jest */

import { BinaryTree } from '../../src/tree/BinaryTree'
import { toArray } from '../../src/toArray'

import { pickUnique } from '../pickUnique'

type BinaryTreeFactory<T, Result extends BinaryTree<T>> = (capacity : number) => Result

type SuiteConfiguration<T, TestedBinaryTree extends BinaryTree<T>>  = {
  factory: BinaryTreeFactory<T, TestedBinaryTree>,
  generator: () => T,
  copy: (toCopy : TestedBinaryTree) => TestedBinaryTree
}

export function isBinaryTree <T, TestedBinaryTree extends BinaryTree<T>> (
  configuration : SuiteConfiguration<T, TestedBinaryTree>
) {
  describe('#constructor', function () {
    it('allows to instantiate an empty tree', function () {
      const tree : TestedBinaryTree = configuration.factory(8)
      expect(toArray(tree)).toEqual([])
    })
  })

  describe('#isCollection', function () {
    it('returns true', function () {
      const tree : TestedBinaryTree = configuration.factory(8)
      expect(tree.isCollection).toBeTruthy()
    })
  })

  describe('#isBinaryTree', function () {
    it('returns true', function () {
      const tree : TestedBinaryTree = configuration.factory(8)
      expect(tree.isBinaryTree).toBeTruthy()
    })
  })

  describe('#get', function () {
    it('returns the nth element of the tree', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
      }

      expect(tree.size).toEqual(elements.length)

      for (let index = 0, size = tree.size; index < size; ++index) {
        elements.splice(elements.indexOf(tree.get(index)), 1)
      }

      expect(elements).toEqual([])

      for (let index = 0, size = tree.size; index < size; ++index) {
        if ((index >> 1) + 1 < size) {
          expect(
            tree.compare(index, (index >> 1) + 1)
          ).toBeLessThanOrEqual(0)
        }

        if ((index >> 1) + 2 < size) {
          expect(
            tree.compare(index, (index >> 1) + 2)
          ).toBeGreaterThanOrEqual(0)
        }
      }
    })
  })

  describe('#push', function () {
    it('add a value to the tree', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = new Array()

      expect(tree.size).toBe(0)

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
      }

      expect(tree.size).toEqual(elements.length)

      for (let index = 0, size = tree.size; index < size; ++index) {
        elements.splice(elements.indexOf(tree.get(index)), 1)
      }

      expect(elements).toEqual([])

      for (let index = 0, size = tree.size; index < size; ++index) {
        if ((index >> 1) + 1 < size) {
          expect(
            tree.compare(index, (index >> 1) + 1)
          ).toBeLessThanOrEqual(0)
        }

        if ((index >> 1) + 2 < size) {
          expect(
            tree.compare(index, (index >> 1) + 2)
          ).toBeGreaterThanOrEqual(0)
        }
      }
    })
  })

  describe('#delete', function () {
    it('delete a value of the tree', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = new Array()
      const removed : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
      }

      expect(tree.size).toBe(20)

      removed.push(tree.get(5))
      tree.delete(5)
      removed.push(tree.get(10))
      tree.delete(10)
      removed.push(tree.get(9))
      tree.delete(9)

      expect(tree.size).toBe(17)

      for (let index = 0, size = tree.size; index < size; ++index) {
        elements.splice(elements.indexOf(tree.get(index)), 1)
      }

      expect(elements.length).toEqual(removed.length)

      for (let index = 0, size = removed.length; index < size; ++index) {
        elements.splice(elements.indexOf(removed[index]), 1)
      }

      expect(elements).toEqual([])

      for (let index = 0, size = tree.size; index < size; ++index) {
        if ((index >> 1) + 1 < size) {
          expect(
            tree.compare(index, (index >> 1) + 1)
          ).toBeLessThanOrEqual(0)
        }

        if ((index >> 1) + 2 < size) {
          expect(
            tree.compare(index, (index >> 1) + 2)
          ).toBeGreaterThanOrEqual(0)
        }
      }
    })
  })

  describe('#has', function () {
    it('return true if the given value is in the tree', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = pickUnique(configuration.generator, 20)

      for (let index = 0; index < 20; ++index) {
        expect(tree.has(elements[index])).toBeFalsy()
        tree.push(elements[index])
        expect(tree.has(elements[index])).toBeTruthy()
      }

      expect(tree.has(elements[10])).toBeTruthy()
      tree.delete(tree.indexOf(elements[10]))
      expect(tree.has(elements[10])).toBeFalsy()
    })
  })

  describe('#indexOf', function () {
    it('return the index of the given value of the tree', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = pickUnique(configuration.generator, 20)

      for (let index = 0; index < 20; ++index) {
        expect(tree.indexOf(elements[index])).toBe(-1)
        tree.push(elements[index])
        expect(tree.get(tree.indexOf(elements[index]))).toBe(elements[index])
      }

      expect(tree.get(tree.indexOf(elements[10]))).toBe(elements[10])
      tree.delete(tree.indexOf(elements[10]))
      expect(tree.indexOf(elements[10])).toBe(-1)
    })
  })

  describe('#popGreatest', function () {
    it('removes the greatest value of the tree', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = new Array<T>()
      const removed : Array<T> = new Array<T>()

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
      }

      while (tree.size > 0) {
        removed.push(tree.popGreatest())
      }

      expect(toArray(tree)).toEqual([])

      for (let element of removed) {
        elements.splice(elements.indexOf(element), 1)
      }

      expect(elements).toEqual([])

      for (let index = 0; index < removed.length - 1; ++index) {
        expect(
          tree.comparator(removed[index], removed[index + 1])
        ).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('#popSmallest', function () {
    it('removes the smallest value of the tree', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = new Array<T>()
      const removed : Array<T> = new Array<T>()

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
      }

      while (tree.size > 0) {
        removed.push(tree.popSmallest())
      }

      expect(toArray(tree)).toEqual([])

      for (let element of removed) {
        elements.splice(elements.indexOf(element), 1)
      }

      expect(elements).toEqual([])

      for (let index = 0; index < removed.length - 1; ++index) {
        expect(
          tree.comparator(removed[index], removed[index + 1])
        ).toBeLessThanOrEqual(0)
      }
    })
  })

  describe('#clear', function () {
    it('empty the tree', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
      }

      expect(tree.size).toBe(20)

      tree.clear()

      expect(toArray(tree)).toEqual([])
    })
  })

  describe('#equals', function () {
    it('return true if both collections have the same content', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const copy : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
        copy.push(elements[index])
      }

      expect(tree.equals(copy)).toBeTruthy()
    })

    it('return true if both collections have the same content but different capacities', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const copy : TestedBinaryTree = configuration.factory(64)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
        copy.push(elements[index])
      }

      expect(tree.equals(copy)).toBeTruthy()
    })

    it('return false if both collections does not have the same content', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const different : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
        different.push(index == 5 ? configuration.generator() : elements[index])
      }

      expect(tree.equals(different)).toBeFalsy()
    })

    it('return false if both collections does not have the same size', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const different : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
        different.push(index == 5 ? configuration.generator() : elements[index])
      }

      different.push(configuration.generator())

      expect(tree.equals(different)).toBeFalsy()
    })

    it('return false otherwise', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
      }

      expect(tree.equals(null)).toBeFalsy()
      expect(tree.equals(5)).toBeFalsy()
      expect(tree.equals("warp")).toBeFalsy()
    })
  })

  describe('#copy', function () {
    it('return a copy of an existing tree', function () {
      const tree : TestedBinaryTree = configuration.factory(32)
      const elements : Array<T> = new Array()

      for (let index = 0; index < 20; ++index) {
        elements[index] = configuration.generator()
        tree.push(elements[index])
      }

      const copy : TestedBinaryTree = configuration.copy(tree)

      expect(tree.equals(copy)).toBeTruthy()
    })
  })
}
