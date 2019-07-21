export function pickUnique <T> (generator : () => T, size : number) : Array<T> {
  const elements : Set<T> = new Set<T>()

  while (elements.size < size) {
    elements.add(generator())
  }

  return [...elements]
}
