/** eslint-env jest */
import { PackSparseDenseSet } from '../../src/ts/set/PackSparseDenseSet'
import { ArrayPack } from '../../src/ts/pack/ArrayPack'

import { isSet } from './Set'

function randomNumber () : number {
  return Math.floor(250 + Math.random() * 1000)
}

describe('#PackSparseDenseSet', function () {
  isSet<number>(
    () => new PackSparseDenseSet(new ArrayPack<number>(2000))
  ).of(randomNumber)
})
