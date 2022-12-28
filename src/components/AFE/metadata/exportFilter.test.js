
import metadata from './exportFilter';
import filterMetadata from './filter';
import javascriptMetadata from './javascript';

describe('exportFilter metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;
    let exportFilterPanelType = panels({activeProcessor: 'javascript'});

    expect(type).toBe('exportFilter');
    expect(fieldId).toBeUndefined();
    expect(description).toBe('Filters data');
    expect(label).toBe('Define output filter');
    expect(exportFilterPanelType).toEqual(javascriptMetadata.panels);
    exportFilterPanelType = panels({});
    expect(exportFilterPanelType).toEqual(filterMetadata.panels);
  });
});
