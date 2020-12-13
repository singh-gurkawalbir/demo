import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import HandlebarsPanel from '../Editor/panels/Handlebars';
import FeaturePanel from '../Editor/panels/Feature';

export default {
  type: 'sql',
  fieldId: 'rdbms.query',
  label: 'SQL query builder',
  description: 'Use a handlebar template to construct SQL queries',
  panels: ({ autoEvaluate }) => [
    {
      group: true,
      area: 'rule',
      panels: [
        {
          key: 'query',
          name: 'Type your handlebars template here',
          Panel: HandlebarsPanel,
        },
        {
          key: 'default',
          name: 'Defaults',
          Panel: FeaturePanel,
          props: {
            mode: 'json',
            featureName: 'defaultValue',
          },
        },
      ],
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
        mode: 'text',
      },
    },
  ],
};
