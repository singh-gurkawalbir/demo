
import metadata from './outputFilter';
import filterMetadata from './filter';
import javascriptMetadata from './javascript';

describe('outputFilter metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;
    let outputFilterPanelType = panels({activeProcessor: 'javascript'});

    expect(type).toBe('outputFilter');
    expect(fieldId).toBeUndefined();
    expect(description).toBe('Filters data for PP');
    expect(label).toBe('Define output filter');
    expect(outputFilterPanelType).toEqual(javascriptMetadata.panels);
    outputFilterPanelType = panels({});
    expect(outputFilterPanelType).toEqual(filterMetadata.panels);
  });
});
