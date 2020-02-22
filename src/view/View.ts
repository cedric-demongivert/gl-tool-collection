import { Collection } from '../Collection'
import { CollectionIterator } from '../iterator/CollectionIterator'

/**
* A readonly view over a given collection of values.
*/
export class View<Element> implements Collection<Element> {
  private _collection : Collection<Element>

  /**
  * Create a new view over an existing collection.
  *
  * @param collection - A collection to wrap.
  */
  public constructor (collection : Collection<Element>) {
    this._collection = collection
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._collection.size
  }

  /**
  * @see Collection.has
  */
  public has (element : Element) : boolean {
    return this._collection.has(element)
  }

  /**
  * @see Collection.iterator
  */
  public iterator () : CollectionIterator<Element> {
    return this._collection.iterator()
  }

  /**
  * @see Collection.clone
  */
  public clone () : View<Element> {
    return new View<Element>(this._collection)
  }

  /**
  * @see Collection.view
  */
  public view () : View<Element> {
    return this
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof View) {
      return this._collection.equals(other._collection)
    }

    return false
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () {
    yield * this._collection
  }
}

export namespace View {
  /**
  * Wrap an existing collection.
  *
  * @param collection - A collection to wrap in a view.
  *
  * @return A view over the given collection.
  */
  export function wrap <Element> (collection : Collection<Element>) : View<Element> {
    if (collection instanceof View) {
      return collection
    } else {
      return new View<Element>(collection)
    }
  }
}
