/* global describe, test, expect */
import metadata from './responseMappings';
import ResponseMappingsPanel from '../Editor/panels/Mappings/ResponseMappings';

describe('responseMappings metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, description, label, helpKey, panels} = metadata;

    expect(type).toEqual('responseMappings');
    expect(description).toEqual('Maps source fields to next step');
    expect(label).toEqual(undefined);
    expect(helpKey({})).toEqual('import.response.mapping');
    expect(helpKey({resourceType: 'exports'})).toEqual('lookup.response.mapping');
    const responseMappingsPanel = panels.find(p => p.title === 'Rules');
    const inputPanel = panels.find(p => p.title === 'Input');
    const outputPanel = panels.find(p => p.title === 'Output');

    expect(responseMappingsPanel.Panel).toEqual(ResponseMappingsPanel);
    expect(inputPanel.helpKey({})).toEqual('afe.lookupMappings.input');
    expect(inputPanel.helpKey({resourceType: 'imports'})).toEqual('afe.responseMappings.input');
    expect(outputPanel.helpKey({})).toEqual('afe.lookupMappings.output');
    expect(outputPanel.helpKey({resourceType: 'imports'})).toEqual('afe.responseMappings.output');
  });
});
