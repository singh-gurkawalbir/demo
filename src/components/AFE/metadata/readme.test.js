
import metadata from './readme';
import RulePanel from '../Editor/panels/Rule';
import ReadmePanel from '../Editor/panels/Readme';

describe('readme metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, description, label, panels} = metadata;

    expect(type).toBe('readme');
    expect(description).toBeUndefined();
    expect(label).toBe('Edit readme');

    const readmeRules = panels.find(p => p.title === 'Data');
    const resultPanel = panels.find(p => p.title === 'Preview');

    expect(readmeRules.Panel).toEqual(RulePanel);
    expect(resultPanel.Panel).toEqual(ReadmePanel);
  });
});
