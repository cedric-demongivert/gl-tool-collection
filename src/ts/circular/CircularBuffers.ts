import { CircularBuffer } from './CircularBuffer'
import { PackCircularBuffer } from './PackCircularBuffer'
import { Pack } from '../pack/Pack'

export class CircularBuffers {
  static copy <T> (buffer : CircularBuffer<T>) : CircularBuffer<T> {
    if (buffer == null) {
      return null
    } else {
      return (buffer.constructor as any).copy(pack)
    }
  }

  static fromPack <T> (pack : Pack<T>) : CircularBuffer<T> {
    return new PackCircularBuffer<T>(pack)
  }
}
