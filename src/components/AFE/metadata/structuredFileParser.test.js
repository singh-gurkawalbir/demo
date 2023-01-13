
import metadata from './structuredFileParser';
import DataPanel from '../Editor/panels/Data';
import RulePanel from '../Editor/panels/Rule';
import ResultPanel from '../Editor/panels/Result';

describe('structuredFileParser metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toBe('structuredFileParser');
    expect(fieldId).toBeUndefined();
    expect(description).toBe('Transforms raw data to desired structure');
    expect(label).toBe('File parser helper');

    const structuredFileParserRules = panels.find(p => p.title === 'Type your file definition rules here');
    const resultPanel = panels.find(p => p.title === 'Parsed output');
    const dataPanel = panels.find(p => p.title === 'Sample file');

    expect(dataPanel.Panel).toEqual(DataPanel);
    expect(structuredFileParserRules.Panel).toEqual(RulePanel);
    expect(resultPanel.Panel).toEqual(ResultPanel);
  });
});
