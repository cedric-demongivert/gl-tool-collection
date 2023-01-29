import { toString, Factory } from '@cedric-demongivert/gl-tool-utils'

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
      toDelegate(): R;
    }
  }
}

function lol<ParameterTypes extends Array<any>, ReturnType>(
  callable: (...parameters: ParameterTypes) => ReturnType, 
  parameterFactory: Factory<ParameterTypes>,
) {
  
}


/**
 * 
 */
export function toDelegate<ParameterTypes extends Array<any>, ReturnType>(
  this: jest.MatcherContext, 
  received: unknown,
  ...factories: 
): jest.CustomMatcherResult {
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