import { BufferPack } from '../../src/pack/BufferPack'

import { isPack } from './Pack'

function randomNumber () : number {
  return Math.floor(Math.random() * 0xffffffff)
}

class Uint32Pack extends BufferPack<Uint32Array> {
  static copy (toCopy : Uint32Pack) : BufferPack<Uint32Array> {
    return BufferPack.copy(toCopy)
  }

  constructor (capacity : number) {
    super(new Uint32Array(capacity))
  }
}

describe('#BufferPack', function () {
  isPack<number>(Uint32Pack).of(randomNumber)
})
