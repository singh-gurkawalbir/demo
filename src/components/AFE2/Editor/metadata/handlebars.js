import DataPanel from '../panels/Data';
import ResultPanel from '../panels/Result';
import HandlebarsPanel from '../panels/Handlebars';

export default {
  type: 'handlebars',
  label: 'Handlebars editor',
  description: 'Constructs JSON or XML template against raw data',
  layout: 'compact',
  panels: ({ autoEvaluate, resultMode }) => [
    {
      title: 'Type your handlebars template here',
      area: 'rule',
      Panel: HandlebarsPanel,
    },
    {
      title: 'Resources available for your handlebars template',
      area: 'data',
      Panel: DataPanel,
      props: {
        mode: 'json',
      },
    },
    {
      title: autoEvaluate ? 'Evaluated handlebars template' : 'Click preview to evaluate your handlebars template',
      area: 'result',
      Panel: ResultPanel,
      props: {
        mode: resultMode,
      },
    },
  ],
};
