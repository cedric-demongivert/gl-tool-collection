/** eslint-env jest */
import { BitSet } from '../../src/set/BitSet'

import { isMutableSet } from './MutableSet'

describe('#BitSet', function() {
  isMutableSet(BitSet.allocate)
})
