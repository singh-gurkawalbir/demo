import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import ResponseMappingsPanel from '../Editor/panels/Mappings/ResponseMappings';

export default {
  type: 'responseMappings',
  description: 'Maps source fields to next step',
  helpKey: ({resourceType}) => resourceType === 'exports' ? 'lookup.response.mapping' : 'import.response.mapping',
  panels: [
    {
      title: 'Rules',
      area: 'rule',
      isLoggable: true,
      Panel: ResponseMappingsPanel,
    },
    {
      title: 'Input',
      area: 'data',
      Panel: DataPanel,
      helpKey: ({resourceType}) => resourceType === 'imports' ? 'afe.responseMappings.input' : 'afe.lookupMappings.input',
      props: {
        mode: 'json',
      },
    },
    {
      title: 'Output',
      area: 'result',
      Panel: ResultPanel,
      helpKey: ({resourceType}) => resourceType === 'imports' ? 'afe.responseMappings.output' : 'afe.lookupMappings.output',
      props: {
        mode: 'json',
      },
    },
  ],
  drawer: {
    showLayoutToggle: true,
  },
};
