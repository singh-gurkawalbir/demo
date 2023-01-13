
import metadata from './postResponseMapHook';
import javascriptMetadata from './javascript';

describe('postResponseMapHook metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toBe('postResponseMapHook');
    expect(fieldId).toBeUndefined();
    expect(description).toBe('Run JavaScript safely in a secure runtime environment.');
    expect(label).toBe('Script editor');
    expect(panels()).toEqual(javascriptMetadata.panels);
  });
});
