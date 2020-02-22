/** eslint-env jest */

import { Collection } from '@library/Collection'
import { View } from '@library/View'

import { createCollection } from '../mocks/createCollection'

function on (value : any) : any {
  return value
}

describe('View', function () {
  describe('#wrap', function () {
    it('wrap a collection that is not already a view', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = View.wrap(mock)

      expect(tags).toBeInstanceOf(View)
    })

    it('return collection view as is', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = View.wrap(mock)

      expect(View.wrap(tags)).toBe(tags)
    })
  })

  describe('#has', function () {
    it('call the wrapped collection method and return the result', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = new View<number>(mock)

      on(mock.has).mockReturnValue(false)
      expect(tags.has(6)).toBeFalsy()
      expect(mock.has).toHaveBeenCalledWith(6)

      on(mock.has).mockReturnValue(true)
      expect(tags.has(3)).toBeTruthy()
      expect(mock.has).toHaveBeenCalledWith(3)
    })
  })

  /*
  describe('#indexOf', function () {
    it('call the wrapped collection method and return the result', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = new View<number>(mock)

      on(mock.indexOf).mockReturnValue(-1)
      expect(tags.indexOf(6)).toBe(-1)
      expect(mock.indexOf).toHaveBeenCalledWith(6)

      on(mock.indexOf).mockReturnValue(6)
      expect(tags.indexOf(3)).toBe(6)
      expect(mock.indexOf).toHaveBeenCalledWith(3)
    })
  })

  describe('#get', function () {
    it('call the wrapped collection method and return the result', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = new View<number>(mock)

      on(mock.get).mockReturnValue(1)
      expect(tags.get(0)).toBe(1)
      expect(mock.get).toHaveBeenCalledWith(0)

      on(mock.get).mockReturnValue(3)
      expect(tags.get(2)).toBe(3)
      expect(mock.get).toHaveBeenCalledWith(2)
    })
  })*/

  describe('#size', function () {
    it('call the wrapped collection method and return the result', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = new View<number>(mock)

      createCollection.size(mock).mockReturnValue(3)
      expect(tags.size).toBe(3)
      expect(createCollection.size(mock)).toHaveBeenCalled()
    })
  })
})
