
import defaulty from './rdbms';

describe('getLookupMetadata component Test cases', () => {
  test('should pass the intial render with default values', async () => {
    const response = defaulty.getLookupMetadata({
      lookup: {
        relativeURI: '',
        map: 'static',
        allowFailures: true,
      },
    });

    expect(response.layout.fields).toContain('_mode');
    expect(response.layout.fields).toContain('_query');
    expect(response.layout.fields).toContain('_extract');
    expect(response.layout.fields).toContain('_mapList');
    expect(response.layout.fields).toContain('_name');
    expect(response.layout.fields).toContain('_failRecord');
    expect(response.layout.fields).toContain('_default');
  });

  test('should pass the intial render with showDynamicLookupOnly true', async () => {
    const response = defaulty.getLookupMetadata({
      lookup: {
        relativeURI: '',
      },
      showDynamicLookupOnly: true,
    });

    expect(response.layout.fields).toContain('_query');
    expect(response.layout.fields).toContain('_extract');
    expect(response.layout.fields).toContain('_name');
    expect(response.layout.fields).toContain('_failRecord');
    expect(response.layout.fields).toContain('_default');

    expect(response.layout.fields).not.toContain('_mode');
    expect(response.layout.fields).not.toContain('_mapList');
  });
});
