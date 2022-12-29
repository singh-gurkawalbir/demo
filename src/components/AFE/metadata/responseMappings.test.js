
import metadata from './responseMappings';
import ResponseMappingsPanel from '../Editor/panels/Mappings/ResponseMappings';

describe('responseMappings metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, description, label, helpKey, panels} = metadata;

    expect(type).toBe('responseMappings');
    expect(description).toBe('Maps source fields to next step');
    expect(label).toBeUndefined();
    expect(helpKey({})).toBe('import.response.mapping');
    expect(helpKey({resourceType: 'exports'})).toBe('lookup.response.mapping');
    const responseMappingsPanel = panels.find(p => p.title === 'Rules');
    const inputPanel = panels.find(p => p.title === 'Input');
    const outputPanel = panels.find(p => p.title === 'Output');

    expect(responseMappingsPanel.Panel).toEqual(ResponseMappingsPanel);
    expect(inputPanel.helpKey({})).toBe('afe.lookupMappings.input');
    expect(inputPanel.helpKey({resourceType: 'imports'})).toBe('afe.responseMappings.input');
    expect(outputPanel.helpKey({})).toBe('afe.lookupMappings.output');
    expect(outputPanel.helpKey({resourceType: 'imports'})).toBe('afe.responseMappings.output');
  });
});
