import * as chalk from 'chalk'

import { Markable } from '../../sources/mark/Markable'
import { Sequence } from '../../sources/sequence/Sequence'
import { ArrayPack } from '../../sources/sequence/ArrayPack'
import { toString } from '../../sources/algorithm/toString'
import { equals } from '../../sources/algorithm/equals'

import { toBeMarkable } from './toBeMarkable'
import { UnicodeTablePrinter } from './UnicodeTablePrinter'

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
function createNotASequenceMessage(this: jest.MatcherContext, received: Markable) {
  return (
    'Expected the "is" method of ' + received.toString() + ' to return ' + this.utils.printExpected('true') +
    ' for the Sequence container but received ' + this.utils.printReceived(received.is(Sequence)) + ' instead.'
  )
}

/**
 * 
 */
function createNotEqualEntriesMessage(this: jest.MatcherContext, received: Sequence<unknown>, expected: Sequence<unknown>) {
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
function createEqualSequenceMessage(this: jest.MatcherContext, received: Sequence<unknown>, expected: Sequence<unknown>) {
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
export function toEqualSequence(received: unknown, sequence: Sequence<unknown>)
/**
 * 
 */
export function toEqualSequence(received: unknown, values: unknown[])
/**
 * 
 */
export function toEqualSequence(received: unknown, ...values: unknown[])
/**
 * 
 */
export function toEqualSequence(received: unknown, values: Iterable<unknown>)
/*
* 
*/
export function toEqualSequence(received: unknown, value: Iterator<unknown>)
export function toEqualSequence(this: jest.MatcherContext, received: unknown, ...expected: Expectation) {
  if (expected.length === 1) {
    const parameter: unknown = expected[0]

    if (typeof parameter !== 'object') {
      return implementation.call(this, received, ArrayPack.of(parameter))
    }

    if (Markable.is(parameter) && Sequence.is(parameter)) {
      return implementation.call(this, received, parameter)
    } else if (parameter instanceof Array) {
      return implementation.call(this, received, ArrayPack.wrap(parameter))
    } else if (typeof parameter[Symbol.iterator] === 'function') {
      return implementation.call(this, received, ArrayPack.ofIterator(parameter[Symbol.iterator]()))
    } else if (typeof parameter['next'] === 'function') {
      return implementation.call(this, received, ArrayPack.ofIterator(parameter as Iterator<unknown>))
    } else {
      return implementation.call(this, received, ArrayPack.of(parameter))
    }
  } else {
    return implementation.call(this, received, ArrayPack.wrap(expected))
  }
}

/**
 * 
 */
function implementation(this: jest.MatcherContext, received: unknown, expected: Sequence<unknown>) {
  if (!Markable.is(received)) {
    return toBeMarkable.call(this, received)
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
