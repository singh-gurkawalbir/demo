/* global describe, test, expect */
import metadata from './javascript';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import JavaScriptPanel from '../Editor/panels/JavaScript';

describe('javascript metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('javascript');
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual('Run JavaScript safely in a secure runtime environment.');
    expect(label).toEqual('Script editor');

    const javascriptPanel = panels.find(p => p.title === 'Script');
    const dataPanel = panels.find(p => p.title === 'Function input');
    const resultPanel = panels.find(p => p.title === 'Function output');

    expect(javascriptPanel.Panel).toEqual(JavaScriptPanel);
    expect(dataPanel.Panel).toEqual(DataPanel);
    expect(resultPanel.Panel).toEqual(ResultPanel);
    expect(resultPanel.props({}).mode).toEqual('json');
    expect(resultPanel.props({resultMode: 'mode'}).mode).toEqual('mode');
  });
});
