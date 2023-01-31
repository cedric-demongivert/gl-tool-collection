import { Pack } from "../../src/sequence/Pack"
import { Comparator } from "../../src/Comparator"

import { ListSpecification } from "./List.spec"

import { pick } from '../pick'
import { VirtualGenerator } from "../VirtualGenerator"
import { shuffle } from "../shuffle"

/**
 * 
 */
export namespace PackSpecification {
  /**
   * 
   */
  export namespace reallocate {
    /**
     * 
     */
    export function itExpandsTheCapacity<Element>(context: Context<Element>): void {
      it('expands the collection\'s capacity', function () {
        const content: Element[] = [...pick(context.values(), 8)]
        const pack: Pack<Element> = context.factory(16)

        pack.concatArray(content)

        expect([...pack]).toEqual(content)
        expect(pack.capacity).toBe(16)
        expect(pack.size).toBe(8)

        pack.reallocate(32)

        expect([...pack]).toEqual(content)
        expect(pack.capacity).toBe(32)
        expect(pack.size).toBe(8)

        pack.reallocate(64)

        expect([...pack]).toEqual(content)
        expect(pack.capacity).toBe(64)
        expect(pack.size).toBe(8)
      })
    }

    /**
     * 
     */
    export function itReduceTheCapacity<Element>(context: Context<Element>): void {
      it('reduces the collection\'s capacity', function () {
        const content: Element[] = [...pick(context.values(), 5)]
        const pack: Pack<Element> = context.factory(64)

        pack.concatArray(content)

        expect([...pack]).toEqual(content)
        expect(pack.capacity).toBe(64)
        expect(pack.size).toBe(5)

        pack.reallocate(32)

        expect([...pack]).toEqual(content)
        expect(pack.capacity).toBe(32)
        expect(pack.size).toBe(5)

        pack.reallocate(16)

        expect([...pack]).toEqual(content)
        expect(pack.capacity).toBe(16)
        expect(pack.size).toBe(5)
      })
    }

