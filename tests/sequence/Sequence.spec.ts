import { Sequence } from "../../src/sequence/Sequence"

import { CollectionSpecification } from "../Collection.spec"

/**
 * 
 */
export namespace SequenceSpecification {
  /**
   * 
   */
  export namespace get {
    /**
     * 
     */
    export function itMatchTheSequence<Element>(collection: Sequence<Element>, sequence: Iterable<Element>): void {
      /**
       * 
       */
      it('returns the elements of the sequence', function () {
        let index: number = 0

        for (const element of sequence) {
          expect(collection.get(index)).toBe(element)
        }
      })
    }

    /**
     * 
     */
    export function itReturnsTheElementsReturnedByItsIterator<Element>(collection: Sequence<Element>): void {
      /**
       * 
       */
      it('returns the elements returned by its iterator', function () {
        let index: number = 0

        for (const element of collection) {
          expect(collection.get(index)).toBe(element)
        }
      })
    }
  }

  /**
   * 
   */
  export namespace is {
    /**
     * 
     */
    export function itReturnsTrueForTheSequenceMarkerSymbol<Element>(collection: Sequence<Element>): void {
      /**
       * 
       */
      it('returns true for Sequence.MARKER', function () {
        expect(collection.is(Sequence.MARKER)).toBeTruthy()
      })
    }

    /**
     * 
     */
    export function itImplementsDefaultBehavior<Element>(collection: Sequence<Element>): void {
      itReturnsTrueForTheSequenceMarkerSymbol(collection)
      CollectionSpecification.is.itImplementsDefaultBehavior(collection)
    }
  }
}