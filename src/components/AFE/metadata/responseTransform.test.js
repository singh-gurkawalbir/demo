
import metadata from './responseTransform';
import transformMetadata from './transform';
import javascriptMetadata from './javascript';

describe('responseTransform metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;
    let responseTransformPanelType = panels({activeProcessor: 'javascript'});

    expect(type).toBe('responseTransform');
    expect(fieldId).toBeUndefined();
    expect(description).toBe('Transforms raw data to desired structure');
    expect(label).toBe('Define transformation');
    expect(responseTransformPanelType).toEqual(javascriptMetadata.panels);
    responseTransformPanelType = panels({});
    expect(responseTransformPanelType).toEqual(transformMetadata.panels);
  });
});
