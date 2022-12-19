/* global describe, test, expect */
import metadata from './router';

describe('router metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('router');
    expect(fieldId).toEqual('router');
    expect(description).toEqual('Configure branches and conditions');
    expect(label).toEqual('Add branching');

    let routerPanels = panels({});

    expect(routerPanels).toHaveLength(3);
    expect(routerPanels.find(p => p.area === 'values').title).toEqual('Output');
    expect(routerPanels.find(p => p.area === 'form').title).toEqual('Input');

    routerPanels = panels({activeProcessor: 'javascript'});
    expect(routerPanels).toHaveLength(4);
    expect(routerPanels.find(p => p.area === 'values').title).toEqual('Function output');
    expect(routerPanels.find(p => p.area === 'form').title).toEqual('Function input');
    expect(routerPanels.find(p => p.area === 'hook').title).toEqual('Branch conditions script');
  });
});
