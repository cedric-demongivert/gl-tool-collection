import { Collection } from '../../src/Collection'

export function createCollection <T> () : Collection<T> {
  const result : any = {
    /**
    * @see Collection.has
    */
    has: jest.fn(),

    /**
    * @see Collection.clone
    */
    clone: jest.fn(),

    /**
    * @see Collection.iterator
    */
    iterator: jest.fn(),

    /**
    * @see Collection.equals
    */
    equals: jest.fn()
  }

  Object.defineProperty(result, 'size', { get: jest.fn() })

  return result
}

function size <T> (collection : Collection<T>) : any {
  return Object.getOwnPropertyDescriptor(collection, 'size').get
}

createCollection.size = size
