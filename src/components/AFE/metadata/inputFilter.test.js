
import metadata from './inputFilter';
import filterMetadata from './filter';
import javascriptMetadata from './javascript';

describe('inputFilter metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;
    let inputFilterPanelType = panels({activeProcessor: 'javascript'});

    expect(type).toBe('inputFilter');
    expect(fieldId).toBeUndefined();
    expect(description).toBe('Filters data for PP');
    expect(label).toBe('Define input filter');
    expect(inputFilterPanelType).toEqual(javascriptMetadata.panels);
    inputFilterPanelType = panels({});
    expect(inputFilterPanelType).toEqual(filterMetadata.panels);
  });
});
