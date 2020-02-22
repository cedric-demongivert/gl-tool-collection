/** eslint-env jest */
import { PackSparseDenseSet } from '@library/set/PackSparseDenseSet'

import { isMutableSet } from './MutableSet'

describe('#PackSparseDenseSet', function () {
  isMutableSet(PackSparseDenseSet.any)
})
