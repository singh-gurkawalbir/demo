import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import HandlebarsPanel from '../Editor/panels/Handlebars';
import FeaturePanel from '../Editor/panels/Feature';
import ManageLookup from '../Drawer/actions/ManageLookup';
import ToggleAFEButton from '../Drawer/actions/ToggleAFEButton';
import ToggleLayout from '../Drawer/actions/ToggleLayout';

export default {
  type: 'sql',
  label: 'SQL query builder',
  description: 'Use a handlebar template to construct SQL queries',
  panels: ({ autoEvaluate, supportsDefaultData }) => {
    const panels = [{
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
    }];

    if (!supportsDefaultData) {
      panels.push({
        title: 'Type your handlebars template here',
        area: 'rule',
        Panel: HandlebarsPanel,
      });
    } else {
      panels.push({
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
              featureName: 'defaultData',
            },
          },
        ],
      });
    }

    return panels;
  },

  drawer: {
    actions: [ManageLookup, ToggleAFEButton, ToggleLayout],
  },
};
