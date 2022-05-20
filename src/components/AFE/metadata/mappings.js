import React from 'react';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import MappingsPanel from '../Editor/panels/Mappings';
import Mapper2Guide from '../Drawer/actions/Mapper2Guide';
import ToggleMapperVersion from '../Drawer/actions/ToggleMapperVersion';
import InputOutputTitle from '../Editor/actions/Mappings/InputOutputTitle';
import MapperPanelTitle from '../Editor/actions/Mappings/MapperPanelTitle';
import AssistantPanel from '../Editor/panels/Mappings/Assistant/Panel';

export default {
  type: 'mappings',
  description: 'Maps source fields to destination',
  helpKey: 'afe.import.mapping',
  panels: ({layout, mappingPreviewType}) => {
    const panels = [
      {
        title: ({editorId}) => <MapperPanelTitle editorId={editorId} title="Rules" helpKey="afe.mappings.v2.rule" />,
        area: 'rule',
        isLoggable: true,
        Panel: MappingsPanel,
      },
    ];

    if (!!mappingPreviewType && ['assistantRight', 'assistantTopRight'].includes(layout)) {
      panels.push(
        {
          title: `${mappingPreviewType === 'netsuite' ? 'NetSuite' : 'Salesforce'} mapping assistant`,
          area: 'assistant',
          Panel: AssistantPanel,
          helpKey: `${mappingPreviewType === 'netsuite' ? 'afe.mappings.netsuite.assistant' : 'afe.mappings.salesforce.assistant'}`,
        },
      );
    }

    if (!mappingPreviewType || layout !== 'assistantRight') {
      panels.push(
        {
          title: ({editorId}) => <InputOutputTitle editorId={editorId} title="Input" helpKey="afe.mappings.input" />,
          area: 'data',
          Panel: DataPanel,
          props: {
            mode: 'json',
          },
        },
        {
          title: ({editorId}) => <InputOutputTitle editorId={editorId} title="Output" helpKey="afe.mappings.output" />,
          area: 'result',
          Panel: ResultPanel,
          props: {
            mode: 'json',
          },
        }
      );
    }

    return panels;
  },
  drawer: {
    showLayoutToggle: true,
    actions: [
      { component: ToggleMapperVersion,
        position: 'left',
      },
      { component: Mapper2Guide, position: 'right' },
    ],
  },
};
