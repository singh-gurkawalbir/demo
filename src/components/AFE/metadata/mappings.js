import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import MappingsPanel from '../Editor/panels/Mappings';
import Mapper2Guide from '../Drawer/actions/Mapper2Guide';
import ToggleMapperVersion from '../Drawer/actions/ToggleMapperVersion';

export default {
  type: 'mappings',
  description: 'Maps source fields to destination',
  helpKey: 'afe.import.mapping',
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
    actions: [
      { component: ToggleMapperVersion,
        position: 'left',
      },
      { component: Mapper2Guide, position: 'right' },
    ],
  },
};
