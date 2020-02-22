import { Sequence } from '@library/Sequence'
import { View } from '@library/view/View'

/**
* A readonly view over a given sequence of values.
*/
export class SequenceView<Element> extends View<Element> implements Sequence<Element> {
  private _sequence : Sequence<Element>

  /**
  * Create a new view over an existing collection.
  *
  * @param collection - A collection to wrap.
  */
  public constructor (collection : Sequence<Element>) {
    super(collection)
    this._sequence = collection
  }

  /**
  * @see Sequence.get
  */
  public get (index : number) : Element {
    return this._sequence.get(index)
  }

  /**
  * @see Sequence.firstIndex
  */
  public get firstIndex () : number {
    return this._sequence.firstIndex
  }

  /**
  * @see Sequence.first
  */
  public get first () : Element {
    return this._sequence.first
  }

  /**
  * @see Sequence.lastIndex
  */
  public get lastIndex () : number {
    return this._sequence.lastIndex
  }

  /**
  * @see Sequence.last
  */
  public get last () : Element {
    return this._sequence.last
  }

  /**
  * @see Collection.clone
  */
  public clone () : SequenceView<Element> {
    return SequenceView.wrap(this._sequence)
  }

  /**
  * @see Sequence.indexOf
  */
  public indexOf (element : Element) : number {
    return this._sequence.indexOf(element)
  }

  /**
  * @see Sequence.iterator
  */
  public * [Symbol.iterator] () {
    yield * this._sequence
  }
}

export namespace SequenceView {
  /**
  * Wrap an existing collection.
  *
  * @param collection - A collection to wrap in a view.
  *
  * @return A view over the given collection.
  */
  export function wrap <Element> (collection : Sequence<Element>) : SequenceView<Element> {
    if (collection instanceof SequenceView) {
      return collection
    } else {
      return new SequenceView<Element>(collection)
    }
  }
}
