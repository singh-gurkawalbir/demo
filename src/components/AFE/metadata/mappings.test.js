/* global describe, test, expect */
import React from 'react';
import metadata from './mappings';
import InputOutputTitle from '../Editor/actions/Mappings/InputOutputTitle';
import MappingAssistantTitle from '../Editor/actions/Mappings/MappingAssistantTitle';
import MapperPanelTitle from '../Editor/actions/Mappings/MapperPanelTitle';

describe('mappings metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels: mappingPanel} = metadata;

    expect(type).toEqual('mappings');
    expect(label).toEqual(undefined);
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual('Maps source fields to destination');
    let panels = mappingPanel({mappingPreviewType: 'previewTpe', layout: 'assistantTopRight'});

    expect(panels.length).toEqual(4);

    const dataPanel = panels.find(p => p.area === 'data');
    const resultPanel = panels.find(p => p.area === 'result');
    const assistantPanel = panels.find(p => p.area === 'assistant');
    const mappingsPanel = panels.find(p => p.area === 'rule');

    expect(dataPanel.title({editorId: '_editorId'})).toEqual(<InputOutputTitle editorId="_editorId" title="Input" helpKey="afe.mappings.input" />);
    expect(resultPanel.title({editorId: '_editorId'})).toEqual(<InputOutputTitle editorId="_editorId" title="Output" helpKey="afe.mappings.output" />);
    expect(assistantPanel.title({editorId: '_editorId'})).toEqual(<MappingAssistantTitle editorId="_editorId" />);
    expect(mappingsPanel.title({editorId: '_editorId'})).toEqual(<MapperPanelTitle editorId="_editorId" title="Rules" helpKey="afe.mappings.v2.rule" />);
    panels = mappingPanel({mappingPreviewType: 'previewType', layout: 'assistantRight'});
    expect(panels.length).toEqual(2);

    panels = mappingPanel({});
    expect(panels.length).toEqual(3);
  });
});
