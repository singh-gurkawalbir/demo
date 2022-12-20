/* global describe, test, expect */
import metadata from './settingsForm';

describe('settingsForm metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('settingsForm');
    expect(fieldId).toEqual('settingsForm');
    expect(description).toEqual('Construct a form from metadata');
    expect(label).toEqual('Form builder');

    let settingsFormPanels = panels({});

    expect(settingsFormPanels).toHaveLength(3);
    expect(settingsFormPanels.find(p => p.area === 'meta').title({})).toEqual('Form definition');
    expect(settingsFormPanels.find(p => p.area === 'meta').title({activeProcessor: 'script'})).toEqual('Script input');

    settingsFormPanels = panels({activeProcessor: 'script'});
    expect(settingsFormPanels).toHaveLength(4);
    expect(settingsFormPanels.find(p => p.area === 'hook').title).toEqual('Script');
  });
});
