
import metadata from './settingsForm';

describe('settingsForm metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toBe('settingsForm');
    expect(fieldId).toBe('settingsForm');
    expect(description).toBe('Construct a form from metadata');
    expect(label).toBe('Form builder');

    let settingsFormPanels = panels({});

    expect(settingsFormPanels).toHaveLength(3);
    expect(settingsFormPanels.find(p => p.area === 'meta').title({})).toBe('Form definition');
    expect(settingsFormPanels.find(p => p.area === 'meta').title({activeProcessor: 'script'})).toBe('Script input');

    settingsFormPanels = panels({activeProcessor: 'script'});
    expect(settingsFormPanels).toHaveLength(4);
    expect(settingsFormPanels.find(p => p.area === 'hook').title).toBe('Script');
  });
});
