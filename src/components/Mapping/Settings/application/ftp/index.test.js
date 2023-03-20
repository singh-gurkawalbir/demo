
import ftpSettings from '.';

describe('getLookupMetadata component Test cases', () => {
  test('should pass the initial render with default values', async () => {
    const response = ftpSettings.getMetaData({
      value: {},
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).not.toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
  });

  test('should pass the initial render with extract values', async () => {
    const response = ftpSettings.getMetaData({
      value: {
        lookupName: 'Test_name_1',
        conditional: {
          when: '',
        },
      },
      lookups: [{
        name: 'Test_name_1',
        map: {
          exportValue: 'import_value',
        },
      }],
      extractFields: [{
        name: ' name_1',
        id: 'id_1',
      }],
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).not.toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
  });

  test('should pass the initial render with FTPImport importResource', async () => {
    const response = ftpSettings.getMetaData({
      value: {
        lookupName: 'Test_name_1',
        generate: 'test_generate',
      },
      lookups: [{
        name: 'Test_name_1',
      }],
      extractFields: [{
        name: ' name_1',
        id: 'id_1',
      }],
      isGroupedSampleData: true,
      importResource: {
        file: {
          type: 'xlsx', // xlsx, csv
        },
        adaptorType: 'FTPImport', // FTPImport, FTPExport, S3Export, S3Import
      },
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
  });

  test('should pass the initial render with NetSuiteImport importResource', async () => {
    const response = ftpSettings.getMetaData({
      value: {
        lookupName: 'Test_name_1',
        generate: 'test_generate',
      },
      lookups: [{
        name: 'Test_name_1',
      }],
      extractFields: [{
        name: ' name_1',
        id: 'id_1',
      }],
      isGroupedSampleData: true,
      importResource: {
        file: {
          type: 'xlsx', // xlsx, csv
        },
        adaptorType: 'NetSuiteImport', // FTPImport, FTPExport, S3Export, S3Import
      },
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
  });
});
