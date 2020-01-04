/** eslint-env jest */
import { IdentifierSet } from '../../src/set/IdentifierSet'

import { isSet } from './Set'

function randomNumber () : number {
  return Math.floor(250 + Math.random() * 1000)
}

describe('#IdentifierSet', function () {
  isSet<number>(() => new IdentifierSet(2000)).of(randomNumber)
})
