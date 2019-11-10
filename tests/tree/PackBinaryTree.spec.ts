import { PackBinaryTree } from '../../src/tree/PackBinaryTree'
import { ArrayPack } from '../../src/pack/ArrayPack'

import { isBinaryTree } from './BinaryTree'

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

describe('#PackBinaryTree', function () {
  isBinaryTree<string, PackBinaryTree<string>>({
    factory (capacity : number) : PackBinaryTree<string> {
      return new PackBinaryTree<string>(new ArrayPack(capacity), comparator)
    },
    generator: randomString,
    copy (heap : PackBinaryTree<string>) : PackBinaryTree<string> {
      return PackBinaryTree.copy(heap)
    }
  })
})
