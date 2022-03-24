import { Comparator } from '../../src/Comparator'
import { BufferPack } from '../../src/sequence/BufferPack'

import { range } from '../range'
import { PackSpecification } from './Pack.spec'

describe('#BufferPack', function () {
  PackSpecification.defaultBehavior({
    factory: BufferPack.float64,
    values: range,
    comparator: Comparator.compareNumbers
  })
})
