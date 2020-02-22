/** eslint-env jest */
import { IdentifierSet } from '../../src/set/IdentifierSet'

import { isMutableSet } from './MutableSet'

describe('#IdentifierSet', function () {
  isMutableSet(IdentifierSet.allocate)
})
