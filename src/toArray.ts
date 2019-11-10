import { Collection } from './Collection'

/**
* Transform any collection of elements into an array of elements.
*
* @param collection - A collection to transform into an array.
* @param [offset = 0] - Number of elements to skip from the begining of the collection.
* @param [maximumLength = Number.POSITIVE_INFINITY] - Maximum number of elements to put into the resulting array.
*
* @return An array with the elements of the collection as requested.
*/
export function toArray <T> (
  collection : Collection<T>,
  offset : number = 0,
  maximumLength : number = Number.POSITIVE_INFINITY,
) : T[] {
  const result : T[] = []
  const length : number = Math.min(maximumLength, collection.size)

  if (length === Number.POSITIVE_INFINITY) {
    throw new Error(
      "Trying to transform an infinite collection into an array without " +
      "a maximum length."
    )
  }

  for (const value of collection) {
    if (offset > 0) {
      offset -= 1
    } else if (result.length < length) {
      result.push(value)
    } else {
      break
    }
  }

  return result
}