    /**
     * 
     */
    export function itMayTruncateTheCollection<Element>(context: Context<Element>): void {
      it('may truncate the collection', function () {
        const content: Element[] = [...pick(context.values(), 10)]
        const pack: Pack<Element> = context.factory(16)

        pack.concatArray(content)

        expect([...pack]).toEqual(content)
        expect(pack.capacity).toBe(16)
        expect(pack.size).toBe(10)

        pack.reallocate(8)

        expect([...pack]).toEqual(content.slice(0, 5))
        expect(pack.capacity).toBe(8)
        expect(pack.size).toBe(5)

        pack.reallocate(2)

        expect([...pack]).toEqual(content.slice(0, 2))
        expect(pack.capacity).toBe(2)
        expect(pack.size).toBe(2)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itExpandsTheCapacity(context)
      itReduceTheCapacity(context)
      itMayTruncateTheCollection(context)
    }
  }


  /**
   * 
   */
  export namespace fit {
    /**
     * 
     */
    export function itReducesTheCollectionCapacityToItsSize<Element>(context: Context<Element>): void {
      it('reduces the collection capacity to its size', function () {
        const content: Element[] = [...pick(context.values(), 5)]
        const pack: Pack<Element> = context.factory(32)

        pack.concatArray(content)

        expect([...pack]).toEqual(content)
        expect(pack.capacity).toBe(32)
        expect(pack.size).toBe(5)

        pack.fit()

        expect([...pack]).toEqual(content)
        expect(pack.capacity).toBe(5)
        expect(pack.size).toBe(5)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itReducesTheCollectionCapacityToItsSize(context)
    }
  }

  /**
   * 
   */
  export namespace size {
    /**
     * 
     */
    export function itMayReallocateTheSequence<Element>(context: Context<Element>): void {
      it('may reallocate the pack', function () {
        const pack: Pack<Element> = context.factory(4)

        expect(pack.size).toBe(0)
        expect(pack.capacity).toBe(4)

        pack.size = 2

        expect(pack.size).toBe(2)
        expect(pack.capacity).toBe(4)

        pack.size = 8

        expect(pack.size).toBe(8)
        expect(pack.capacity).toBeGreaterThanOrEqual(8)

        pack.size = 4

        expect(pack.size).toBe(4)
        expect(pack.capacity).toBeGreaterThanOrEqual(8)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itMayReallocateTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace pop {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacity<Element>(context: Context<Element>): void {
      it('does not update the pack capacity', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        while (pack.size > 0) {
          pack.pop()
          expect(pack.capacity).toBe(16)
        }
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacity(context)
    }
  }

  /**
   * 
   */
  export namespace shift {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacity<Element>(context: Context<Element>): void {
      it('does not update the pack capacity', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        while (pack.size > 0) {
          pack.shift()

          expect(pack.capacity).toBe(16)
        }
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacity(context)
    }
  }

  /**
   * 
   */
  export namespace swap {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacity<Element>(context: Context<Element>): void {
      it('does not update the pack capacity', function () {
        const content: Element[] = [...pick(context.values(), 16)]

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.swap(3, 8)
        pack.swap(5, 5)

        expect(pack.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacity(context)
    }
  }

  /**
   * 
   */
  export namespace set {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacityWhenWeReplaceAnElement<Element>(context: Context<Element>): void {
      it('does not update the pack capacity when we replace an element', function () {
        const content: Element[] = [...pick(context.values(), 16)]

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.set(3, content[0])

        expect(pack.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function itMayReallocateTheSequence<Element>(context: Context<Element>): void {
      it('may reallocate the pack', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const pack: Pack<Element> = context.factory(16)

        expect(pack.capacity).toBe(16)

        for (let index = 0; index < 16; ++index) {
          pack.set(index * 2, content[index])
        }

        expect(pack.capacity).toBeGreaterThanOrEqual(16 * 2 + 1)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacityWhenWeReplaceAnElement(context)
      itMayReallocateTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace setMany {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacityWhenWeReplaceExistingElements<Element>(context: Context<Element>): void {
      it('does not update the pack capacity when we replace existing elements', function () {
        const content: Element[] = [...pick(context.values(), 16)]

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.setMany(3, 5, content[0])

        expect(pack.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function itMayReallocateTheSequence<Element>(context: Context<Element>): void {
      it('may reallocate the pack', function () {
        const content: Element[] = [...pick(context.values(), 16)]
        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.setMany(7, 40, content[0])

        expect(pack.capacity).toBeGreaterThanOrEqual(32)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacityWhenWeReplaceExistingElements(context)
      itMayReallocateTheSequence(context)
    }
  }

  /**
   * 
   */
  export namespace sort {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacity<Element>(context: Context<Element>): void {
      it('does not update the pack capacity', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.sort(context.comparator)

        expect(pack.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacity(context)
    }
  }

  /**
   * 
   */
  export namespace subsort {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacity<Element>(context: Context<Element>): void {
      it('does not update the pack capacity', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.subsort(5, 8, context.comparator)

        expect(pack.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacity(context)
    }
  }

  /**
   * 
   */
  export namespace insert {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull<Element>(context: Context<Element>): void {
      it('does not update the pack capacity when the pack is not full', function () {
        const content: Element[] = shuffle([...pick(context.values(), 8)])

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(8)

        pack.insert(5, content[0])

        expect(pack.capacity).toBe(8)
      })
    }

    /**
     * 
     */
    export function itMayReallocateTheCollection<Element>(context: Context<Element>): void {
      it('may reallocate the collection', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.insert(5, content[0])

        expect(pack.capacity).toBeGreaterThan(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull(context)
      itMayReallocateTheCollection(context)
    }
  }

  /**
   * 
   */
  export namespace push {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull<Element>(context: Context<Element>): void {
      it('does not update the pack capacity when the pack is not full', function () {
        const content: Element[] = shuffle([...pick(context.values(), 8)])
        const pack: Pack<Element> = context.factory(16)

        expect(pack.capacity).toBe(8)

        for (const element of content) {
          pack.push(element)
          expect(pack.capacity).toBe(8)
        }
      })
    }

    /**
     * 
     */
    export function itMayReallocateTheCollection<Element>(context: Context<Element>): void {
      it('may reallocate the collection', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])

        const pack: Pack<Element> = context.factory(8)
        pack.concatArray(content)

        expect(pack.capacity).toBe(8)

        for (let index = 0, size = content.length; index < size; ++index) {
          pack.push(content[index])

          if (index > 8) {
            expect(pack.capacity).toBeGreaterThanOrEqual(index + 1)
          }
        }
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull(context)
      itMayReallocateTheCollection(context)
    }
  }

  /**
   * 
   */
  export namespace unshift {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull<Element>(context: Context<Element>): void {
      it('does not update the pack capacity when the pack is not full', function () {
        const content: Element[] = shuffle([...pick(context.values(), 8)])
        const pack: Pack<Element> = context.factory(16)

        expect(pack.capacity).toBe(8)

        for (const element of content) {
          pack.unshift(element)
          expect(pack.capacity).toBe(8)
        }
      })
    }

    /**
     * 
     */
    export function itMayReallocateTheCollection<Element>(context: Context<Element>): void {
      it('may reallocate the collection', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])

        const pack: Pack<Element> = context.factory(8)
        pack.concatArray(content)

        expect(pack.capacity).toBe(8)

        for (let index = 0, size = content.length; index < size; ++index) {
          pack.unshift(content[index])

          if (index > 8) {
            expect(pack.capacity).toBeGreaterThanOrEqual(index + 1)
          }
        }
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull(context)
      itMayReallocateTheCollection(context)
    }
  }

  /**
   * 
   */
  export namespace remove {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacity<Element>(context: Context<Element>): void {
      it('does not update the pack capacity', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.delete(5)

        expect(pack.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacity(context)
    }
  }

  /**
   * 
   */
  export namespace deleteMany {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacity<Element>(context: Context<Element>): void {
      it('does not update the pack capacity', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.deleteMany(5, 8)

        expect(pack.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacity(context)
    }
  }

  /**
   * 
   */
  export namespace warp {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacity<Element>(context: Context<Element>): void {
      it('does not update the pack capacity', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.warp(5)

        expect(pack.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacity(context)
    }
  }

  /**
   * 
   */
  export namespace warpMany {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacity<Element>(context: Context<Element>): void {
      it('does not update the pack capacity', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.warpMany(5, 8)

        expect(pack.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacity(context)
    }
  }

  /**
   * 
   */
  export namespace fill {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacity<Element>(context: Context<Element>): void {
      it('does not update the pack capacity', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.fill(content[3])

        expect(pack.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacity(context)
    }
  }

  /**
   * 
   */
  export namespace concat {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull<Element>(context: Context<Element>): void {
      it('does not update the pack capacity when the pack is not full', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])
        const head: Pack<Element> = context.factory(16)
        const tail: Pack<Element> = context.factory(16)

        head.concatArray(content.slice(0, 8))
        tail.concatArray(content.slice(8, 16))

        expect(head.capacity).toBe(16)
        expect(tail.capacity).toBe(16)

        head.concat(tail)

        expect(head.capacity).toBe(16)
        expect(tail.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function itMayReallocateTheCollection<Element>(context: Context<Element>): void {
      it('may reallocate the collection', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])
        const head: Pack<Element> = context.factory(16)
        const tail: Pack<Element> = context.factory(16)

        head.concatArray(content.slice(0, 8))
        tail.concatArray(content)

        expect(head.capacity).toBe(16)
        expect(tail.capacity).toBe(16)

        head.concat(tail)

        expect(head.capacity).toBeGreaterThanOrEqual(24)
        expect(tail.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull(context)
      itMayReallocateTheCollection(context)
    }
  }

  /**
   * 
   */
  export namespace concatArray {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull<Element>(context: Context<Element>): void {
      it('does not update the pack capacity when the pack is not full', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])
        const head: Pack<Element> = context.factory(16)

        expect(head.capacity).toBe(16)

        head.concatArray(content)

        expect(head.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function itMayReallocateTheCollection<Element>(context: Context<Element>): void {
      it('may reallocate the collection', function () {
        const content: Element[] = shuffle([...pick(context.values(), 32)])
        const head: Pack<Element> = context.factory(16)

        expect(head.capacity).toBe(16)

        head.concatArray(content)

        expect(head.capacity).toBeGreaterThanOrEqual(32)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull(context)
      itMayReallocateTheCollection(context)
    }
  }

  /**
   * 
   */
  export namespace copy {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull<Element>(context: Context<Element>): void {
      it('does not update the pack capacity when the pack is not full', function () {
        const content: Element[] = shuffle([...pick(context.values(), 8)])
        const origin: Pack<Element> = context.factory(8)
        const copy: Pack<Element> = context.factory(16)

        origin.concatArray(content)

        expect(origin.capacity).toBe(8)
        expect(copy.capacity).toBe(16)

        copy.copy(origin)

        expect(origin.capacity).toBe(8)
        expect(copy.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function itMayReallocateTheCollection<Element>(context: Context<Element>): void {
      it('may reallocate the collection', function () {
        const content: Element[] = shuffle([...pick(context.values(), 32)])
        const origin: Pack<Element> = context.factory(32)
        const copy: Pack<Element> = context.factory(16)

        origin.concatArray(content)

        expect(origin.capacity).toBe(32)
        expect(copy.capacity).toBe(16)

        copy.copy(origin)

        expect(origin.capacity).toBe(32)
        expect(copy.capacity).toBe(32)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacityWhenTheSequenceIsNotFull(context)
      itMayReallocateTheCollection(context)
    }
  }

  /**
   * 
   */
  export namespace clear {
    /**
     * 
     */
    export function itDoesNotUpdateTheSequenceCapacity<Element>(context: Context<Element>): void {
      it('does not update the pack capacity', function () {
        const content: Element[] = shuffle([...pick(context.values(), 16)])

        const pack: Pack<Element> = context.factory(16)
        pack.concatArray(content)

        expect(pack.capacity).toBe(16)

        pack.clear()

        expect(pack.capacity).toBe(16)
      })
    }

    /**
     * 
     */
    export function defaultBehavior<Element>(context: Context<Element>): void {
      itDoesNotUpdateTheSequenceCapacity(context)
    }
  }


  /**
   * 
   */
  export function defaultBehavior<Element>(context: Context<Element>): void {
    describe('it is a pack', function () {
      describe('#reallocate', reallocate.defaultBehavior.bind(undefined, context))
      describe('#fit', fit.defaultBehavior.bind(undefined, context))
      describe('#size', size.defaultBehavior.bind(undefined, context))
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

    ListSpecification.defaultBehavior(context)
  }

  /**
   * 
   */
  export type Context<Element> = {
    factory: Pack.Factory<Element>,
    values: VirtualGenerator<Element>,
    comparator: Comparator<Element, Element>
  }
}