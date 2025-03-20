import JsonModify from '../jsonModify'

describe('simple value', () => {
  const jsonModify = new JsonModify()

  test('null value', () => {
    const mergeRes = jsonModify.merge(null, { a: [{ p: [], v: '10' }] })

    expect(mergeRes).toEqual('10')
  })

  test('undefined value', () => {
    const mergeRes = jsonModify.merge(undefined, {
      r: [{ p: [], v: { num: 10 } }],
    })

    expect(mergeRes).toEqual({ num: 10 })
  })

  test('string value', () => {
    const mergeRes = jsonModify.merge('abc', {
      r: [
        { p: ['a'], v: '12' },
        { p: [], v: '10' },
        { p: [], v: '11' },
      ],
      a: [{ p: [], v: '13' }],
    })

    expect(mergeRes).toEqual('10')
  })
})

describe('array value', () => {
  const jsonModify = new JsonModify()

  test('complex array', () => {
    const mergeRes = jsonModify.merge([1, 'ab', false, null, undefined], {
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

    expect(mergeRes).toMatchObject([1, 'a', true, null, undefined, 'abc'])

    const mergeRes2 = jsonModify.merge([1, 'a', true, null, undefined, 'abc'], {
      d: [
        {
          p: [5],
        },
      ],
    })

    expect(mergeRes2).toMatchObject([1, 'a', true, null, undefined])
  })
})

describe('object value', () => {
  const jsonModify = new JsonModify()

  test('complex object', () => {
    const mergeRes = jsonModify.merge(
      {
        a: 1,
        b: 'abc',
        c: true,
        e: [],
        f: {},
      },
      {
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
      },
    )

    expect(mergeRes).toMatchObject({
      a: 1,
      b: 'a',
      c: false,
      e: [],
      g: 100,
    })
  })
})

describe('comprehensive', () => {
  const jsonModify = new JsonModify()

  test('test comprehensive', () => {
    const mergeRes = jsonModify.merge(
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
      {
        a: [
          {
            p: ['a', 0, 2],
            v: 'c',
          },
          {
            p: ['a', 2],
            v: [],
          },
        ],
        r: [
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
        ],
        d: [
          {
            p: ['a', 1, 0, 'c'],
          },
          {
            p: ['b', 'c', 1],
          },
          {
            p: ['f'],
          },
        ],
      },
    )

    expect(mergeRes).toMatchObject({
      a: [[10, 'a', 'c'], [{ a: 1, b: true }], []],
      b: {
        c: [{ e: '10' }],
        d: 10,
        e: false,
      },
      e: {
        a: 10,
      },
    })
  })
})
