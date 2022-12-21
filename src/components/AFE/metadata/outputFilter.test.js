/* global describe, test, expect */
import metadata from './outputFilter';
import filterMetadata from './filter';
import javascriptMetadata from './javascript';

describe('outputFilter metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;
    let outputFilterPanelType = panels({activeProcessor: 'javascript'});

    expect(type).toEqual('outputFilter');
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual('Filters data for PP');
    expect(label).toEqual('Define output filter');
    expect(outputFilterPanelType).toEqual(javascriptMetadata.panels);
    outputFilterPanelType = panels({});
    expect(outputFilterPanelType).toEqual(filterMetadata.panels);
  });
});
