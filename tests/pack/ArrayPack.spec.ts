import { ArrayPack } from '../../src/pack/ArrayPack'

import { isPack } from './Pack'

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

describe('#ArrayPack', function () {
  isPack<string, ArrayPack<string>>({
    factory (capacity : number) : ArrayPack<string> {
      return new ArrayPack<string>(capacity)
    },
    generator: randomString,
    defaultValue: ArrayPack.DEFAULT_VALUE,
    copy (pack : ArrayPack<string>) : ArrayPack<string> {
      return ArrayPack.copy(pack)
    }
  })
})
