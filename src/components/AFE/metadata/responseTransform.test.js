/* global describe, test, expect */
import metadata from './responseTransform';
import transformMetadata from './transform';
import javascriptMetadata from './javascript';

describe('responseTransform metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;
    let responseTransformPanelType = panels({activeProcessor: 'javascript'});

    expect(type).toEqual('responseTransform');
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual('Transforms raw data to desired structure');
    expect(label).toEqual('Define transformation');
    expect(responseTransformPanelType).toEqual(javascriptMetadata.panels);
    responseTransformPanelType = panels({});
    expect(responseTransformPanelType).toEqual(transformMetadata.panels);
  });
});
