import { Collection } from './Collection'

type Comparator<T> = (left : T, right : T) => number

function defaultComparator <T> (left : T, right : T) : number {
  return left < right ? -1 : (left > right ? 1 : 0)
}

/**
* Binary search a given element into an ordered collection and then returns its
* index.
*
* If the given element does not exists into the given collection this method
* will return its insertion index in the form of the negative number :
* (-insertionIndex -1)
*
* @param collection - A collection to search.
* @param value - A value to search.
* @param [comparator = defaultComparator] - A comparison function to use.
*/
export function bissect<T> (
  collection : Collection<T>,
  value : T,
  comparator : Comparator<T> = defaultComparator
) {
  let left = 0
  let right = collection.size

  while (left !== right) {
    const cursor = left + ((right - left) >>> 1)
    const comparison = comparator(value, collection.get(cursor))
  
    if (comparison === 0) {
      return cursor
    } else if (comparison === 1) {
      left = cursor + 1
    } else {
      right = cursor
    }
  }

  return - (left + 1)
}
