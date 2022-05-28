/**
 * 
 */
export function toString(value: unknown): string {
  return value === null ? 'null' : value === undefined ? 'undefined' : value.toString()
}