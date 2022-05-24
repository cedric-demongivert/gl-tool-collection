/**
 * 
 */
export function equals(left: any, right: any) {
  return left === right || (left.equals && left.equals(right))
}
