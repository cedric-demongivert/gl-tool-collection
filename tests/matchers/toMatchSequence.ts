import * as chalk from 'chalk'
import { equals, toString } from '@cedric-demongivert/gl-tool-utils'

import { Markable } from '../../sources/mark/Markable'
import { Sequence } from '../../sources/sequence/Sequence'
import { ArrayPack } from '../../sources/sequence/ArrayPack'

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
      toMatchSequence(sequence: Sequence<unknown>): R;

      /**
       * 
       */
      toMatchSequence(values: unknown[]): R;

      /**
       * 
       */
      toMatchSequence(...values: unknown[]): R;

      /**
       * 
       */
      toMatchSequence(values: Iterable<unknown>): R;

      /**
       * 
       */
      toMatchSequence(value: Iterator<unknown>): R;
    }
  }
}

/**
 * 
 */
const NO_MATCH: symbol = Symbol()

/**
 * 
 */
function createNotASequenceMessage(this: jest.MatcherContext, received: Markable): string {
  return (
    'Expected the "is" method of ' + received.toString() + ' to return ' + this.utils.printExpected('true') +
    ' for the Sequence container but received ' + this.utils.printReceived(received.is(Sequence)) + ' instead.'
  )
}

/**
 * 
 */
function createNotMatchingSequenceMessage(this: jest.MatcherContext, received: Sequence<unknown>, expected: Sequence<unknown>, match: Sequence<unknown>): string {
  const table: UnicodeTablePrinter = new UnicodeTablePrinter(3)

  table.pushValues('#', 'received', 'match')
  table.pushColors(undefined, undefined, undefined)

  for (let index = 0; index < match.size; ++index) {
    const left: string = received.size > index ? toString(received.get(index)) : '?'
    const right: string = match.get(index) === NO_MATCH ? '?' : toString(match.get(index))

    table.pushValues(index.toString(), left, right)

    if (received.size > index && match.get(index) !== NO_MATCH) {
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
    'Expected ' + received.toString() + ' to match ' + Sequence.stringify(expected) +
    ' but there are differences between both sequences.\r\n\r\n' + table.head(0) + '\r\n' +
    table.after(1) + '\r\n' + table.head(0)
  )
}

/**
 * 
 */
function createMatchingSequenceMessage(this: jest.MatcherContext, received: Sequence<unknown>, expected: Sequence<unknown>): string {
  return 'Expected ' + received.toString() + ' to not match sequence ' + Sequence.stringify(expected) + '.'
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
export function toMatchSequence(received: unknown, sequence: Sequence<unknown>): jest.CustomMatcherResult
/**
 * 
 */
export function toMatchSequence(received: unknown, values: unknown[]): jest.CustomMatcherResult
/**
 * 
 */
export function toMatchSequence(received: unknown, ...values: unknown[]): jest.CustomMatcherResult
/**
 * 
 */
export function toMatchSequence(received: unknown, values: Iterable<unknown>): jest.CustomMatcherResult
/*
* 
*/
export function toMatchSequence(received: unknown, value: Iterator<unknown>): jest.CustomMatcherResult
export function toMatchSequence(this: jest.MatcherContext, received: unknown, ...expected: Expectation): jest.CustomMatcherResult {
  if (expected.length === 1) {
    const parameter: unknown = expected[0]

    if (parameter == null || typeof parameter !== 'object') {
      return implementation.call(this, received, ArrayPack.of(parameter))
    }

    if (Markable.is(parameter) && Sequence.is(parameter)) {
      return implementation.call(this, received, parameter)
    } else if (parameter instanceof Array) {
      return implementation.call(this, received, ArrayPack.wrap(parameter))
    } else if (typeof (parameter as any)[Symbol.iterator] === 'function') {
      return implementation.call(this, received, ArrayPack.ofIterator((parameter as any)[Symbol.iterator]()))
    } else if (typeof (parameter as any).next === 'function') {
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
function implementation(this: jest.MatcherContext, received: unknown, expected: Sequence<unknown>): jest.CustomMatcherResult {
  if (!Markable.is(received)) {
    return toBeMarkable.call(this, received)
  }

  if (!Sequence.is(received)) {
    return { pass: false, message: createNotASequenceMessage.bind(this, received) }
  }

  const match: ArrayPack<unknown> = ArrayPack.copy(expected.clone())

  for (let index = 0; index < received.size; ++index) {
    let pass: boolean = false

    for (let matchIndex = index; matchIndex < match.size; ++matchIndex) {
      if (equals(received.get(index), match.get(matchIndex))) {
        pass = true
        match.swap(index, matchIndex)
      }
    }

    if (!pass) {
      match.push(NO_MATCH)
      match.swap(index, match.size - 1)
    }
  }

  if (match.size !== received.size) {
    return { pass: false, message: createNotMatchingSequenceMessage.bind(this, received, expected, match) }
  }

  return { pass: true, message: createMatchingSequenceMessage.bind(this, received, expected) }
}

if (typeof global === 'object' && 'expect' in global) {
  expect.extend({ toMatchSequence })
}
