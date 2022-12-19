/* global describe, test, expect */
import metadata from './structuredFileGenerator';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import RulePanel from '../Editor/panels/Rule';

describe('structuredFileGenerator metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('structuredFileGenerator');
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual('Transforms raw data to desired structure');
    expect(label).toEqual('File generator helper');

    const structuredFileGeneratorRules = panels.find(p => p.title === 'Type your file definition rules here');
    const dataPanel = panels.find(p => p.title === 'Sample flow data');
    const resultPanel = panels.find(p => p.title === 'Generated file');

    expect(structuredFileGeneratorRules.Panel).toEqual(RulePanel);
    expect(dataPanel.Panel).toEqual(DataPanel);
    expect(resultPanel.Panel).toEqual(ResultPanel);
  });
});
