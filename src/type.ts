export namespace JsonDiff {
  export type Key = string | number

  export interface AddChunk {
    p: Key[]
    v: any
  }

  export interface ReplaceChunk {
    p: Key[]
    v: any
  }

  export interface DeleteChunk {
    p: Key[]
  }

  export interface Desc {
    a?: AddChunk[]
    r?: ReplaceChunk[]
    d?: DeleteChunk[]
  }
}
