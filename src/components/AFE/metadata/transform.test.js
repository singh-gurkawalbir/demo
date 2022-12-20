/* global describe, test, expect */
import metadata from './transform';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import TransformPanel from '../Editor/panels/Transform';

describe('transform metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('transform');
    expect(fieldId).toEqual('transform');
    expect(description).toEqual('Transforms raw data to desired structure');
    expect(label).toEqual('Transform editor');

    const transformRules = panels.find(p => p.title === 'Rules');
    const resultPanel = panels.find(p => p.title === 'Output');
    const dataPanel = panels.find(p => p.title === 'Input');

    expect(dataPanel.Panel).toEqual(DataPanel);
    expect(transformRules.Panel).toEqual(TransformPanel);
    expect(resultPanel.Panel).toEqual(ResultPanel);
  });
});
