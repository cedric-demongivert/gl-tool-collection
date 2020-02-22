import { CollectionIterator } from './iterator/CollectionIterator'
import { Size } from './Size'

/**
* A collection of element.
*/
export interface Collection<Element> extends Iterable<Element> {
  /**
  * Return the number of element in this collection.
  *
  * A collection may contains a non-finite number of element and for such cases
  * this property MUST return Size.INFINITY. For collections that contains a
  * finite number of element this property MUST return a non-negative integer
  * equal to the number of elements that it contains.
  *
  * @return The number of elements stored into this collection.
  */
  readonly size : Size

  /**
  * Return true if the given element is in this collection.
  *
  * @param element - An element to search.
  *
  * @return True if the given element is in this collection.
  */
  has (element : Element) : boolean

  /**
  * Return true if this collection is equal to the given instance.
  *
  * - A collection is never equal to any non-collection value.
  * - Two equal collection contains equal elements.
  * - Two equal collection follows equal constaints.
  *
  * @param other - Instance to compare to this one.
  *
  * @return True if both instance are equals.
  */
  equals (other : any) : boolean

  /**
  * Return a shallow-copy of this collection.
  *
  * A shallow-copy *b* of a collection *a* is an instance that follow both
  * properties :
  *  - b !== a
  *  - b.equals(a)
  *
  * @return A shallow copy of this collection.
  */
  clone () : Collection<Element>

  /**
  * @return A readonly instance of this collection.
  */
  view () : Collection<Element>

  /**
  * @return An iterator over this collection.
  */
  iterator () : CollectionIterator<Element>
}

export namespace Collection {
  /**
  * Return true if the given collection contains a non-finite number of element.
  *
  * @param collection - A collection to assert.
  *
  * @return True if the given collection contains a non-finite number of element.
  */
  export function isInfinite <Element> (
    collection : Collection<Element>
  ) : boolean {
    return collection.size !== Size.INFINITY
  }

  /**
  * Return true if the given collection contains a finite number of element.
  *
  * @param collection - A collection to assert.
  *
  * @return True if the given collection contains a finite number of element.
  */
  export function isFinite <Element> (
    collection : Collection<Element>
  ) : boolean {
    return collection.size !== Size.INFINITY
  }

  /**
  * Return a shallow copy of the given collection.
  *
  * A shallow-copy *b* of a collection *a* is an instance that follow both
  * properties :
  *  - b !== a
  *  - b.equals(a)
  *
  * @param toCopy - A collection to copy.
  *
  * @return A shallow copy of the given collection.
  */
  export function copy <Element> (
    toCopy : Collection<Element>
  ) : Collection<Element> {
    return toCopy.clone()
  }
}
