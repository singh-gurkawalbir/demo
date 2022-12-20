/* global describe, test, expect */
import metadata from './csvGenerator';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import CsvGenerateRules from '../Editor/panels/CsvGenerateRules';

describe('csvGenerator metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('csvGenerator');
    expect(fieldId).toEqual('file.csv');
    expect(description).toEqual('Converts JSON data into delimited file');
    expect(label).toEqual('CSV generator helper');

    const csvGeneratorRules = panels.find(eachPanel => eachPanel.title === 'CSV generator options');
    const dataPanel = panels.find(eachPanel => eachPanel.title === 'Sample flow data');
    const resultPanel = panels.find(eachPanel => eachPanel.title === 'Generated CSV file');

    expect(csvGeneratorRules.Panel).toEqual(CsvGenerateRules);
    expect(dataPanel.Panel).toEqual(DataPanel);
    expect(resultPanel.Panel).toEqual(ResultPanel);
  });
});
