
import React from 'react';
import metadata from './csvParser';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import CsvParseRules from '../Editor/panels/CsvParseRules';
import FileDataPanelTitle from '../Editor/actions/FileDataPanelTitle';

describe('csvParser metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toBe('csvParser');
    expect(fieldId).toBe('file.csv');
    expect(description).toBe('Converts delimited data into JSON');
    expect(label).toBe('CSV parser helper');

    const csvParserRules = panels.find(p => p.title === 'CSV parser options');
    const resultPanel = panels.find(p => p.title === 'Parsed output');
    const dataPanel = panels.find(p => p.area === 'data');
    const dataPanelTitle = dataPanel.title({editorId: '_editorId'});

    expect(dataPanelTitle).toEqual(<FileDataPanelTitle editorId="_editorId" fileType="csv" />);
    expect(dataPanel.Panel).toEqual(DataPanel);
    expect(csvParserRules.Panel).toEqual(CsvParseRules);
    expect(resultPanel.Panel).toEqual(ResultPanel);
  });
});
