import { TypedArrayPack } from '../../src/pack/TypedArrayPack'

import { isPack } from './Pack'

function randomNumber () : number {
  return Math.floor(Math.random() * 0xffffffff)
}

class Uint32Pack extends TypedArrayPack {
  static copy (toCopy : TypedArrayPack) : TypedArrayPack {
    return TypedArrayPack.copy(toCopy)
  }

  constructor (capacity : number) {
    super(Uint32Array, capacity)
  }
}

describe('#TypedArrayPack', function () {
  isPack<number>(Uint32Pack).of(randomNumber)
})
