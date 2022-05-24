import { CollectionIterator } from '../iterator/CollectionIterator'
import { BidirectionalIterator } from '../iterator/BidirectionalIterator'

import { IdentifierSet } from './IdentifierSet'

export class IdentifierSetIterator implements BidirectionalIterator<number>
{
  /**
  * The parent buffer of this iterator.
  */
  public identifierSet: IdentifierSet

  /**
  * The location of the element described by this iterator in the parent identifierSet.
  */
  public index: number

  /**
  * Instantiate a new random access iterator instance.
  */
  public constructor() {
    this.identifierSet = null
    this.index = 0
  }

  /**
  * @see Iterator#collection
  */
  public collection(): IdentifierSet {
    return this.identifierSet
  }

  /**
  * @see ForwardIterator.hasNext
  */
  public hasNext(): boolean {
    return this.identifierSet && this.index < this.identifierSet.size - 1
  }

  /**
  * @see BidirectionalIterator.go
  */
  public go(index: number): void {
    this.index = index
  }

  /**
  * @see ForwardIterator.next
  */
  public next(): void {
    this.index += 1
  }

  /**
  * @see ForwardIterator.forward
  */
  public forward(count: number): void {
    this.index += count
  }

  /**
  * @see ForwardIterator.end
  */
  public end(): void {
    this.index = this.identifierSet ? this.identifierSet.lastIndex : 0
  }

  /**
  * @see BackwardIterator.hasPrevious
  */
  public hasPrevious(): boolean {
    return this.identifierSet && this.index > 0
  }

  /**
  * @see BackwardIterator.previous
  */
  public previous(): void {
    this.index -= 1
  }

  /**
  * @see BackwardIterator.backward
  */
  public backward(count: number): void {
    this.index -= count
  }

  /**
  * @see BackwardIterator.start
  */
  public start(): void {
    this.index = 0
  }

  /**
  * @see Iterator.get
  */
  public get(): number {
    return this.identifierSet.get(this.index)
  }

  /**
  * @see Iterator.move
  */
  public move(iterator: CollectionIterator<number>): void {
    if (iterator instanceof IdentifierSetIterator) {
      this.identifierSet = iterator.identifierSet
      this.index = iterator.index
    } else {
      throw new Error(
        'Trying to move to a location described by an unsupported type of ' +
        'iterator'
      )
    }
  }

  /**
  * Shallow-copy the given instance.
  *
  * @param toCopy - An instance to shallow copy.
  */
  public copy(toCopy: IdentifierSetIterator): void {
    this.identifierSet = toCopy.identifierSet
    this.index = toCopy.index
  }

  /**
  * @see Iterator.clone
  */
  public clone(): IdentifierSetIterator {
    const copy: IdentifierSetIterator = new IdentifierSetIterator()

    copy.copy(this)

    return copy
  }

  /**
  * @see Iterator.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof IdentifierSetIterator) {
      return other.identifierSet === this.identifierSet &&
        other.index === this.index
    }

    return false
  }
}

export namespace IdentifierSetIterator {
  /**
  * Return a shallow copy of the given iterator.
  *
  * A shallow-copy *b* of an iterator *a* is an instance that follow both
  * properties :
  *  - b !== a
  *  - b.equals(a)
  *
  * @param toCopy - An iterator to copy.
  *
  * @returns A shallow copy of the given iterator.
  */
  export function copy(toCopy: IdentifierSetIterator): IdentifierSetIterator {
    return toCopy.clone()
  }
}
