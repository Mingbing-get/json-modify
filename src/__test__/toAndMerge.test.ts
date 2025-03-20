import JsonModify from '../jsonModify'

describe('toAndMerge', () => {
  const jsonModify = new JsonModify()

  test('example', () => {
    const beforeData = {
      node_2f11fiiu8_nkrkad865i: {
        label: '创建记录',
        name: 'node_2f11fiiu8_nkrkad865i',
        type: 'createData',
        nextNodeName: 'end',
        params: {
          modalName: 'test_OXSgjkrPReEJMAj',
          fieldValue: [
            {
              id: 'assign_modal_field_1b6sb4i6b_m2sqdwbwel',
              valueList: [
                {
                  id: 'single_record_41dql1euc_xfcmvnixa5',
                  fieldName: 'test_thtVkEQgVeggmxB',
                  value: 'aaaa',
                },
              ],
            },
          ],
          useField: true,
        },
        result: {
          records: {
            type: 'multipleLookup',
            label: '记录列表',
            apiName: 'records',
            modalName: 'test_OXSgjkrPReEJMAj',
          },
        },
      },
    }
    const afterData = {
      node_2f11fiiu8_nkrkad865i: {
        label: '新建记录',
        name: 'node_2f11fiiu8_nkrkad865i',
        type: 'createData',
        nextNodeName: 'end',
        params: {
          modalName: 'test_OXSgjkrPReEJMAj',
          fieldValue: [
            {
              id: 'assign_modal_field_1b6sb4i6b_m2sqdwbwel',
              valueList: [
                {
                  id: 'single_record_41dql1euc_xfcmvnixa5',
                  fieldName: 'test_thtVkEQgVeggmxB',
                  value: 'aaaa',
                },
                {
                  id: 'single_record_1qfcw6h8e_n8vpezdevyc',
                  fieldName: 'test_xUmyhMuyspZhvXL',
                  value: '2024-11-21',
                },
              ],
            },
          ],
          useField: true,
        },
        result: {
          records: {
            type: 'multipleLookup',
            label: '记录列表',
            apiName: 'records',
            modalName: 'test_OXSgjkrPReEJMAj',
          },
        },
      },
    }

    const diff = jsonModify.to(beforeData, afterData)

    if (!diff) {
      console.log('before and after are equal')
      return
    }

    const mergeData = jsonModify.merge(afterData, diff)
    expect(mergeData).toEqual(beforeData)
  })
})
