import { Comparator } from '../../src/Comparator'
import { ArrayPack } from '../../src/sequence/ArrayPack'

import { range } from '../range'
import { PackSpecification } from './Pack.spec'


describe('sequence/ArrayPack', function () {
  PackSpecification.defaultBehavior({
    factory: ArrayPack.allocate,
    values: range,
    comparator: Comparator.compareNumbers
  })
})
