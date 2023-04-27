
import defaulty from './netsuite';

describe('getLookupMetadata component Test cases', () => {
  test('should pass the intial render with default values', async () => {
    const response = defaulty.getLookupMetadata({
      staticLookupCommMetaPath: '/',
    });

    expect(response.layout.fields).toContain('_mode');
    expect(response.layout.fields).toContain('_recordType');
    expect(response.layout.fields).toContain('_expression');
    expect(response.layout.fields).toContain('_expressionText');
    expect(response.layout.fields).toContain('_resultField');
    expect(response.layout.fields).toContain('_name');
    expect(response.layout.fields).toContain('_mapList');
  });

  test('should pass the intial render with showDynamicLookupOnly true', async () => {
    const response = defaulty.getLookupMetadata({
      lookup: {
        relativeURI: '',
        map: 'static',
      },
      showDynamicLookupOnly: true,
    });

    expect(response.layout.fields).toContain('_mode');
    expect(response.layout.fields).toContain('_recordType');
    expect(response.layout.fields).toContain('_expression');
    expect(response.layout.fields).toContain('_expressionText');
    expect(response.layout.fields).toContain('_resultField');
    expect(response.layout.fields).toContain('_name');
    expect(response.layout.fields).toContain('_mapList');

    const recordTypeRes = response.optionsHandler('_recordType');

    expect(recordTypeRes).toEqual({
      resourceToFetch: 'recordTypes',
    });

    const fields = [{
      id: '_expression',
      value: 'expression',
    }, {
      id: '_expressionText',
      value: 'expressionText',
    }, {
      id: '_recordType',
      value: 'recordType',
    }, {
      id: '_resultField',
    }];
    const expressionTextRes = response.optionsHandler('_expressionText', fields);

    expect(expressionTextRes).toBeNull();
    expect(fields).toEqual([
      { id: '_expression', value: 'expression' },
      { id: '_expressionText', value: 'expression' },
      { id: '_recordType', value: 'recordType' },
      { id: '_resultField' },
    ]);

    const expressionRes = response.optionsHandler('_expression', fields);

    expect(expressionRes).toBeNull();
    const expressionRes1 = response.optionsHandler('_expression', []);

    expect(expressionRes1).toBeNull();
    const resultFieldRes = response.optionsHandler('_resultField', fields);

    expect(resultFieldRes).toEqual({
      disableFetch: false,
      commMetaPath: 'netsuite/metadata/suitescript/connections/undefined/recordTypes/recordType/searchColumns',
    });

    const resultFieldRes1 = response.optionsHandler('_resultField', [
      {
        id: '_resultField',
        savedRecordType: 'recordType',
      }, {
        id: '_recordType',
        value: 'recordType',
      },
    ]);

    expect(resultFieldRes1).toEqual({
      disableFetch: false,
      commMetaPath: 'netsuite/metadata/suitescript/connections/undefined/recordTypes/recordType/searchColumns',
    });

    const dummyRes = response.optionsHandler('_resultData', fields);

    expect(dummyRes).toBeNull();
  });
});
