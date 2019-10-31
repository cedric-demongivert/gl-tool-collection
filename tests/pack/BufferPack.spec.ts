import { BufferPack } from '../../src/pack/BufferPack'

import { isPack } from './Pack'

function randomNumber () : number {
  return Math.floor(Math.random() * 0xffffffff)
}

describe('#BufferPack', function () {
  isPack<number, BufferPack<Uint32Array>>({
    factory (capacity : number) : BufferPack<Uint32Array> {
      return new BufferPack<Uint32Array>(new Uint32Array(capacity))
    },
    generator: randomNumber,
    defaultValue: BufferPack.DEFAULT_VALUE,
    copy (pack : BufferPack<Uint32Array>) : BufferPack<Uint32Array> {
      return BufferPack.copy(pack)
    }
  })
})
