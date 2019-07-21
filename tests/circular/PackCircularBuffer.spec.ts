import { PackCircularBuffer } from '../../src/ts/circular/PackCircularBuffer'
import { ArrayPack } from '../../src/ts/pack/ArrayPack'

import { isCircularBuffer } from './CircularBuffer'

const chars : Array<string> = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

function randomString () : string {
  const length : number = Math.floor(5 + Math.random() * 10)
  let result : string = ''

  for (let index = 0; index < length; ++index) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }

  return result
}

describe('#PackCircularBuffer', function () {
  isCircularBuffer<string>(
    (capacity : number) => new PackCircularBuffer<string>(
      new ArrayPack<string>(capacity)
    )
  ).of(randomString)
})
