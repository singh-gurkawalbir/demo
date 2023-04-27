
import rdbmsSettings from '.';

describe('getLookupMetadata component Test cases', () => {
  test('should pass the initial render with default values', async () => {
    const response = rdbmsSettings.getMetaData({});

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).not.toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
    expect(response.layout.type).toBe('collapse');
  });

  test('should pass the initial render with custom values', async () => {
    const response = rdbmsSettings.getMetaData({
      value: {
        generate: '[*].',
      },
      extractFields: [{
        name: 'name',
        id: 'id',
      }],
      hasLookUpOption: true,
      isGroupedSampleData: true,
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
    expect(response.layout.type).toBe('collapse');
  });

  test('should pass the initial render with out isGroupedSampleData', async () => {
    const response = rdbmsSettings.getMetaData({
      value: {
        generate: '[*].',
      },
      extractFields: [],
      hasLookUpOption: true,
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).not.toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
    expect(response.layout.type).toBe('collapse');
  });
});
