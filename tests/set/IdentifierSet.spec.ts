/** eslint-env jest */
import { IdentifierSet } from '@library/set/IdentifierSet'

import { isMutableSet } from './MutableSet'

describe('#IdentifierSet', function () {
  isMutableSet(IdentifierSet.allocate)
})
