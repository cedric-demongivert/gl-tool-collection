import { PackHeap } from '../../src/heap/PackHeap'
import { ArrayPack } from '../../src/pack/ArrayPack'

import { isHeap } from './Heap'

const chars : Array<string> = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

function randomString () : string {
  return chars[Math.floor(Math.random() * chars.length)]
}

function comparator (left : string, right : string) : number {
  return left.charCodeAt(0) - right.charCodeAt(0)
}

describe('#PackHeap', function () {
  isHeap<string, PackHeap<string>>({
    factory (capacity : number) : PackHeap<string> {
      return new PackHeap<string>(new ArrayPack(capacity), comparator)
    },
    generator: randomString,
    copy (heap : PackHeap<string>) : PackHeap<string> {
      return PackHeap.copy(heap)
    }
  })
})
