/**
 * 
 */
export function gcd(left: number, right: number): number {
    while (right != 0) {
      const nextRight: number = left % right
      left = right
      right = nextRight
    }
  
    return left
}