import { toString } from '@cedric-demongivert/gl-tool-utils'
import { Markable } from '../../sources/mark/Markable'

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
      toBeMarkable(): R;
    }
  }
}

/**
 * 
 */
function createIsNotAnObjectMessage(this: jest.MatcherContext, received: unknown) {
  return (
    'Expected typeof ' + toString(received) + ' to be ' + this.utils.printExpected('object') +
    ' but received ' + this.utils.printReceived(typeof received) + ' instead.'
  )
}

/**
 * 
 */
function createNoIsPropertyMessage(this: jest.MatcherContext, received: object) {
  return (
    'Expected ' + received.toString() + ' to have a "is" property.'
  )
}

/**
 * 
 */
function createIllegalIsPropertyMessage(this: jest.MatcherContext, received: { is: unknown }) {
  return (
    'Expected "is" property of ' + received.toString() + ' to be of type ' + this.utils.printExpected('function') +
    ' but received an object with a "is" property of type ' + this.utils.printReceived(typeof received.is) + ' instead.'
  )
}

/**
 * 
 */
function createDoesNotMatchMarkableMessage(this: jest.MatcherContext, received: unknown, result: unknown) {
  return (
    'Expected the "is" method of ' + toString(received) + ' to return ' + this.utils.printExpected(true) +
    ' after a call with the Markable container but received ' + this.utils.printReceived(result) + ' instead.'
  )
}

/**
 * 
 */
function createIsMarkableMessage(this: jest.MatcherContext, received: unknown) {
  return 'Expected ' + toString(received) + ' to not implement the Markable interface.'
}

/**
 * 
 */
function containsIsProperty(value: object): value is { is: unknown } {
  return 'is' in value
}

/**
 * 
 */
export function toBeMarkable(this: jest.MatcherContext, received: unknown): jest.CustomMatcherResult {
  if (received == null || typeof received !== 'object') {
    return { pass: false, message: createIsNotAnObjectMessage.bind(this, received) }
  }

  if (!containsIsProperty(received)) {
    return { pass: false, message: createNoIsPropertyMessage.bind(this, received) }
  }

  const is: unknown = received.is

  if (typeof is !== 'function') {
    return { pass: false, message: createIllegalIsPropertyMessage.bind(this, received) }
  }

  if (is.call(received, Markable) !== true) {
    return { pass: false, message: createDoesNotMatchMarkableMessage.bind(this, received, is.call(received, Markable)) }
  }

  return { pass: true, message: createIsMarkableMessage.bind(this, received) }
}

if (typeof global === 'object' && 'expect' in global) {
  expect.extend({ toBeMarkable })
}