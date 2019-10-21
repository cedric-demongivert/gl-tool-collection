import { Pack } from './Pack'
import { equals } from '../equals'

type TypedArrayConstructor = new (capacity : number) => any

export class TypedArrayPack implements Pack<number> {
  static DEFAULT_VALUE : number = 0

  /**
  * Return a copy of another pack.
  *
  * @param toCopy - A pack to copy.
  */
  static copy (toCopy : TypedArrayPack) : TypedArrayPack {
    const result : TypedArrayPack = new TypedArrayPack(
      toCopy.TypedArrayClass, toCopy.capacity
    )

    result.size = toCopy.size

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      result.set(index, toCopy.get(index))
    }

    return result
  }

  private _TypedArrayClass : TypedArrayConstructor
  private _elements : any
  private _size : number

  /**
  * Instantiate a new pack of values based upon a javascript typed array.
  *
  * @param TypedArrayClass - The constructor to use for instantiating the underlying typed array of this pack.
  * @param [capacity=16] - The number of elements to preallocate.
  */
  public constructor (
    TypedArrayClass : TypedArrayConstructor,
    capacity : number = 16
  ) {
    this._TypedArrayClass = TypedArrayClass
    this._elements = new TypedArrayClass(capacity)
    this._size = 0
  }

  /**
  * @return The constructor used for instantiating the underlying typed array of this pack.
  */
  public get TypedArrayClass () : TypedArrayConstructor {
    return this._TypedArrayClass
  }

  /**
  * Change the constructor used for instantiating the underlying typed array of this pack.
  *
  * This operation will fully reallocate this pack and cast all of its element
  * from its previous buffer type to its new one.
  *
  * @param TypedArrayClass - The new constructor used for instantiating the underlying typed array of this pack.
  */
  public set TypedArrayClass (TypedArrayClass : TypedArrayConstructor) {
    const newElements : any = new TypedArrayClass(this._elements.length)

    for (let index = 0, size = this._size; index < size; ++index) {
      newElements[index] = this._elements[index]
    }

    this._elements = newElements
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._size
  }

  /**
  * Update the size of this pack.
  *
  * @param value - The new number of elements into this pack.
  */
  public set size (value : number) {
    if (value > this._elements.length) {
      this.reallocate(value)
    }

    for (let index = this._size; index < value; ++index) {
      this._elements[index] = 0
    }

    this._size = value
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity () : number {
    return this._elements.length
  }

  /**
  * @see ReallocableCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    const old : any = this._elements
    const oldSize : number = this._size

    this._elements = new this._TypedArrayClass(capacity)
    this._size = Math.min(this._size, capacity)

    for (let index = 0; index < oldSize; ++index) {
      this._elements[index] = old[index]
    }
  }

  /**
  * @see ReallocableCollection.fit
  */
  public fit () : void {
    this.reallocate(this._size)
  }

  /**
  * @see Collection.isCollection
  */
  public get isCollection () : boolean {
    return true
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : number {
    return this._elements[index]
  }

  /**
  * @see Pack.sort
  */
  public sort (comparator : (left : number, right : number) => number) : void {
    this._elements.sort(comparator)
  }

  /**
  * @see Pack.swap
  */
  public swap (first : number, second : number) : void {
    const tmp : number = this._elements[first]
    this._elements[first] = this._elements[second]
    this._elements[second] = tmp
  }

  /**
  * @see Pack.set
  */
  public set (index : number, value : number) : void {
    if (index >= this._size) this.size = index + 1
    this._elements[index] = value
  }

  /**
  * @see Pack.insert
  */
  public insert (index : number, value : number) : void {
    if (index >= this._size) {
      this.set(index, value)
    } else {
      this.size += 1

      for (let cursor = this._size - 1; cursor > index; --cursor) {
        this._elements[cursor] = this._elements[cursor - 1]
      }

      this._elements[index] = value
    }
  }

  /**
  * @see Pack.push
  */
  public push (value : number) : void {
    const index : number = this._size

    this.size += 1
    this._elements[index] = value
  }

  /**
  * @see Pack.delete
  */
  public delete (index : number) : void {
    for (let cursor = index, size = this._size - 1; cursor < size; ++cursor) {
      this._elements[cursor] = this._elements[cursor + 1]
    }

    this.size -= 1
  }

  /**
  * @see Pack.warp
  */
  public warp (index : number) : void {
    this._elements[index] = this._elements[this._size - 1]
    this.size -= 1
  }

  /**
  * @see Collection.has
  */
  public has (element : number) : boolean {
    return this.indexOf(element) >= 0
  }

  /**
  * @see Collection.indexOf
  */
  public indexOf (element : number) : number {
    for (let index = 0, length = this._size; index < length; ++index) {
      if (equals(element, this._elements[index])) {
        return index
      }
    }

    return -1;
  }

  /**
  * Empty this pack of its elements.
  */
  public clear () : void {
    this._size = 0
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<number> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._elements[index]
    }
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other.isCollection) {
      if (other.size !== this._size) return false

      for (let index = 0, size = this._size; index < size; ++index) {
        if (!equals(other.get(index), this._elements[index])) return false
      }

      return true
    }

    return false
  }
}
