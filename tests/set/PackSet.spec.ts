import { PackSet } from '../../src/set/PackSet'
import { ArrayPack } from '../../src/pack/ArrayPack'

import { isSet } from './Set'

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

describe('#ArrayPackSet', function () {
  isSet<string>(
    () => new PackSet<string>(new ArrayPack<string>(10))
  ).of(randomString)
})
