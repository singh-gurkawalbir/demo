import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import MappingsPanel from '../Editor/panels/Mappings';
import PreviewPanel from '../Editor/panels/Mappings/Preview/Panel';

export default {
  type: 'mappings',
  description: 'Maps source fields to destination',
  helpKey: 'afe.import.mapping',
  panels: ({layout, mappingPreviewType}) => {
    const panels = [
      {
        title: 'Rules',
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
          isLoggable: true,
          Panel: PreviewPanel,
          helpKey: `${mappingPreviewType === 'netsuite' ? 'afe.mappings.netsuite.assistant' : 'afe.mappings.salesforce.assistant'}`,
        },
      );
    }

    if (!mappingPreviewType || layout !== 'assistantRight') {
      panels.push(
        {
          title: 'Input',
          area: 'data',
          Panel: DataPanel,
          helpKey: 'afe.mappings.input',
          props: {
            mode: 'json',
          },
        },
        {
          title: 'Output',
          area: 'result',
          Panel: ResultPanel,
          helpKey: 'afe.mappings.output',
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
  },
};
