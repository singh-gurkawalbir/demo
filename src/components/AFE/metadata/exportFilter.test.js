/* global describe, test, expect */
import metadata from './exportFilter';
import filterMetadata from './filter';
import javascriptMetadata from './javascript';

describe('exportFilter metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;
    let exportFilterPanelType = panels({activeProcessor: 'javascript'});

    expect(type).toEqual('exportFilter');
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual('Filters data');
    expect(label).toEqual('Define output filter');
    expect(exportFilterPanelType).toEqual(javascriptMetadata.panels);
    exportFilterPanelType = panels({});
    expect(exportFilterPanelType).toEqual(filterMetadata.panels);
  });
});
