
import netsuiteSettings from '.';

describe('getLookupMetadata component Test cases', () => {
  test('should pass the initial render with default values', async () => {
    const response = netsuiteSettings.getMetaData({
      value: {},
      importResource: {},
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).not.toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
    const nonExpressionRes = response.optionsHandler('expression12', []);

    expect(nonExpressionRes).toBeNull();

    const lookupActionRes = response.optionsHandler('lookupAction', [{
      id: 'lookup.mode',
      value: 'dynamic',
    }]);

    expect(lookupActionRes).toEqual([{items: [
      {label: 'Fail record', value: 'disallowFailure'},
      {label: 'Use default on multiple matches', value: 'useDefaultOnMultipleMatches'},
      {label: 'Use empty string as default value', value: 'useEmptyString'},
      {label: 'Use null as default value', value: 'useNull'},
      {label: 'Use custom default value', value: 'default'}]},
    ]);
    const lookupAction1Res = response.optionsHandler('lookupAction', [{
      id: 'lookup.mode',
      value: 'static',
    }]);

    expect(lookupAction1Res).toEqual([{items: [
      {label: 'Fail record', value: 'disallowFailure'},
      {label: 'Use empty string as default value', value: 'useEmptyString'},
      {label: 'Use null as default value', value: 'useNull'},
      {label: 'Use custom default value', value: 'default'}]},
    ]);

    const lookupRecordTypeRes = response.optionsHandler('lookup.recordType');

    expect(lookupRecordTypeRes).toEqual({
      resourceToFetch: 'recordTypes',
    });

    const lookupFields = [{
      id: 'lookup.expression',
      value: 'expressionValue',
    }, {
      id: 'lookup.expressionText',
    }];

    const lookupExpressionTextRes = response.optionsHandler('lookup.expressionText', lookupFields);

    expect(lookupExpressionTextRes).toBeNull();
    expect(lookupFields).toEqual([{
      id: 'lookup.expression',
      value: 'expressionValue',
    }, {
      id: 'lookup.expressionText',
      value: 'expressionValue',
    }]);

    const lookupExpressionRes = response.optionsHandler('lookup.expression', [{
      id: 'lookup.recordType',
      value: 'recordTypeValue',
    }]);

    expect(lookupExpressionRes).toBeNull();
    const lookupExpression1Res = response.optionsHandler('lookup.expression', []);

    expect(lookupExpression1Res).toBeNull();

    const lookupResultFieldRes = response.optionsHandler('lookup.resultField', [{
      id: 'lookup.recordType',
      value: 'recordTypeValue',
    }, {
      id: 'lookup.resultField',
      savedRecordType: '',
    }]);

    expect(lookupResultFieldRes).toEqual({
      disableFetch: false,
      commMetaPath: 'netsuite/metadata/suitescript/connections/undefined/recordTypes/recordTypeValue/searchColumns',
    });

    const lookupResultField1Res = response.optionsHandler('lookup.resultField', [{
      id: 'lookup.recordType',
      value: 'recordTypeValue',
    }, {
      id: 'lookup.resultField',
      savedRecordType: 'recordTypeValue',
    }]);

    expect(lookupResultField1Res).toEqual({
      disableFetch: false,
      commMetaPath: 'netsuite/metadata/suitescript/connections/undefined/recordTypes/recordTypeValue/searchColumns',
    });
  });

  const types = ['select', 'multiselect', 'checkbox', 'radio', 'date', 'datetimetz'];

  types.forEach(eachType => {
    test(`should pass the initial render with mapping type ${eachType}`, async () => {
      const response = netsuiteSettings.getMetaData({
        value: {
          generate: 'item[*].item.internalid',
        },
        importResource: {},
        generateFields: [{
          id: 'item[*].item.internalid',
          type: eachType,
        }],
        isGroupedSampleData: true,
        extractFields: [{
          name: 'name',
          id: 'id',
        }],
      });

      expect(response.layout.fields).toContain('dataType');
      expect(response.layout.fields).toContain('useFirstRow');
      expect(response.layout.fields).toContain('discardIfEmpty');
    });
  });

  test('should pass the initial render with generate celigo_nlobjAttachedType', async () => {
    const response = netsuiteSettings.getMetaData({
      value: {
        generate: 'celigo_nlobjAttachedType',
      },
      importResource: {},
      generateFields: [{
        id: 'celigo_nlobjAttachedType',
        type: 'select',
      }],
      isGroupedSampleData: true,
      recordType: 'recordTypeValue',
      extractFields: [{
        name: 'name',
        id: 'id',
      }],
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).not.toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
  });

  test('should pass the initial render with recordType & hardcode value', async () => {
    const response = netsuiteSettings.getMetaData({
      value: {
        generate: 'item.internalid',
        lookupName: 'name',
        hardCodedValue: 'test',
      },
      importResource: {},
      generateFields: [{
        id: 'item.internalid',
        type: 'multiselect',
      }],
      lookups: [{
        name: 'name',
      }],
      isGroupedSampleData: true,
      recordType: 'recordTypeValue',
      extractFields: [{
        name: 'name',
        id: 'id',
      }],
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).not.toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
  });

  test('should pass the initial render with recordType & lookup value', async () => {
    const response = netsuiteSettings.getMetaData({
      value: {
        generate: 'item.internalid',
        lookupName: 'name',
        conditional: {
          when: '',
        },
      },
      importResource: {
        netsuite_da: {
          operation: 'addupdate',
        },
      },
      generateFields: [{
        id: 'item.internalid',
        type: 'select',
        sublist: [],
        options: [{id: 1}],
      }],
      lookups: [{
        name: 'name',
        map: [{
          export: 'export',
          import: 'import',
        }],
      }],
      isGroupedSampleData: true,
      recordType: 'recordTypeValue',
      isCategoryMapping: true,
      extractFields: [{
        name: 'name',
        id: 'id',
      }],
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).not.toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
  });
});
