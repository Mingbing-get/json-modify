import JsonModify from '../jsonModify'

describe('simple value', () => {
  const jsonModify = new JsonModify()

  test('null value', () => {
    const diffRes = jsonModify.to(null, null)

    expect(diffRes).toBeUndefined()
  })

  test('undefined value', () => {
    const diffRes = jsonModify.to(undefined, undefined)

    expect(diffRes).toBeUndefined()
  })

  test('null and undefine', () => {
    const diffRes = jsonModify.to(null, undefined)

    expect(diffRes).toMatchObject({
      r: [
        {
          p: [],
          v: null,
        },
      ],
    })

    const diffRes1 = jsonModify.to(undefined, null)

    expect(diffRes1).toMatchObject({
      r: [
        {
          p: [],
          v: undefined,
        },
      ],
    })
  })

  test('string and undefine', () => {
    const diffRes = jsonModify.to('123', undefined)

    expect(diffRes).toMatchObject({
      r: [
        {
          p: [],
          v: '123',
        },
      ],
    })

    const diffRes1 = jsonModify.to(undefined, '123')

    expect(diffRes1).toMatchObject({
      r: [
        {
          p: [],
          v: undefined,
        },
      ],
    })
  })

  test('string value', () => {
    const diffRes = jsonModify.to('abc', 'ab')

    expect(diffRes).toMatchObject({
      r: [
        {
          p: [],
          v: 'abc',
        },
      ],
    })

    const sameRes = jsonModify.to('abc', 'abc')

    expect(sameRes).toBeUndefined()
  })

  test('number value', () => {
    const diffRes = jsonModify.to(123, 12)

    expect(diffRes).toMatchObject({
      r: [
        {
          p: [],
          v: 123,
        },
      ],
    })

    const sameRes = jsonModify.to(123, 123)

    expect(sameRes).toBeUndefined()
  })

  test('boolean value', () => {
    const diffRes = jsonModify.to(true, false)

    expect(diffRes).toMatchObject({
      r: [
        {
          p: [],
          v: true,
        },
      ],
    })

    const sameRes = jsonModify.to(false, false)

    expect(sameRes).toBeUndefined()
  })
})

describe('array value', () => {
  const jsonModify = new JsonModify()

  test('array and undefined', () => {
    const diffRes = jsonModify.to([1, 2], undefined)

    expect(diffRes).toMatchObject({
      r: [
        {
          p: [],
          v: [1, 2],
        },
      ],
    })

    const diffRes1 = jsonModify.to(undefined, [1, 2])

    expect(diffRes1).toMatchObject({
      r: [
        {
          p: [],
          v: undefined,
        },
      ],
    })
  })

  test('empty array', () => {
    const diffRes = jsonModify.to([], [])

    expect(diffRes).toBeUndefined()
  })

  test('same array', () => {
    const diffRes = jsonModify.to(
      [1, 'a', true, null, undefined],
      [1, 'a', true, null, undefined],
    )

    expect(diffRes).toBeUndefined()
  })

  test('complex array', () => {
    const diffRes = jsonModify.to(
      [1, 'a', true, null, undefined, 'abc'],
      [1, 'ab', false, null, undefined],
    )

    expect(diffRes).toMatchObject({
      r: [
        {
          p: [1],
          v: 'a',
        },
        {
          p: [2],
          v: true,
        },
      ],
      a: [
        {
          p: [5],
          v: 'abc',
        },
      ],
    })

    const diffRes2 = jsonModify.to(
      [1, 'a', true, null, undefined],
      [1, 'a', true, null, undefined, 'abc'],
    )

    expect(diffRes2).toMatchObject({
      d: [
        {
          p: [5],
        },
      ],
    })
  })
})

describe('object value', () => {
  const jsonModify = new JsonModify()

  test('object and null', () => {
    const diffRes = jsonModify.to({}, null)

    expect(diffRes).toMatchObject({
      r: [
        {
          p: [],
          v: {},
        },
      ],
    })

    const diffRes1 = jsonModify.to(null, {})

    expect(diffRes1).toMatchObject({
      r: [
        {
          p: [],
          v: null,
        },
      ],
    })
  })

  test('empty object', () => {
    const diffRes = jsonModify.to({}, {})

    expect(diffRes).toBeUndefined()
  })

  test('same object', () => {
    const diffRes = jsonModify.to(
      {
        a: 1,
        b: 'a',
        c: true,
        d: null,
        e: [],
        f: {},
        g: undefined,
      },
      {
        a: 1,
        b: 'a',
        c: true,
        d: null,
        e: [],
        f: {},
        g: undefined,
      },
    )

    expect(diffRes).toBeUndefined()
  })

  test('complex object', () => {
    const diffRes = jsonModify.to(
      {
        a: 1,
        b: 'a',
        c: false,
        e: [],
        g: 100,
      },
      {
        a: 1,
        b: 'abc',
        c: true,
        e: [],
        f: {},
      },
    )

    expect(diffRes).toMatchObject({
      r: [
        {
          p: ['b'],
          v: 'a',
        },
        {
          p: ['c'],
          v: false,
        },
        {
          p: ['g'],
          v: 100,
        },
      ],
      d: [
        {
          p: ['f'],
        },
      ],
    })
  })
})

describe('comprehensive', () => {
  const jsonModify = new JsonModify()

  test('test comprehensive', () => {
    const diffRes = jsonModify.to(
      {
        a: [[10, 'a', 'c'], [{ a: 1, b: true }], []],
        b: {
          c: [{ e: '10' }],
          d: 10,
          e: false,
        },
        e: {
          a: 10,
        },
      },
      {
        a: [[10, 'ab'], [{ a: 1, c: true }]],
        b: {
          c: [{ e: '10' }, { c: null }],
          d: 13,
        },
        f: {
          e: 100,
        },
      },
    )

    expect(diffRes?.a).toMatchObject([
      {
        p: ['a', 0, 2],
        v: 'c',
      },
      {
        p: ['a', 2],
        v: [],
      },
    ])
    expect(diffRes?.r).toMatchObject([
      {
        p: ['a', 0, 1],
        v: 'a',
      },
      {
        p: ['a', 1, 0, 'b'],
        v: true,
      },
      {
        p: ['b', 'd'],
        v: 10,
      },
      {
        p: ['b', 'e'],
        v: false,
      },
      {
        p: ['e'],
        v: {
          a: 10,
        },
      },
    ])
    expect(diffRes?.d).toMatchObject([
      {
        p: ['a', 1, 0, 'c'],
      },
      {
        p: ['b', 'c', 1],
      },
      {
        p: ['f'],
      },
    ])
  })
})
