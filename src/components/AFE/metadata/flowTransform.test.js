/* global describe, test, expect */
import metadata from './flowTransform';
import transformMetadata from './transform';
import javascriptMetadata from './javascript';

describe('flowTransform metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;
    let flowTransformPanelType = panels({activeProcessor: 'javascript'});

    expect(type).toEqual('flowTransform');
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual('Transforms raw data to desired structure');
    expect(label).toEqual('Define transformation');
    expect(flowTransformPanelType).toEqual(javascriptMetadata.panels);
    flowTransformPanelType = panels({});
    expect(flowTransformPanelType).toEqual(transformMetadata.panels);
  });
});
