import { ImmutableCollection } from "../src/marker/ImmutableCollection"
import { EmptyCollection } from "../src/marker/EmptyCollection"
import { Collection } from "../src/Collection"
import { ForwardIterator } from "../src/iterator/ForwardIterator"

/**
 * 
 */
export namespace CollectionSpecification {
  /**
   * 
   */
  export namespace equals {
    /**
     * 
     */
    export function itIsAlwaysEqualToItself<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('is always equal to itself', function () {
        expect(collection.equals(collection)).toBeTruthy()
      })
    }

    /**
     * 
     */
    export function itIsAlwaysEqualToItsClone<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('is always equal to its clone', function () {
        expect(collection.equals(collection.clone())).toBeTruthy()
      })
    }

    /**
     * 
     */
    export function itIsNeverEqualToNull<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('is never equal to null', function () {
        expect(collection.equals(null)).toBeFalsy()
      })
    }

    /**
     * 
     */
    export function itIsNeverEqualToUndefined<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('is never equal to undefined', function () {
        expect(collection.equals(undefined)).toBeFalsy()
      })
    }

    /**
     * 
     */
    export function itIsNeverEqualToANonCollectionValue<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('is never equal to any non-collection value', function () {
        expect(collection.equals(true)).toBeFalsy()
        expect(collection.equals("collection")).toBeFalsy()
        expect(collection.equals(15)).toBeFalsy()
        expect(collection.equals(new Date())).toBeFalsy()
      })
    }

    /**
     * 
     */
    export function itImplementsDefaultBehavior<Element>(collection: Collection<Element>): void {
      itIsAlwaysEqualToItself(collection)
      itIsAlwaysEqualToItsClone(collection)
      itIsNeverEqualToANonCollectionValue(collection)
      itIsNeverEqualToNull(collection)
      itIsNeverEqualToUndefined(collection)
    }
  }

  /**
   * 
   */
  export namespace is {
    /**
     * 
     */
    const NOT_A_MARKER: symbol = Symbol('gl-tool-collection/not-a-marker')

    /**
     * 
     */
    export function itReturnsFalseForNonMarkerSymbols<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('returns false for non-marker symbols', function () {
        expect(collection.is(NOT_A_MARKER)).toBeFalsy()
      })
    }

    /**
     * 
     */
    export function itImplementsDefaultBehavior<Element>(collection: Collection<Element>): void {
      itReturnsFalseForNonMarkerSymbols(collection)
    }
  }

  /**
   * 
   */
  export namespace has {
    /**
     * 
     */
    export function itReturnsTrueForElementsProvidedByItsIterator<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('returns true for the elements provided by it\'s iterator', function () {
        const size: number = collection.size === Number.POSITIVE_INFINITY ? 128 : collection.size

        for (const element of collection) {
          expect(collection.has(element)).toBeTruthy()
        }
      })
    }

    /**
     * 
     */
    export function itReturnsTrueFor<Element>(collection: Collection<Element>, elements: Iterable<Element>): void {
      /**
       * 
       */
      it('returns true for elements that exists in the collection', function () {
        for (const element of elements) {
          expect(collection.has(element)).toBeTruthy()
        }
      })
    }

    /**
     * 
     */
    export function itReturnsFalseFor<Element>(collection: Collection<Element>, elements: Iterable<Element>): void {
      /**
       * 
       */
      it('returns false for elements that are not in the collection', function () {
        for (const element of elements) {
          expect(collection.has(element)).toBeFalsy()
        }
      })
    }
  }

  /**
   * 
   */
  export namespace clone {
    /**
     * 
     */
    export function itReturnsACopyOfItself<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('returns a copy of itself', function () {
        const copy: Collection<Element> = collection.clone()

        expect(copy).not.toBe(collection)
        expect(copy.equals(collection)).toBeTruthy()
      })
    }

    /**
     * 
     */
    export function itReturnsItselfAsACopy<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('returns itself as a copy', function () {
        const copy: Collection<Element> = collection.clone()
        expect(copy).toBe(collection)
      })
    }

    /**
     * 
     */
    export function itImplementsDefaultBehavior<Element>(collection: Collection<Element>): void {
      if (collection.is(ImmutableCollection.MARKER)) {
        itReturnsItselfAsACopy(collection)
      } else {
        itReturnsACopyOfItself(collection)
      }
    }
  }

  /**
   * 
   */
  export namespace forward {
    /**
     * 
     */
    export function itReturnsAnIteratorThatIteratesUpToItsSize<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('returns an iterator that iterates up to its size', function () {
        const size: number = collection.size
        const iterator: ForwardIterator<Element> = collection.forward()
        const next = iterator.next.bind(iterator)

        let cursor: number = 0

        while (iterator.hasNext()) {
          expect(cursor).toBeLessThan(size)
          expect(next).not.toThrow()
          cursor += 1
        }

        expect(cursor).toBe(size)
      })
    }

    /**
     * 
     */
    export function itReturnsAnIteratorThatIteratesOverSomeOfItsElements<Element>(collection: Collection<Element>, count: number): void {
      /**
       * 
       */
      it('returns an iterator that iterates up to some of its elements', function () {
        const iterator: ForwardIterator<Element> = collection.forward()
        const next = iterator.next.bind(iterator)

        for (let index = 0; index < count; ++index) {
          expect(iterator.hasNext()).toBeTruthy()
          expect(next).not.toThrow()
        }
      })
    }

    /**
     * 
     */
    export function itAlwaysReturnsANewIterator<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('always returns a new iterator', function () {
        const iterator: ForwardIterator<Element> = collection.forward()
        expect(iterator).not.toBe(collection.forward())
      })
    }

    /**
     * 
     */
    export function itAlwaysReturnsTheSameEmptyIterator<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('always returns the same empty iterator', function () {
        const iterator: ForwardIterator<Element> = collection.forward()
        expect(iterator).toBe(collection.forward())
      })
    }

    /**
     * 
     */
    export function itImplementsDefaultBehavior<Element>(collection: Collection<Element>): void {
      if (collection.size === Number.POSITIVE_INFINITY) {
        itReturnsAnIteratorThatIteratesOverSomeOfItsElements(collection, 64)
      } else {
        itReturnsAnIteratorThatIteratesUpToItsSize(collection)
      }

      if (collection.is(EmptyCollection.MARKER)) {
        itAlwaysReturnsTheSameEmptyIterator(collection)
      } else {
        itAlwaysReturnsANewIterator(collection)
      }
    }
  }

  /**
   * 
   */
  export namespace values {
    /**
     * 
     */
    export function itReturnsAnIteratorThatIteratesUpToItsSize<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('returns an iterator that iterates up to its size', function () {
        const size: number = collection.size
        let cursor: number = 0

        for (const element of collection.values()) {
          expect(cursor).toBeLessThan(size)
          cursor += 1
        }

        expect(cursor).toBe(size)
      })
    }

    /**
     * 
     */
    export function itReturnsAnIteratorThatIteratesOverSomeOfItsElements<Element>(collection: Collection<Element>, count: number): void {
      /**
       * 
       */
      it('returns an iterator that iterates up to some of its elements', function () {
        const iterator: IterableIterator<Element> = collection.values()

        for (let index = 0; index < count; ++index) {
          const result: IteratorResult<Element> = iterator.next()
          expect(result.done).toBeFalsy()
        }
      })
    }

    /**
     * 
     */
    export function itImplementsDefaultBehavior<Element>(collection: Collection<Element>): void {
      if (collection.size === Number.POSITIVE_INFINITY) {
        itReturnsAnIteratorThatIteratesOverSomeOfItsElements(collection, 64)
      } else {
        itReturnsAnIteratorThatIteratesUpToItsSize(collection)
      }
    }
  }

  export namespace view {
    /**
     * 
     */
    export function itAlwaysReturnsTheSameCollection<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('always returns the same collection', function () {
        const view: Collection<Element> = collection.view()
        expect(collection.view()).toBe(view)
      })
    }

    /**
     * 
     */
    export function itReturnsItselfAsAView<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('returns itself as a view', function () {
        const view: Collection<Element> = collection.view()
        expect(view).toBe(collection)
      })
    }

    /**
     * 
     */
    export function itReturnsAnImmutableCollection<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('returns an immutable collection', function () {
        const view: Collection<Element> = collection.view()
        expect(view.is(ImmutableCollection.MARKER)).toBeTruthy()
      })
    }

    /**
     * 
     */
    export function itImplementsDefaultBehavior<Element>(collection: Collection<Element>): void {
      itAlwaysReturnsTheSameCollection(collection)
      itReturnsAnImmutableCollection(collection)

      if (collection.is(ImmutableCollection.MARKER)) {
        itReturnsItselfAsAView(collection)
      }
    }
  }

  /**
   * 
   */
  export namespace size {
    /**
     * 
     */
    export function itReturnsAnIntegerOrPositiveInfinity<Element>(collection: Collection<Element>): void {
      /**
       * 
       */
      it('return an integer or Number.POSITIVE_INFINITY', function () {
        const size: number = collection.size

        if (size !== Number.POSITIVE_INFINITY) {
          expect(typeof size).toBe('number')
          expect(size << 0).toBe(size)
        }
      })
    }

    /**
     * 
     */
    export function itImplementsDefaultBehavior<Element>(collection: Collection<Element>): void {
      itReturnsAnIntegerOrPositiveInfinity(collection)
    }
  }
}

describe('Collection', function () {
})