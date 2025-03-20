import { JsonDiff } from './type'

export default class JsonModify {
  to(compareJson: any, baseJson: any) {
    return this._to(compareJson, baseJson, [])
  }

  private _to(
    compareJson: any,
    baseJson: any,
    prefixPath: JsonDiff.Key[],
  ): JsonDiff.Desc | undefined {
    if (compareJson === baseJson) return

    if (
      compareJson === null ||
      baseJson === null ||
      compareJson === undefined ||
      baseJson === undefined ||
      Array.isArray(compareJson) !== Array.isArray(baseJson) ||
      typeof compareJson !== typeof baseJson ||
      typeof compareJson === 'bigint' ||
      typeof compareJson === 'boolean' ||
      typeof compareJson === 'number' ||
      typeof compareJson === 'string'
    ) {
      return {
        r: [
          {
            p: [...prefixPath],
            v: compareJson,
          },
        ],
      }
    }

    const diffRes: Required<JsonDiff.Desc> = {
      a: [],
      d: [],
      r: [],
    }

    if (Array.isArray(compareJson)) {
      const minLen = Math.min(compareJson.length, baseJson.length)

      for (let i = 0; i < minLen; i++) {
        const itemDiff = this._to(compareJson[i], baseJson[i], [
          ...prefixPath,
          i,
        ])
        if (itemDiff) {
          this.mergeDiff(diffRes, itemDiff)
        }
      }

      for (let i = minLen; i < compareJson.length; i++) {
        diffRes.a.push({
          p: [...prefixPath, i],
          v: compareJson[i],
        })
      }

      for (let i = minLen; i < baseJson.length; i++) {
        diffRes.d.push({
          p: [...prefixPath, i],
        })
      }

      return this.removeEmpty(diffRes)
    }

    const inCompareJsonKeys: string[] = []
    for (const key in compareJson) {
      inCompareJsonKeys.push(key)

      const subDiff = this._to(compareJson[key], baseJson[key], [
        ...prefixPath,
        key,
      ])
      if (subDiff) {
        this.mergeDiff(diffRes, subDiff)
      }
    }

    for (const key in baseJson) {
      if (inCompareJsonKeys.includes(key)) continue

      diffRes.d.push({
        p: [...prefixPath, key],
      })
    }

    return this.removeEmpty(diffRes)
  }

  merge(originData: any, diff: JsonDiff.Desc): any {
    if (!diff.a?.length && !diff.r?.length && !diff.d?.length) {
      return originData
    }

    if (originData === null || originData === undefined) {
      return this.diffToJson(diff)
    }

    if (
      typeof originData === 'bigint' ||
      typeof originData === 'boolean' ||
      typeof originData === 'number' ||
      typeof originData === 'string'
    ) {
      if (diff.d?.length) {
        for (const item of diff.d) {
          if (item.p.length === 0) {
            return
          }
        }
      }

      if (diff.r?.length) {
        for (const item of diff.r) {
          if (item.p.length === 0) {
            return item.v
          }
        }
      }
    }

    const newData = this.deepClone(originData)

    if (diff.a?.length) {
      for (const item of diff.a) {
        if (item.p.length === 0) continue

        const modifyValue = this.getValueByPath(newData, item.p.slice(0, -1))
        if (modifyValue !== null && typeof modifyValue === 'object') {
          modifyValue[item.p[item.p.length - 1]] = item.v
        }
      }
    }

    if (diff.d?.length) {
      for (const item of diff.d) {
        if (item.p.length === 0) return

        const modifyValue = this.getValueByPath(newData, item.p.slice(0, -1))
        const lastKey = item.p[item.p.length - 1]
        if (Array.isArray(modifyValue) && typeof lastKey === 'number') {
          if (modifyValue.length > lastKey) {
            modifyValue.length = lastKey
          }
        }

        if (Object.prototype.toString.call(modifyValue) === '[object Object]') {
          delete modifyValue[lastKey]
        }
      }
    }

    if (diff.r?.length) {
      for (const item of diff.r) {
        if (item.p.length === 0) return item.v

        const modifyValue = this.getValueByPath(newData, item.p.slice(0, -1))
        if (modifyValue !== null && typeof modifyValue === 'object') {
          modifyValue[item.p[item.p.length - 1]] = item.v
        }
      }
    }

    return newData
  }

  private getDiffKeys(): (keyof JsonDiff.Desc)[] {
    return ['a', 'r', 'd']
  }

  private removeEmpty(diff: JsonDiff.Desc) {
    this.getDiffKeys().forEach((key) => {
      if (diff[key] && diff[key].length === 0) {
        delete diff[key]
      }
    })

    if (Object.keys(diff).length === 0) return

    return diff
  }

  private mergeDiff(diff1: JsonDiff.Desc, diff2: JsonDiff.Desc) {
    this.getDiffKeys().forEach((key) => {
      if (diff2[key]?.length) {
        if (!diff1[key]) {
          diff1[key] = []
        }

        diff1[key].push(...(diff2[key] as any))
      }
    })
  }

  private diffToJson(diff: JsonDiff.Desc): any {
    if (diff.a?.length) {
      for (const item of diff.a) {
        if (item.p.length === 0) {
          return item.v
        }
      }
    }

    if (diff.r?.length) {
      for (const item of diff.r) {
        if (item.p.length === 0) {
          return item.v
        }
      }
    }
  }

  private getValueByPath(v: any, path: JsonDiff.Key[]) {
    let res = v
    for (const key of path) {
      res = res?.[key]
    }
    return res
  }

  private deepClone(v: any): any {
    if (v === null || typeof v !== 'object') return v

    if (Array.isArray(v)) {
      return v.map((item) => this.deepClone(item))
    }

    const res: any = {}
    for (const key in v) {
      res[key] = this.deepClone(v[key])
    }
    return res
  }
}
