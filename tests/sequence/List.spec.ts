import { List } from "../../src/sequence/List"
import { Comparator } from "../../src/Comparator"
import { Factory } from "../../src/Factory"

import { pick } from '../pick'
import { creates } from '../creates'
import { repeat } from '../repeat'
import { VirtualGenerator } from "../VirtualGenerator"
import { next } from "../next"
import { shuffle } from "../shuffle"

/**
 * 
 */
export namespace ListSpecification {
  /**
   * 
   */
  export function defaultValue<Element>(list: List<Element>): Factory<Element> {
    return list.defaultValue.bind(list)
  }

  /**
   * 
   */
  export namespace size {
    /**
     * 
     */
    export function itUpdatesTheSizeOfTheSequence<Element>(context: Context<Element>): void {
      it('updates the size of the list', function () {
        const list: List<Element> = context.factory()

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)

        list.size = 2

        expect([...list]).toEqual([...creates(defaultValue(list), 2)])
        expect(list.size).toBe(2)

        list.size = 8

        expect([...list]).toEqual([...creates(defaultValue(list), 8)])
        expect(list.size).toBe(8)

        list.size = 4

        expect([...list]).toEqual([...creates(defaultValue(list), 4)])
        expect(list.size).toBe(4)
      })
    }

    /**
     * 
     */
    export function itMayTruncateTheSequence<Element>(context: Context<Element>): void {
      it('may truncate the list', function () {
        const content: Element[] = [...pick(context.values(), 4)]

        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(4)

        list.size = 2

        expect([...list]).toEqual(content.slice(0, 2))
        expect(list.size).toBe(2)

        list.size = 4

        expect([...list]).toEqual([
          ...content.slice(0, 2),
          ...creates(defaultValue(list), 2)
        ])

        expect(list.size).toBe(4)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itUpdatesTheSizeOfTheSequence(context)
      itMayTruncateTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace defaultValue {
    /**
     * 
     */
    export function itReturnsTheDefaultValueUsedByTheSequence<Element>(context: Context<Element>): void {
      it('returns the default value used by the list', function () {
        const list: List<Element> = context.factory()
        expect(() => list.defaultValue()).not.toThrow()
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itReturnsTheDefaultValueUsedByTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace pop {
    /**
     * 
     */
    export function itRemovesThenReturnsTheLastElementOfTheSequence<Element>(context: Context<Element>): void {
      it('removes then returns the last element of the list', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const list: List<Element> = context.factory()
        list.concatArray(content)

        while (list.size > 0) {
          const previousSize: number = list.size
          const value: Element = list.pop()

          expect(list.size).toBe(previousSize - 1)
          expect(value).toBe(content[list.size])
        }
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itRemovesThenReturnsTheLastElementOfTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace shift {
    /**
     * 
     */
    export function itRemovesThenReturnsTheFirstElementOfTheSequence<Element>(context: Context<Element>): void {
      it('removes then returns the first element of the list', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const list: List<Element> = context.factory()
        list.concatArray(content)

        while (list.size > 0) {
          const previousSize: number = list.size
          const value: Element = list.shift()

          expect(list.size).toBe(previousSize - 1)
          expect(value).toBe(content[content.length - list.size - 1])
        }
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itRemovesThenReturnsTheFirstElementOfTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace swap {
    /**
     * 
     */
    export function itSwapsTwoElementsOfTheSequence<Element>(context: Context<Element>): void {
      it('swaps two elements of the list', function () {
        const content: Element[] = [...pick(context.values(), 16)]

        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)

        list.swap(3, 8)

        for (let index = 0; index < 3; ++index) {
          expect(list.get(index)).toBe(content[index])
        }

        for (let index = 4; index < 8; ++index) {
          expect(list.get(index)).toBe(content[index])
        }

        for (let index = 9; index < 16; ++index) {
          expect(list.get(index)).toBe(content[index])
        }

        expect(list.get(3)).toBe(content[8])
        expect(list.get(8)).toBe(content[3])
      })
    }

    /**
     * 
     */
    export function itAllowsToSwapAnElementWithItself<Element>(context: Context<Element>): void {
      it('allows to swap an element with itself', function () {
        const content: Element[] = [...pick(context.values(), 16)]

        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)

        list.swap(5, 5)

        expect([...list]).toEqual(content)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itSwapsTwoElementsOfTheSequence(context)
      itAllowsToSwapAnElementWithItself(context)
    }
  }

  /**
   * 
   */
  export namespace set {
    /**
     * 
     */
    export function itReplacesAValueOfTheSequence<Element>(context: Context<Element>): void {
      it('replaces a value of the list', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const list: List<Element> = context.factory()

        list.size = 16

        expect([...list]).toEqual([...creates(defaultValue(list), 16)])

        for (let index = 0; index < 16; ++index) {
          list.set(index, content[index])
        }

        expect([...list]).toEqual(content)
      })
    }

    /**
     * 
     */
    export function itMayExpandTheSequence<Element>(context: Context<Element>): void {
      it('may expand the list', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const list: List<Element> = context.factory()

        for (let index = 0; index < 16; ++index) {
          list.set(index * 2, content[index])
        }

        expect(list.size).toBe(16 * 2 + 1)

        for (let index = 0; index < 16 * 2 + 1; ++index) {
          if (index % 2 == 0) {
            expect(list.get(index)).toBe(content[index / 2])
          } else {
            expect(list.get(index)).toBe(list.defaultValue())
          }
        }
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itReplacesAValueOfTheSequence(context)
      itMayExpandTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace setMany {
    /**
     * 
     */
    export function itReplacesConsecutiveValuesOfTheSequenceWithTheSameOne<Element>(context: Context<Element>): void {
      it('replaces consecutive values of the list with the same one', function () {
        const content: Element = next(context.values())
        const list: List<Element> = context.factory()

        list.size = 16

        expect([...list]).toEqual([...creates(defaultValue(list), 16)])

        list.setMany(3, 5, content)

        expect([...list]).toEqual([
          ...creates(defaultValue(list), 3),
          ...repeat(content, 5),
          ...creates(defaultValue(list), 8),
        ])
      })
    }

    /**
     * 
     */
    export function itMayExpandTheSequence<Element>(context: Context<Element>): void {
      it('may expand the list', function () {
        const content: Element = next(context.values())
        const list: List<Element> = context.factory()


        expect([...list]).toEqual([])

        list.setMany(3, 5, content)

        expect([...list]).toEqual([
          ...creates(defaultValue(list), 3),
          ...repeat(content, 5)
        ])
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itReplacesConsecutiveValuesOfTheSequenceWithTheSameOne(context)
      itMayExpandTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace sort {
    /**
     * 
     */
    export function itSortsTheElementsOfTheSequence<Element>(context: Context<Element>): void {
      it('sorts the elements of the list', function () {
        const content: Element[] = shuffle([...pick(context.values(), 128)])
        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(128)

        list.sort(context.comparator)
        content.sort(context.comparator)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(128)
      })
    }

    /**
     * 
     */
    export function itWorksOnEmptySequences<Element>(context: Context<Element>): void {
      it('works on empty sequences', function () {
        const list: List<Element> = context.factory()

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)

        expect(() => list.sort(context.comparator)).not.toThrow()

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itSortsTheElementsOfTheSequence(context)
      itWorksOnEmptySequences(context)
    }
  }

  /**
   * 
   */
  export namespace subsort {
    /**
     * 
     */
    export function itSortsTheElementsOfASubsequence<Element>(context: Context<Element>): void {
      it('sorts the elements of a subsequence', function () {
        const content: Element[] = shuffle([...pick(context.values(), 128)])
        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(128)

        list.subsort(20, 30, context.comparator)

        expect([...list]).toEqual([
          ...content.slice(0, 20),
          ...content.slice(20, 50).sort(context.comparator),
          ...content.slice(50, 128)
        ])
        expect(list.size).toBe(128)
      })
    }

    /**
     * 
     */
    export function itWorksOnEmptySubsequences<Element>(context: Context<Element>): void {
      it('works on empty subsequences', function () {
        const content: Element[] = shuffle([...pick(context.values(), 128)])
        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(128)

        list.subsort(20, 0, context.comparator)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(128)
      })
    }

    /**
     * 
     */
    export function itWorksOnEmptySequences<Element>(context: Context<Element>): void {
      it('works on empty sequences', function () {
        const list: List<Element> = context.factory()

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)

        list.subsort(0, 0, context.comparator)

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itSortsTheElementsOfASubsequence(context)
      itWorksOnEmptySubsequences(context)
      itWorksOnEmptySequences(context)
    }
  }

  /**
   * 
   */
  export namespace insert {
    /**
     * 
     */
    export function itInsertsAValueInTheSequence<Element>(context: Context<Element>): void {
      it('inserts a value into the pack', function () {
        const content: Element[] = [...pick(context.values(), 32)]

        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(32)

        for (let index = 0; index < content.length; ++index) {
          list.insert(16 + index, content[index])
        }

        expect([...list]).toEqual([
          ...content.slice(0, 16),
          ...content,
          ...content.slice(17, 32)
        ])
        expect(list.size).toBe(64)
      })
    }

    /**
     * 
     */
    export function itSetsAValueIfTheInsertionIndexIsOutsideTheSequence<Element>(context: Context<Element>): void {
      it('sets a value if the insertion index is outside the list', function () {
        const content: Element[] = [...pick(context.values(), 32)]

        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(32)

        list.insert(49, content[0])

        expect([...list]).toEqual([
          ...content,
          ...creates(defaultValue(list), 17),
          content[0]
        ])
        expect(list.size).toBe(50)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itInsertsAValueInTheSequence(context)
      itSetsAValueIfTheInsertionIndexIsOutsideTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace push {
    /**
     * 
     */
    export function itAddsAnElementAtTheEndOfTheSequence<Element>(context: Context<Element>): void {
      it('adds an element at the end of the list', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const list: List<Element> = context.factory()

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)

        for (let index = 0; index < content.length; ++index) {
          list.push(content[index])
          expect([...list]).toEqual(content.slice(index + 1))
          expect(list.size).toBe(index + 1)
        }
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itAddsAnElementAtTheEndOfTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace unshift {
    /**
     * 
     */
    export function itAddsAnElementAtTheStartOfTheSequence<Element>(context: Context<Element>): void {
      it('adds an element at the start of the list', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const list: List<Element> = context.factory()

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)

        for (let index = 0; index < content.length; ++index) {
          list.unshift(content[index])
          expect([...list]).toEqual(content.slice(index + 1).reverse())
          expect(list.size).toBe(index + 1)
        }
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itAddsAnElementAtTheStartOfTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace remove {
    /**
     * 
     */
    export function itDeletesAnElementOfTheSequence<Element>(context: Context<Element>): void {
      it('deletes an element of the list', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(16)

        list.delete(5)

        expect([...list]).toEqual([
          ...content.slice(0, 5),
          ...content.slice(6, 15)
        ])
        expect(list.size).toBe(15)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDeletesAnElementOfTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace deleteMany {
    /**
     * 
     */
    export function itDeletesConsecutiveElementsOfTheSequence<Element>(context: Context<Element>): void {
      it('deletes consecutive elements of the list', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(16)

        list.deleteMany(5, 7)

        expect([...list]).toEqual([
          ...content.slice(0, 5),
          ...content.slice(12, 15)
        ])
        expect(list.size).toBe(9)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDeletesConsecutiveElementsOfTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace warp {
    /**
     * 
     */
    export function itWarpsAnElementOfTheSequence<Element>(context: Context<Element>): void {
      it('warps an element of the list', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(16)

        list.warp(5)

        expect(new Set(list)).toEqual(new Set([
          ...content.slice(0, 5),
          ...content.slice(6, 15)
        ]))
        expect(list.size).toBe(15)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itWarpsAnElementOfTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace warpMany {
    /**
     * 
     */
    export function itWarpsConsecutiveElementsOfTheSequence<Element>(context: Context<Element>): void {
      it('warps consecutive elements of the list', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const list: List<Element> = context.factory()
        list.concatArray(content)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(16)

        list.warpMany(5, 7)

        expect(new Set(list)).toEqual(new Set([
          ...content.slice(0, 5),
          ...content.slice(12, 15)
        ]))
        expect(list.size).toBe(9)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itWarpsConsecutiveElementsOfTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace fill {
    /**
     * 
     */
    export function itWorksOnEmptySequences<Element>(context: Context<Element>): void {
      it('works on empty sequences', function () {
        const content: Element = next(context.values())
        const list: List<Element> = context.factory()

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)

        list.fill(content)

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)
      })
    }

    /**
     * 
     */
    export function itFillTheSequenceWithTheSameValue<Element>(context: Context<Element>): void {
      it('warps consecutive elements of the list', function () {
        const content: Element = next(context.values())
        const list: List<Element> = context.factory()

        list.size = 16

        expect([...list]).toEqual([...repeat(defaultValue(list), 16)])
        expect(list.size).toBe(16)

        list.fill(content)

        expect([...list]).toEqual([...repeat(content, 16)])
        expect(list.size).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itFillTheSequenceWithTheSameValue(context)
      itWorksOnEmptySequences(context)
    }
  }

  /**
   * 
   */
  export namespace concat {
    /**
     * 
     */
    export function itAllowsToConcatOnEmptySequences<Element>(context: Context<Element>): void {
      it('allows to concat on empty sequences', function () {
        const content: Element[] = [...pick(context.values(), 32)]
        const head: List<Element> = context.factory()
        const tail: List<Element> = context.factory()

        tail.concatArray(content)

        expect([...head]).toEqual([])
        expect([...tail]).toEqual(content)
        expect(head.size).toBe(0)
        expect(tail.size).toBe(32)

        head.concat(tail)

        expect([...head]).toEqual(content)
        expect([...tail]).toEqual(content)
        expect(head.size).toBe(32)
        expect(tail.size).toBe(32)
      })
    }
    /**
     * 
     */
    export function itAllowsToConcatEmptySequences<Element>(context: Context<Element>): void {
      it('allows to concat empty sequences', function () {
        const content: Element[] = [...pick(context.values(), 32)]
        const head: List<Element> = context.factory()
        const tail: List<Element> = context.factory()

        head.concatArray(content)

        expect([...head]).toEqual(content)
        expect([...tail]).toEqual([])
        expect(head.size).toBe(32)
        expect(tail.size).toBe(0)

        head.concat(tail)

        expect([...head]).toEqual(content)
        expect([...tail]).toEqual([])
        expect(head.size).toBe(32)
        expect(tail.size).toBe(0)
      })
    }

    /**
     * 
     */
    export function itAppendsASequenceToTheEndOfASequence<Element>(context: Context<Element>): void {
      it('appends a list to the end of a list', function () {
        const content: Element[] = [...pick(context.values(), 32)]
        const head: List<Element> = context.factory()
        const tail: List<Element> = context.factory()

        head.concatArray(content.slice(0, 16))
        tail.concatArray(content.slice(16, 32))

        expect([...head]).toEqual([...content.slice(0, 16)])
        expect([...tail]).toEqual([...content.slice(16, 32)])
        expect(head.size).toBe(16)
        expect(tail.size).toBe(16)

        head.concat(tail)

        expect([...head]).toEqual(content)
        expect([...tail]).toEqual([...content.slice(16, 32)])
        expect(head.size).toBe(32)
        expect(tail.size).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itAppendsASequenceToTheEndOfASequence(context)
      itAllowsToConcatEmptySequences(context)
      itAllowsToConcatOnEmptySequences(context)
    }
  }

  /**
   * 
   */
  export namespace concatArray {
    /**
     * 
     */
    export function itAllowsToConcatOnEmptySequences<Element>(context: Context<Element>): void {
      it('allows to concat on empty sequences', function () {
        const head: List<Element> = context.factory()
        const tail: Element[] = [...pick(context.values(), 32)]

        expect([...head]).toEqual([])
        expect(head.size).toBe(0)

        head.concatArray(tail)

        expect([...head]).toEqual(tail)
        expect(head.size).toBe(tail.length)
      })
    }

    /**
     * 
     */
    export function itAllowsToConcatEmptyArrays<Element>(context: Context<Element>): void {
      it('allows to concat empty arrays', function () {
        const head: List<Element> = context.factory()
        const tail: Element[] = []

        expect([...head]).toEqual([])
        expect(head.size).toBe(0)

        head.concatArray(tail)

        expect([...head]).toEqual([])
        expect(head.size).toBe(0)
      })
    }

    /**
     * 
     */
    export function itAppendsAnArrayToTheEndOfASequence<Element>(context: Context<Element>): void {
      it('appends an array to the end of a list', function () {
        const content: Element[] = [...pick(context.values(), 32)]
        const head: List<Element> = context.factory()

        head.concatArray(content.slice(0, 16))

        expect([...head]).toEqual([...content.slice(0, 16)])
        expect(head.size).toBe(16)

        head.concatArray(content.slice(16, 32))

        expect([...head]).toEqual(content)
        expect(head.size).toBe(content.length)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itAllowsToConcatOnEmptySequences(context)
      itAllowsToConcatEmptyArrays(context)
      itAppendsAnArrayToTheEndOfASequence(context)
    }
  }

  /**
   * 
   */
  export namespace copy {
    /**
     * 
     */
    export function itCopyAnExistingSequence<Element>(context: Context<Element>): void {
      it('allows to copy an existing list', function () {
        const content: Element[] = [...pick(context.values(), 32)]
        const origin: List<Element> = context.factory()
        const copy: List<Element> = context.factory()

        origin.concatArray(content)

        expect([...origin]).toEqual(content)
        expect([...copy]).toEqual([])
        expect(origin.size).toBe(32)
        expect(copy.size).toBe(0)

        copy.copy(origin)

        expect([...origin]).toEqual(content)
        expect([...copy]).toEqual(content)
        expect(origin.size).toBe(32)
        expect(copy.size).toBe(32)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itCopyAnExistingSequence(context)
    }
  }

  /**
   * 
   */
  export namespace clear {
    /**
     * 
     */
    export function itWorksOnEmptySequences<Element>(context: Context<Element>): void {
      it('works on empty sequences', function () {
        const list: List<Element> = context.factory()

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)

        list.clear()

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)
      })
    }

    /**
     * 
     */
    export function itEmptyASequence<Element>(context: Context<Element>): void {
      it('empty a list', function () {
        const content: Element[] = [...pick(context.values(), 32)]
        const list: List<Element> = context.factory()

        list.concatArray(content)

        expect([...list]).toEqual(content)
        expect(list.size).toBe(32)

        list.clear()

        expect([...list]).toEqual([])
        expect(list.size).toBe(0)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itWorksOnEmptySequences(context)
      itEmptyASequence(context)
    }
  }

  /**
   * 
   */
  export function defaultBehavior<Element>(context: Context<Element>): void {
    describe('it is a list', function () {
      describe('#size', size.defaultBehavior.bind(undefined, context))
      describe('#defaultValue', defaultValue.defaultBehavior.bind(undefined, context))
      describe('#pop', pop.defaultBehavior.bind(undefined, context))
      describe('#shift', shift.defaultBehavior.bind(undefined, context))
      describe('#swap', swap.defaultBehavior.bind(undefined, context))
      describe('#set', set.defaultBehavior.bind(undefined, context))
      describe('#setMany', setMany.defaultBehavior.bind(undefined, context))
      describe('#sort', sort.defaultBehavior.bind(undefined, context))
      describe('#subsort', subsort.defaultBehavior.bind(undefined, context))
      describe('#insert', insert.defaultBehavior.bind(undefined, context))
      describe('#push', push.defaultBehavior.bind(undefined, context))
      describe('#unshift', unshift.defaultBehavior.bind(undefined, context))
      describe('#delete', remove.defaultBehavior.bind(undefined, context))
      describe('#deleteMany', deleteMany.defaultBehavior.bind(undefined, context))
      describe('#warp', warp.defaultBehavior.bind(undefined, context))
      describe('#warpMany', warpMany.defaultBehavior.bind(undefined, context))
      describe('#fill', fill.defaultBehavior.bind(undefined, context))
      describe('#concat', concat.defaultBehavior.bind(undefined, context))
      describe('#concatArray', concatArray.defaultBehavior.bind(undefined, context))
      describe('#copy', copy.defaultBehavior.bind(undefined, context))
      describe('#clear', clear.defaultBehavior.bind(undefined, context))
    })
  }

  /**
   * 
   */
  export type Context<Element> = {
    factory: List.Factory<Element>,
    values: VirtualGenerator<Element>,
    comparator: Comparator<Element, Element>
  }
}