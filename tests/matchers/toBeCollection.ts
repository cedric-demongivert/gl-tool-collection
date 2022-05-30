import { toString } from '@cedric-demongivert/gl-tool-utils'
import { Collection } from '../../sources/Collection'
import { IsCollection } from '../../sources/IsCollection';

/**
 * 
 */
declare global {
  /**
   * 
   */
  namespace jest {
    /**
     * 
     */
    interface Matchers<R> {
      /**
       * 
       */
      toBeCollection(): R;
    }
  }
}

/**
 * 
 */
function createNotAnObjectMessage(this: jest.MatcherContext, received: unknown) {
  return (
    'Expected typeof ' + toString(received) + ' to be ' + this.utils.printExpected('object') +
    ' but received ' + this.utils.printReceived(typeof received) + ' instead.'
  )
}

/**
 * 
 */
function createNoCollectionSymbolMessage(this: jest.MatcherContext, received: object) {
  return (
    'Expected ' + received.toString() + ' to have a ' + IsCollection.SYMBOL.toString() + ' property.'
  )
}

/**
 * 
 */
function createIllegalCollectionSymbolMessage(this: jest.MatcherContext, received: { [IsCollection.SYMBOL]: unknown }) {
  return (
    'Expected ' + IsCollection.SYMBOL.toString() + ' property of ' + received.toString() + ' to be of type ' + this.utils.printExpected('function') +
    ' but received an object with a ' + IsCollection.SYMBOL.toString() + ' property of type ' + this.utils.printReceived(typeof received[IsCollection.SYMBOL]) + ' instead.'
  )
}

/**
 * 
 */
function createNotACollectionMessage(this: jest.MatcherContext, received: unknown, result: unknown) {
  return (
    'Expected the ' + IsCollection.SYMBOL.toString() + ' method of ' + toString(received) + ' to return ' + this.utils.printExpected(true) +
    ' after a call but received ' + this.utils.printReceived(result) + ' instead.'
  )
}

/**
 * 
 */
function createIsCollectionMessage(this: jest.MatcherContext, received: unknown) {
  return 'Expected ' + toString(received) + ' to not implement the Collection interface.'
}

/**
 * 
 */
function containsCollectionSymbol(value: object): value is { [IsCollection.SYMBOL]: unknown } {
  return (value as any)[IsCollection.SYMBOL] != null
}

/**
 * 
 */
export function toBeCollection(this: jest.MatcherContext, received: unknown): jest.CustomMatcherResult {
  if (received == null || typeof received !== 'object') {
    return { pass: false, message: createNotAnObjectMessage.bind(this, received) }
  }

  if (!containsCollectionSymbol(received)) {
    return { pass: false, message: createNoCollectionSymbolMessage.bind(this, received) }
  }

  const is: unknown = received[IsCollection.SYMBOL]

  if (typeof is !== 'function') {
    return { pass: false, message: createIllegalCollectionSymbolMessage.bind(this, received) }
  }

  if (is.call(received) !== true) {
    return { pass: false, message: createNotACollectionMessage.bind(this, received, is.call(received)) }
  }

  return { pass: true, message: createIsCollectionMessage.bind(this, received) }
}

if (typeof global === 'object' && 'expect' in global) {
  expect.extend({ toBeCollection })
}