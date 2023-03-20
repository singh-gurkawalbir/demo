
import defaulty from './salesforce';

describe('getLookupMetadata component Test cases', () => {
  test('should pass the intial render with default values', async () => {
    const response = defaulty.getLookupMetadata({

    });

    expect(response.layout.fields).toContain('_mode');
    expect(response.layout.fields).toContain('_sObjectType');
    expect(response.layout.fields).toContain('_whereClause');
    expect(response.layout.fields).toContain('_whereClauseText');
    expect(response.layout.fields).toContain('_resultField');
    expect(response.layout.fields).toContain('_mapList');
    expect(response.layout.fields).toContain('_name');
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
    expect(response.layout.fields).toContain('_sObjectType');
    expect(response.layout.fields).toContain('_whereClause');
    expect(response.layout.fields).toContain('_whereClauseText');
    expect(response.layout.fields).toContain('_resultField');
    expect(response.layout.fields).toContain('_mapList');
    expect(response.layout.fields).toContain('_name');

    const fields = [
      {
        id: '_sObjectType',
        value: 'sObjectType',
      },
      {
        id: '_whereClause',
        value: 'whereClause',
      },
      {
        id: '_whereClauseText',
        value: 'whereClauseText',
      },
      {
        id: '_resultField',
        savedSObjectType: 'sObjectType',
      },
    ];

    const whereClauseRes = response.optionsHandler('_whereClause', fields);

    expect(whereClauseRes).toBeNull();

    const whereClauseRes1 = response.optionsHandler('_whereClause', []);

    expect(whereClauseRes1).toBeNull();

    const whereClauseTextRes = response.optionsHandler('_whereClauseText', fields);

    expect(whereClauseTextRes).toBeNull();
    expect(fields).toEqual([
      { id: '_sObjectType', value: 'sObjectType' },
      { id: '_whereClause', value: 'whereClause' },
      { id: '_whereClauseText', value: 'whereClause' },
      { id: '_resultField', savedSObjectType: 'sObjectType' },
    ]);

    const resultFieldRes = response.optionsHandler('_resultField', fields);

    expect(resultFieldRes).toEqual({
      disableFetch: false,
      commMetaPath: 'salesforce/metadata/connections/undefined/sObjectTypes/sObjectType',
    });

    const resultFieldRes1 = response.optionsHandler('_resultField', [
      { id: '_sObjectType', value: 'sObjectType' },
      { id: '_resultField'},
    ]);

    expect(resultFieldRes1).toEqual({
      disableFetch: false,
      commMetaPath: 'salesforce/metadata/connections/undefined/sObjectTypes/sObjectType',
    });

    const dummyRes = response.optionsHandler('_resultData', []);

    expect(dummyRes).toBeNull();
  });
});
