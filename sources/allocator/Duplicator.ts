import { Allocator } from './Allocator'

/**
 * An allocator that can clone existing instances of the managed object.
 */
export interface Duplicator<Product> extends Allocator<Product> {
  /**
   * Returns a new instance of the managed type of object that is a copy of an existing one.
   *
   * @param toCopy - An instance to copy.
   *
   * @returns A new instance of the managed type of object that is a copy of the given one.
   */
  copy(toCopy: Product): Product

  /**
   * 
   */
  move(origin: Product, target: Product): void
}
