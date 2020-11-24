import DataPanel from '../panels/Data';
import ResultPanel from '../panels/Result';
import JavaScriptPanel from '../panels/JavaScript';

export default {
  type: 'javascript',
  label: 'JavaScript editor',
  description: 'Run JavaScript safely in a secure runtime environment.',
  layout: 'compact',
  panels: ({ resultMode }) => [
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
      props: {
        mode: resultMode,
      },
    },
  ],
};
