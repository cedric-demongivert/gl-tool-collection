import { UintArray } from './UintArray'

export function upTo (maximum : number, capacity : number) : UintArray {
  if (maximum <= 0xff) {
    return new Uint8Array(capacity)
  } else if (maximum <= 0xffff) {
    return new Uint16Array(capacity)
  } else {
    return new Uint32Array(capacity)
  }
}
