
import salesforceSettings from '.';

describe('getLookupMetadata component Test cases', () => {
  test('should pass the initial render with default values', async () => {
    const response = salesforceSettings.getMetaData({
      value: {},
      importResource: {},
    });

    expect(response.layout.fields).toContain('immutable');
    expect(response.layout.fields).toContain('lookup.sObjectType');
    expect(response.layout.fields).toContain('discardIfEmpty');
    expect(response.layout.type).toBe('collapse');

    const nonExpressionRes = response.optionsHandler('expression12', []);

    expect(nonExpressionRes).toBeNull();

    const fields = [{
      id: 'expression',
      value: 'expressionValue',
    }];

    const expressionRes = response.optionsHandler('expression', [...fields, {
      id: 'extract',
    }, {
      id: 'functions',
    }]);

    expect(expressionRes).toBe('expressionValue');

    const expression1Res = response.optionsHandler('expression', [...fields, {
      id: 'extract',
      value: 'extractValue',
    }]);

    expect(expression1Res).toBe('expressionValue{{extractValue}}');

    const expression2Res = response.optionsHandler('expression', [...fields, {
      id: 'extract',
    }, {
      id: 'functions',
      value: 'functionsValue',
    }]);

    expect(expression2Res).toBe('expressionValuefunctionsValue');

    const expression3Res = response.optionsHandler('expression', [...fields, {
      id: 'extract',
      value: '*.extractValue',
    }]);

    expect(expression3Res).toBe('expressionValue{{*.extractValue}}');

    const expression4Res = response.optionsHandler('expression', [{
      id: 'extract',
      value: ' extractValue',
    }, {
      id: 'expression',
    }]);

    expect(expression4Res).toBe('{{[ extractValue]}}');

    const lookupWhereClauseRes = response.optionsHandler('lookup.whereClause', [{
      id: 'lookup.sObjectType',
      value: 'extractValue',
    }]);

    expect(lookupWhereClauseRes).toBeNull();

    const lookupWhereClause1Res = response.optionsHandler('lookup.whereClause', []);

    expect(lookupWhereClause1Res).toBeNull();

    const textFields = [{
      id: 'lookup.whereClause',
      value: 'whereClauseValue',
    }, {
      id: 'lookup.whereClauseText',
      value: 'whereClauseTextValue',
    }];
    const lookupWhereClauseTextRes = response.optionsHandler('lookup.whereClauseText', textFields);

    expect(textFields).toEqual([{
      id: 'lookup.whereClause',
      value: 'whereClauseValue',
    }, {
      id: 'lookup.whereClauseText',
      value: 'whereClauseValue',
    }]);
    expect(lookupWhereClauseTextRes).toBeNull();

    const resultFields = [
      {
        id: 'lookup.sObjectType',
        value: 'sObjectTypeValue',
      },
      {
        id: 'lookup.resultField',
      },
    ];

    const lookupResultFieldRes = response.optionsHandler('lookup.resultField', resultFields);

    expect(lookupResultFieldRes).toEqual({
      disableFetch: false,
      commMetaPath: 'salesforce/metadata/connections/undefined/sObjectTypes/sObjectTypeValue',
    });

    expect(resultFields).toEqual([
      {
        id: 'lookup.sObjectType',
        value: 'sObjectTypeValue',
      },
      {
        id: 'lookup.resultField',
        savedSObjectType: 'sObjectTypeValue',
        value: '',
      },
    ]);

    const lookupResult1FieldRes = response.optionsHandler('lookup.resultField', [
      {
        id: 'lookup.sObjectType',
        value: 'sObjectTypeValue',
      },
      {
        id: 'lookup.resultField',
        savedSObjectType: 'sObjectTypeValue',
      },
    ]);

    expect(lookupResult1FieldRes).toEqual({
      disableFetch: false,
      commMetaPath: 'salesforce/metadata/connections/undefined/sObjectTypes/sObjectTypeValue',
    });
  });

  const types = ['boolean', 'picklist', 'textarea', 'datetime'];

  types.forEach(eachType =>
    test(`should pass the initial render with custom values ${eachType}`, async () => {
      const response = salesforceSettings.getMetaData({
        value: {
          lookupName: 'name',
          generate: 'generate_id',
          conditional: {},
        },
        importResource: {},
        lookups: [
          {
            name: 'name',
            map: [{
              export: 'export',
              import: 'import',
            }],
          },
        ],
        generateFields: [
          {
            id: 'generate_id',
            type: eachType,
            options: [{id: 1}],
          },
        ],
        extractFields: [{
          name: 'name',
          id: 'id',
        }],
      });

      expect(response.layout.fields).toContain('immutable');
      expect(response.layout.fields).toContain('lookup.sObjectType');
      expect(response.layout.fields).toContain('discardIfEmpty');
      expect(response.layout.type).toBe('collapse');
    })
  );
});
