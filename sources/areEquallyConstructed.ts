/**
 * 
 */
export function areEquallyConstructed<Type extends Object>(candidate: unknown, instance: Type): candidate is Type {
    return candidate != null && candidate.constructor === instance.constructor
}