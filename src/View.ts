import { Collection } from './Collection'
import { Iterator } from './iterator'

/**
* A readonly view over a given collection of values.
*/
export class View<Element> implements Collection<Element> {
  /**
  * Wrap an existing collection.
  *
  * @param collection - A collection to wrap in a view.
  *
  * @return A view over the given collection.
  */
  public static wrap <Element> (
    collection : Collection<Element>
  ) : View<Element> {
    if (collection instanceof View) {
      return collection
    } else {
      return new View<Element>(collection)
    }
  }

  _collection : Collection<Element>

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
  * @see Collection.isRandomlyAccessible
  */
  public get isRandomlyAccessible () : boolean {
    return this._collection.isRandomlyAccessible
  }

  /**
  * @see Collection.isSequentiallyAccessible
  */
  public get isSequentiallyAccessible () : boolean {
    return this._collection.isSequentiallyAccessible
  }

  /**
  * @see Collection.isSet
  */
  public get isSet () : boolean {
    return this._collection.isSet
  }

  /**
  * @see Collection.isStatic
  */
  public get isStatic () : boolean {
    return this._collection.isStatic
  }

  /**
  * @see Collection.isReallocable
  */
  public get isReallocable () : boolean {
    return this._collection.isReallocable
  }

  /**
  * @see Collection.isSequence
  */
  public get isSequence () : boolean {
    return this._collection.isSequence
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : Element {
    return this._collection.get(index)
  }

  /**
  * @see Collection.has
  */
  public has (element : Element) : boolean {
    return this._collection.has(element)
  }

  /**
  * @see Collection.first
  */
  public first () : Element {
    return this._collection.first()
  }

  /**
  * @see Collection.last
  */
  public last () : Element {
    return this._collection.last()
  }

  /**
  * @see Collection.iterator
  */
  public iterator () : Iterator<Element> {
    return this._collection.iterator()
  }

  /**
  * @see Collection.indexOf
  */
  public indexOf (element : Element) : number {
    return this._collection.indexOf(element)
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    return this._collection.equals(other)
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () {
    yield * this._collection
  }
}
