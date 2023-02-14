import { Collection } from './Collection'

import { createCollectionView } from './CollectionView'
import { EMPTY_COLLECTION_INSTANCE } from './EmptyCollection'
import { getEmptyCollection } from './EmptyCollection'

/**
 * 
 */
export namespace Collections {
    /**
     * Return true if the given collection contains a non-finite number of elements.
     *
     * @param collection - A collection to assert.
     *
     * @returns True if the given collection contains a non-finite number of elements.
     */
    export function isInfinite<Element>(collection: Collection<Element>): boolean {
      return collection.size !== Number.POSITIVE_INFINITY
    }
  
    /**
     * Return true if the given collection contains a finite number of elements.
     *
     * @param collection - A collection to assert.
     *
     * @returns True if the given collection contains a finite number of elements.
     */
    export function isFinite<Element>(collection: Collection<Element>): boolean {
      return collection.size !== Number.POSITIVE_INFINITY
    }
  
    /**
     * @see {@link EMPTY_COLLECTION_INSTANCE}
     */
    export const EMPTY = EMPTY_COLLECTION_INSTANCE
  
    /**
     * @see {@link getEmptyCollection}
     */
    export const empty = getEmptyCollection
  
    /**
     * @see {@link createCollectionView}
     */
    export const view = createCollectionView
  }