/**
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  let tmp: T

  while (currentIndex > 0) {
    randomIndex = (Math.random() * currentIndex) << 0
    currentIndex--

    tmp = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = tmp
  }

  return array
}