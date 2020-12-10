import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import JavaScriptPanel from '../Editor/panels/JavaScript';

export default {
  type: 'javascript',
  label: 'JavaScript editor',
  description: 'Run JavaScript safely in a secure runtime environment.',
  layout: 'compact',
  panels: [
    {
      title: 'Script',
      area: 'rule',
      Panel: JavaScriptPanel,
    },
    {
      title: 'Function input',
      area: 'data',
      Panel: DataPanel,
      props: {
        mode: 'json',
      },
    },
    {
      title: 'Function output',
      area: 'result',
      Panel: ResultPanel,
      props: ({ resultMode }) => ({
        mode: resultMode,
      }),
    },
  ],
};
