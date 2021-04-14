import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import RulePanel from '../Editor/panels/Rule';

export default {
  type: 'structuredFileParser',
  label: 'File parser helper',
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
      title: 'Sample file',
      area: 'data',
      Panel: DataPanel,
      props: {
        mode: 'text',
      },
    },
    {
      title: 'Parsed output',
      area: 'result',
      Panel: ResultPanel,
      props: {
        mode: 'json',
      },
    },
  ],
  drawer: {
    showLayoutToggle: true,
  },
};
