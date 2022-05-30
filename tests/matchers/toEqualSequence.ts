import * as chalk from 'chalk'
import { Empty, equals, toString } from '@cedric-demongivert/gl-tool-utils'

import { Collection } from '../../sources/Collection'
import { Sequence } from '../../sources/sequence/Sequence'
import { ArrayPack } from '../../sources/sequence/ArrayPack'

import { UnicodeTablePrinter } from './UnicodeTablePrinter'
import { toBeCollection } from './toBeCollection'

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
      toEqualSequence(sequence: Sequence<unknown>): R;

      /**
       * 
       */
      toEqualSequence(values: unknown[]): R;

      /**
       * 
       */
      toEqualSequence(...values: unknown[]): R;

      /**
       * 
       */
      toEqualSequence(values: Iterable<unknown>): R;

      /**
       * 
       */
      toEqualSequence(value: Iterator<unknown>): R;
    }
  }
}

/**
 * 
 */
function createNotASequenceMessage(this: jest.MatcherContext, received: Collection<unknown>): string {
  return (
    'Expected isSequence() of ' + received.toString() + ' to return ' + this.utils.printExpected(true) +
    ' but received ' + this.utils.printReceived(received.isSequence()) + ' instead.'
  )
}

/**
 * 
 */
function createNotEqualEntriesMessage(this: jest.MatcherContext, received: Sequence<unknown>, expected: Sequence<unknown>): string {
  const table: UnicodeTablePrinter = new UnicodeTablePrinter(3)

  table.pushValues('#', 'received', 'expected')
  table.pushColors(undefined, undefined, undefined)

  const entries: number = Math.max(received.size, expected.size)

  for (let index = 0; index < entries; ++index) {
    const left: string = received.size > index ? toString(received.get(index)) : 'undefined'
    const right: string = expected.size > index ? toString(expected.get(index)) : 'undefined'

    table.pushValues(index.toString(), left, right)

    if (equals(received.get(index), expected.get(index))) {
      table.pushColors(undefined, chalk.green, chalk.green)
    } else {
      table.pushColors(undefined, chalk.red, chalk.red)
    }
  }

  table.pushValues('size', received.size.toString(), expected.size.toString())

  if (equals(received.size, expected.size)) {
    table.pushColors(undefined, chalk.green, chalk.green)
  } else {
    table.pushColors(undefined, chalk.red, chalk.red)
  }

  return (
    'Expected ' + received.toString() + ' to equal ' + Sequence.stringify(expected) +
    ' but there are differences between both sequences.\r\n\r\n' + table.head(0) + '\r\n' +
    table.after(1) + '\r\n' + table.head(0)
  )
}

/**
 * 
 */
function createEqualSequenceMessage(this: jest.MatcherContext, received: Sequence<unknown>, expected: Sequence<unknown>): string {
  return 'Expected ' + received.toString() + ' to not equal sequence ' + Sequence.stringify(expected) + '.'
}

type Expectation = (
  [Sequence<unknown>] |
  [unknown[]] |
  [Iterable<unknown>] |
  [Iterator<unknown>] |
  unknown[]
)

/**
 * 
 */
export function toEqualSequence(received: unknown, sequence: Sequence<unknown>): jest.CustomMatcherResult
/**
 * 
 */
export function toEqualSequence(received: unknown, values: unknown[]): jest.CustomMatcherResult
/**
 * 
 */
export function toEqualSequence(received: unknown, ...values: unknown[]): jest.CustomMatcherResult
/**
 * 
 */
export function toEqualSequence(received: unknown, values: Iterable<unknown>): jest.CustomMatcherResult
/*
* 
*/
export function toEqualSequence(received: unknown, value: Iterator<unknown>): jest.CustomMatcherResult
export function toEqualSequence(this: jest.MatcherContext, received: unknown, ...expected: Expectation): jest.CustomMatcherResult {
  if (expected.length === 1) {
    const parameter: unknown = expected[0]

    if (parameter == null || typeof parameter !== 'object') {
      return implementation.call(this, received, ArrayPack.of(Empty.nullptr, parameter))
    }

    if (Collection.is(parameter) && Sequence.is(parameter)) {
      return implementation.call(this, received, parameter)
    } else if (parameter instanceof Array) {
      return implementation.call(this, received, ArrayPack.wrap(parameter, Empty.nullptr))
    } else if (typeof (parameter as any)[Symbol.iterator] === 'function') {
      return implementation.call(this, received, ArrayPack.ofIterator(Empty.nullptr, (parameter as any)[Symbol.iterator]()))
    } else if (typeof (parameter as any).next === 'function') {
      return implementation.call(this, received, ArrayPack.ofIterator(Empty.nullptr, parameter as Iterator<unknown>))
    } else {
      return implementation.call(this, received, ArrayPack.of(Empty.nullptr, parameter))
    }
  } else {
    return implementation.call(this, received, ArrayPack.wrap(expected, Empty.nullptr))
  }
}

/**
 * 
 */
function implementation(this: jest.MatcherContext, received: unknown, expected: Sequence<unknown>): jest.CustomMatcherResult {
  if (!Collection.is(received)) {
    return toBeCollection.call(this, received)
  }

  if (!Sequence.is(received)) {
    return { pass: false, message: createNotASequenceMessage.bind(this, received) }
  }

  if (received.size !== expected.size) {
    return { pass: false, message: createNotEqualEntriesMessage.bind(this, received, expected) }
  }

  for (let index = 0; index < received.size; ++index) {
    if (!equals(received.get(index), expected.get(index))) {
      return { pass: false, message: createNotEqualEntriesMessage.bind(this, received, expected) }
    }
  }

  return { pass: true, message: createEqualSequenceMessage.bind(this, received, expected) }
}

if (typeof global === 'object' && 'expect' in global) {
  expect.extend({ toEqualSequence })
}
