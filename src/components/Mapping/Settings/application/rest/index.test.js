
import restSettings from '.';

describe('getLookupMetadata component Test cases', () => {
  test('should pass the initial render with default values', async () => {
    const response = restSettings.getMetaData({ });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).not.toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
    expect(response.layout.type).toBe('collapse');
    const lookupBody = response.fieldMap['lookup.body'];

    lookupBody.connectionId({
      _connectionId: '_id',
    });

    const nonExpressionRes = response.optionsHandler('expression12', []);

    expect(nonExpressionRes).toBeNull();

    const lookuprelativeURIRes = response.optionsHandler('lookup.relativeURI', []);

    expect(lookuprelativeURIRes).toEqual({});
  });

  test('should pass the initial render with HTTPImport adaptor', async () => {
    const response = restSettings.getMetaData({
      value: {
        generate: '[*].',
        lookupName: 'name',
      },
      importResource: {
        http: {
          method: 'GET',
        },
        adaptorType: 'HTTPImport',
      },
      lookups: [{
        name: 'name',
        map: [{
          export: 'exports',
          import: 'imports',
        }],
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
    expect(response.layout.type).toBe('collapse');
  });

  test('should pass the initial render with RESTImport adaptor', async () => {
    const response = restSettings.getMetaData({
      value: {
        generate: '[*].',
        lookupName: 'name',
        conditional: {

        },
      },
      importResource: {
        http: {
          method: 'GET',
        },
        adaptorType: 'RESTImport',
      },
      lookups: [{
        name: 'name',
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
    expect(response.layout.type).toBe('collapse');
  });
});
