import { Collection } from './Collection'
import { Comparator } from './Comparator'

function defaultComparator (left : any, right : any) : number {
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
export function bissect<Item, Search> (
  collection : Collection<Item>,
  value : Search,
  comparator : Comparator<Search, Item> = defaultComparator,
  offset : number = 0,
  size : number = collection.size,
) {
  if (size > 0) {
    let left = offset
    let right = offset + size

    while (left !== right) {
      const cursor = left + ((right - left) >>> 1)
      const comparison = comparator(value, collection.get(cursor))

      if (comparison === 0) {
        return cursor
      } else if (comparison > 0) {
        left = cursor + 1
      } else {
        right = cursor
      }
    }

    return - (left + 1)
  } else {
    return -1
  }
}

bissect.first = function <Item, Search> (
  collection : Collection<Item>,
  value : Search,
  comparator : Comparator<Search, Item> = defaultComparator,
  offset : number = 0,
  size : number = collection.size
) {
  let result : number = bissect(collection, value, comparator, offset, size)

  if (result < 0) return result

  while (result > 0 && comparator(value, collection.get(result - 1)) === 0) {
    result -= 1
  }

  return result
}

bissect.last = function <Item, Search> (
  collection : Collection<Item>,
  value : Search,
  comparator : Comparator<Search, Item> = defaultComparator,
  offset : number = 0,
  size : number = collection.size
) {
  let result : number = bissect(collection, value, comparator, offset, size)

  if (result < 0) return result

  const end : number = collection.size - 1

  while (result < end && comparator(value, collection.get(result + 1)) === 0) {
    result += 1
  }

  return result
}

bissect.invert = function <Item, Search> (
  collection : Collection<Item>,
  value : Search,
  comparator : Comparator<Search, Item> = defaultComparator,
  offset : number = 0,
  size : number = collection.size,
) {
  if (size > 0) {
    let left = offset
    let right = offset + size

    while (left !== right) {
      const cursor = left + ((right - left) >>> 1)
      const comparison = -comparator(value, collection.get(cursor))

      if (comparison === 0) {
        return cursor
      } else if (comparison > 0) {
        left = cursor + 1
      } else {
        right = cursor
      }
    }

    return - (left + 1)
  } else {
    return -1
  }
}
