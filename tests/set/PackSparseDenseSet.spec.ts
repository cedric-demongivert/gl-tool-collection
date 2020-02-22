/** eslint-env jest */
import { PackSparseDenseSet } from '../../src/set/PackSparseDenseSet'

import { isMutableSet } from './MutableSet'

describe('#PackSparseDenseSet', function () {
  isMutableSet(PackSparseDenseSet.any)
})
