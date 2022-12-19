/* global describe, test, expect */
import metadata from './postResponseMapHook';
import javascriptMetadata from './javascript';

describe('postResponseMapHook metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('postResponseMapHook');
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual('Run JavaScript safely in a secure runtime environment.');
    expect(label).toEqual('Script editor');
    expect(panels()).toEqual(javascriptMetadata.panels);
  });
});
