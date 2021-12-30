import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import MappingsPanel from '../Editor/panels/Mappings';

export default {
  type: 'mappings',
  description: 'Maps source fields to destination',
  panels: [
    {
      title: 'Rules',
      area: 'rule',
      isLoggable: true,
      Panel: MappingsPanel,
    },
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
    },
  ],
  drawer: {
    showLayoutToggle: true,
  },
};
