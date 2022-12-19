/* global describe, test, expect */
import metadata from './filter';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import FilterPanel from '../Editor/panels/Filter';

describe('filter metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('filter');
    expect(fieldId).toEqual('transform');
    expect(description).toEqual('Constructs filter rules against raw data');
    expect(label).toEqual('Filter editor');

    const filterPanel = panels.find(eachPanel => eachPanel.title === 'Rules');
    const dataPanel = panels.find(eachPanel => eachPanel.title === 'Input');
    const resultPanel = panels.find(eachPanel => eachPanel.title === 'Output');

    expect(filterPanel.Panel).toEqual(FilterPanel);
    expect(dataPanel.Panel).toEqual(DataPanel);
    expect(resultPanel.Panel).toEqual(ResultPanel);
  });
});
