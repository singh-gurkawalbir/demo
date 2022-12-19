/* global describe, test, expect */
import React from 'react';
import metadata from './xmlParser';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import XmlParseRules from '../Editor/panels/XmlParseRules';
import FileDataPanelTitle from '../Editor/actions/FileDataPanelTitle';

describe('xmlParser metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('xmlParser');
    expect(fieldId).toEqual('file.xml');
    expect(description).toEqual('Converts XML data into JSON');
    expect(label).toEqual('XML parser helper');

    const xmlParserRules = panels.find(p => p.title === 'XML parse options');
    const resultPanel = panels.find(p => p.title === 'Parsed output');
    const dataPanel = panels.find(p => p.area === 'data');
    const dataPanelTitle = dataPanel.title({editorId: '_editorId'});

    expect(dataPanelTitle).toEqual(<FileDataPanelTitle editorId="_editorId" fileType="xml" />);
    expect(dataPanel.Panel).toEqual(DataPanel);
    expect(xmlParserRules.Panel).toEqual(XmlParseRules);
    expect(resultPanel.Panel).toEqual(ResultPanel);
  });
});
