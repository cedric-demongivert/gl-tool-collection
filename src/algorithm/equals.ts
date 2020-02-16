export function equals (left : any, right : any) {
  if (left === right) return true
  if (left.equals) return left.equals(right)

  return false
}
