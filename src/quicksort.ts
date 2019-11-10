import { Comparator } from './Comparator'

export function quicksort<Element> (
  collection : any,
  comparator : Comparator<Element, Element>,
  offset : number,
  size : number
) { rquicksort(collection, comparator, offset, offset + size - 1) }

function rquicksort<Element> (
  collection : any,
  comparator : Comparator<Element, Element>,
  left : number,
  right : number
) {
  if (left < right) {
    const pivot : number = partition(collection, comparator, left, right)
    rquicksort(collection, comparator, left, pivot)
    rquicksort(collection, comparator, pivot + 1, right)
  }
}

function partition<Element> (
  collection : any,
  comparator : Comparator<Element, Element>,
  left : number, right : number
) : number {
  const pivot : Element = collection.get((left + right) >>> 1)
  let lower : number = left
  let upper : number = right

  do {
    while (comparator(collection.get(lower), pivot) < 0) {
      lower += 1
    }
    while (comparator(collection.get(upper), pivot) > 0) {
      upper -= 1
    }
    if (lower >= upper) {
      return upper
    }
    collection.swap(lower, upper)
  } while (true)
}
