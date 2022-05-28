import { Comparable } from "@cedric-demongivert/gl-tool-utils";

/**
 * 
 */
export function equals(left: unknown, right: unknown) {
  return left === right || (left != null && Comparable.is(left) && left.equals(right))
}
