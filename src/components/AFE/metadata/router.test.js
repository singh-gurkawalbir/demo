
import metadata from './router';

describe('router metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toBe('router');
    expect(fieldId).toBe('router');
    expect(description).toBe('Configure branches and conditions');
    expect(label).toBe('Add branching');

    let routerPanels = panels({});

    expect(routerPanels).toHaveLength(3);
    expect(routerPanels.find(p => p.area === 'values').title).toBe('Output');
    expect(routerPanels.find(p => p.area === 'form').title).toBe('Input');

    routerPanels = panels({activeProcessor: 'javascript'});
    expect(routerPanels).toHaveLength(4);
    expect(routerPanels.find(p => p.area === 'values').title).toBe('Function output');
    expect(routerPanels.find(p => p.area === 'form').title).toBe('Function input');
    expect(routerPanels.find(p => p.area === 'hook').title).toBe('Branch conditions script');
  });
});
