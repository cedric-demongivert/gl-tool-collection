import { mock } from 'jest-mock-extended'

import { Collection } from "../sources/Collection"
import { ForwardCursor } from '../sources/cursor'

import { CollectionView } from "../sources/CollectionView"
import { isCollectionView } from "../sources/CollectionView"
import { createCollectionView } from "../sources/CollectionView"

/**
 * 
 */
describe('CollectionView', function () {
  /**
   * 
   */
  describe('#constructor', function () {
    /**
     * 
     */
    it('creates a view over the requested collection', function () {
      const collection = mock<Collection<number>>()
      const view = new CollectionView(collection)
  
      expect(view.hasCollection(collection)).toBeTruthy()
    })
  })

  /**
   * 
   */
  describe('#has', function () {
    /**
     * 
     */
    it('delegates the computation to the underlying implementation', function () {
      const collection = mock<Collection<number>>()
      const view = new CollectionView(collection)
  
      collection.has.mockReturnValue(true)
  
      expect(collection.has).not.toHaveBeenCalled()
      expect(view.has(15)).toBeTruthy()
      expect(collection.has).toHaveBeenCalledTimes(1)
      expect(collection.has).toHaveBeenCalledWith(15)
    })
  })

  /**
   * 
   */
  describe('#forward', function () {
    /**
     * 
     */
    it('delegates the computation to the underlying implementation', function () {
      const collection = mock<Collection<number>>()
      const cursor = mock<ForwardCursor<number>>()
      const view = new CollectionView(collection)

      collection.forward.mockReturnValue(cursor)

      expect(collection.forward).not.toHaveBeenCalled()
      expect(view.forward()).toBe(cursor)
      expect(collection.forward).toHaveBeenCalledTimes(1)
    })
  })

  /**
   * 
   */
  describe('#view', function () {
    /**
     * 
     */
    it('returns itself', function () {
      const collection = mock<Collection<number>>()
      const view = new CollectionView(collection)
  
      expect(view.view()).toBe(view)
    })
  })

  /**
   * 
   */
  describe('#clone', function () {
    /**
     * 
     */
    it('returns a copy of the view', function () {
      const collection = mock<Collection<number>>()
      const view = new CollectionView(collection)
      const copy = view.clone()
  
      expect(copy.equals(view)).toBeTruthy()
      expect(copy === view).toBeFalsy()
    })
  })

  /**
   * 
   */
  describe('#values', function () {
     /**
     * 
     */
     it('delegates the computation to the underlying implementation', function () {
      const collection = mock<Collection<number>>()
      const iterableIterator = mock<IterableIterator<number>>()
      const view = new CollectionView(collection)

      collection.values.mockReturnValue(iterableIterator)

      expect(collection.values).not.toHaveBeenCalled()
      expect(view.values()).toBe(iterableIterator)
      expect(collection.values).toHaveBeenCalledTimes(1)
    })
  })

  /**
   * 
   */
  describe('#[Symbol.iterator]', function () {
     /**
     * 
     */
     it('delegates the computation to the underlying implementation', function () {
      const collection = mock<Collection<number>>()
      const iterableIterator = mock<IterableIterator<number>>()
      const view = new CollectionView(collection)

      collection.values.mockReturnValue(iterableIterator)

      expect(collection.values).not.toHaveBeenCalled()
      expect(view[Symbol.iterator]()).toBe(iterableIterator)
      expect(collection.values).toHaveBeenCalledTimes(1)
    })
  })

  /**
   * 
   */
  describe('#hasCollection', function () {
     /**
     * 
     */
     it('returns true if the given collection is the underlying collection', function () {
      const firstCollection = mock<Collection<number>>()
      const secondCollection = mock<Collection<number>>()
      const firstView = new CollectionView(firstCollection)
      const secondView = new CollectionView(secondCollection)

      expect(firstView.hasCollection(firstCollection)).toBeTruthy()
      expect(firstView.hasCollection(secondCollection)).toBeFalsy()

      expect(secondView.hasCollection(firstCollection)).toBeFalsy()
      expect(secondView.hasCollection(secondCollection)).toBeTruthy()
    })
  })

  /**
   * 
   */
  describe('#setCollection', function () {
     /**
     * 
     */
     it('updates the underlying collection', function () {
      const firstCollection = mock<Collection<number>>()
      const secondCollection = mock<Collection<number>>()
      const view = new CollectionView(firstCollection)

      expect(view.hasCollection(firstCollection)).toBeTruthy()
      expect(view.hasCollection(secondCollection)).toBeFalsy()

      view.setCollection(secondCollection)

      expect(view.hasCollection(firstCollection)).toBeFalsy()
      expect(view.hasCollection(secondCollection)).toBeTruthy()
    })
  })

  /**
   * 
   */
  describe('#equals', function () {
      /**
       * 
       */
      it('returns true if the given instance is a view over the same underlying collection', function () {
        const collection = mock<Collection<number>>()
        const view = new CollectionView(collection)

        expect(view.equals(new CollectionView(collection))).toBeTruthy()
      })
      
      /**
       * 
       */
      it('returns true when applied on itself', function () {
        const collection = mock<Collection<number>>()
        const view = new CollectionView(collection)

        expect(view.equals(view)).toBeTruthy()
      })
      
      /**
       * 
       */
      it('returns false for null', function () {
        const collection = mock<Collection<number>>()
        const view = new CollectionView(collection)
      
        expect(view.equals(null)).toBeFalsy()
      })
      
      /**
       * 
       */
      it('returns false for undefined', function () {
        const collection = mock<Collection<number>>()
        const view = new CollectionView(collection)
          
        expect(view.equals(undefined)).toBeFalsy()
      })
      
      /**
       * 
       */
      it('returns false for instances of other type', function () {
        const collection = mock<Collection<number>>()
        const view = new CollectionView(collection)
          
        expect(view.equals(new Date())).toBeFalsy()
        expect(view.equals(15)).toBeFalsy()
        expect(view.equals("test")).toBeFalsy()
      })
      
      /**
       * 
       */
      it('returns false for a view of another collection', function () {
        const firstCollection = mock<Collection<number>>()
        const secondCollection = mock<Collection<number>>()
        const view = new CollectionView(firstCollection)
          
        expect(view.equals(new CollectionView(secondCollection))).toBeFalsy()
      })
  })
})

/**
 * 
 */
describe('isCollectionView', function () {
  /**
   * 
   */
  it('returns true if the given value is a direct instance of CollectionView', function () {
      class Indirect extends CollectionView<any> {}
      
      const cursor = mock<Collection<number>>()

      expect(isCollectionView(new CollectionView(cursor))).toBeTruthy()
      expect(isCollectionView(new Indirect(cursor))).toBeFalsy()
  })
})

/**
 * 
 */
describe('createCollectionView', function () {
  /**
   * 
   */
  it('creates a view over the requested collection', function () {
    const collection = mock<Collection<number>>()
    const view = createCollectionView(collection)

    expect(view.hasCollection(collection)).toBeTruthy()
  })
})