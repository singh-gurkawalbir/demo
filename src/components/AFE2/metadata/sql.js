import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import HandlebarsPanel from '../Editor/panels/Handlebars';
import FeaturePanel from '../Editor/panels/Feature';

export default {
  type: 'sql',
  fieldId: 'rdbms.query',
  label: 'SQL query builder',
  description: 'Use a handlebar template to construct SQL queries',
  layout: 'compact',
  panels: ({ autoEvaluate }) => [
    {
      group: true,
      title: 'Type your handlebars template here',
      area: 'rule',
      panels: [
        {
          key: 'query',
          name: 'Query template',
          Panel: HandlebarsPanel,
        },
        {
          key: 'default',
          name: 'Default record',
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
