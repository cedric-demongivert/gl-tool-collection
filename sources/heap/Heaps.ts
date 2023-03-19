import { Comparator, Factory } from '@cedric-demongivert/gl-tool-utils'

import { Packs } from '../pack/Packs'
import { Pack } from '../pack/Pack'

import { PackHeap } from './PackHeap'

/**
 * 
 */
export namespace Heaps {
    /**
     * 
     */
    export function any<Element>(defaultValue: Factory<Element>, capacity: number, comparator: Comparator<Element, Element>): PackHeap<Element> {
      return new PackHeap(Packs.any(defaultValue, capacity), comparator)
    }
  
    /**
     * 
     */
    export function uint8(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
      return new PackHeap<number>(Packs.uint8(capacity), comparator)
    }
  
    /**
     * 
     */
    export function uint16(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
      return new PackHeap<number>(Packs.uint16(capacity), comparator)
    }
  
    /**
     * 
     */
    export function uint32(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
      return new PackHeap<number>(Packs.uint32(capacity), comparator)
    }
  
    /**
     * 
     */
    export function int8(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
      return new PackHeap<number>(Packs.int8(capacity), comparator)
    }
  
    /**
     * 
     */
    export function int16(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
      return new PackHeap<number>(Packs.int16(capacity), comparator)
    }
  
    /**
     * 
     */
    export function int32(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
      return new PackHeap<number>(Packs.int32(capacity), comparator)
    }
  
    /**
     * 
     */
    export function float32(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
      return new PackHeap<number>(Packs.float32(capacity), comparator)
    }
  
    /**
     * 
     */
    export function float64(capacity: number, comparator: Comparator<number, number> = Comparator.compareNumbers): PackHeap<number> {
      return new PackHeap<number>(Packs.float64(capacity), comparator)
    }
  
    /**
     * 
     */
    export function fromPack<Element>(pack: Pack<Element>, comparator: Comparator<Element, Element>): PackHeap<Element> {
      return new PackHeap<Element>(pack, comparator)
    }
  }
  