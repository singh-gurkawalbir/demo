import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import RulePanel from '../Editor/panels/Rule';

export default {
  type: 'structuredFileGenerator',
  label: 'File generator helper',
  description: 'Transforms raw data to desired structure',
  panels: [
    {
      title: 'Type your file definition rules here',
      area: 'rule',
      Panel: RulePanel,
      props: {
        mode: 'json',
      },
    },
    {
      title: 'Sample flow data',
      area: 'data',
      Panel: DataPanel,
      props: {
        mode: 'json',
      },
    },
    {
      title: 'Generated file',
      area: 'result',
      Panel: ResultPanel,
      props: {
        mode: 'text',
      },
    },
  ],
  drawer: {
    showLayoutToggle: true,
  },
};
