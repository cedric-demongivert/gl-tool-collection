import * as leafs from './leafs'
import * as nodes from './nodes'

export type TreeElement<Element> = leafs.Leaf<Element> | nodes.Node<Element>

export function getLeafWith<Element>(
  root : TreeElement<Element>,
  element : Element
) : leafs.Leaf<Element> {
  let current : TreeElement<Element> = root

  while (!current.isLeaf) {
    const node : nodes.Node<Element> = current as nodes.Node<Element>
    current = node.children.get(nodes.indexOfChildWithElement(node, element))
  }

  return current as leafs.Leaf<Element>
}
