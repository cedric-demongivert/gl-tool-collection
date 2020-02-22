import { PackCircularBuffer } from '@library/circular/PackCircularBuffer'

import { isCircularBuffer } from './CircularBuffer'

describe('#PackCircularBuffer', function () {
  isCircularBuffer(PackCircularBuffer.any)
})
