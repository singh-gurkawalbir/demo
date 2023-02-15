import defaultRef from './metadata';

describe('metadata agents test cases', () => {
  test('should pass the initial render with default value', () => {
    const columns = defaultRef.useColumns();

    const value1Ref = columns[0].Value({
      rowData: {
        type: 'accesstokens',
      },
    });

    expect(value1Ref).toBe('API token');

    const value2Ref = columns[1].Value({
      rowData: {
        name: 'name',
      },
    });

    expect(value2Ref).toBe('name');

    const value2Ref1 = columns[1].Value({
      rowData: {
        _id: 'id_1',
      },
    });

    expect(value2Ref1).toBe('id_1');
  });
});
