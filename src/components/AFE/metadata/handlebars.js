import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import HandlebarsPanel from '../Editor/panels/Handlebars';
import ManageLookup from '../Drawer/actions/ManageLookup';
import ToggleAFEButton from '../Drawer/actions/ToggleAFEButton';
import HandlebarGuide from '../Drawer/actions/HandlebarGuide';

export default {
  type: 'handlebars',
  label: 'Handlebars editor',
  description: 'Constructs JSON or XML template against raw data',
  panels: ({ autoEvaluate, resultMode /* , fieldId */ }) => [
    {
      title: 'Type your handlebars template here',
      area: 'rule',
      Panel: HandlebarsPanel,
      // Example key: possibly some help is field specific
      // helpKey: `afe.handlebar.rule.${fieldId}`,
    },
    {
      title: 'Resources available for your handlebars template',
      area: 'data',
      Panel: DataPanel,
      // Example Other help may be fixed for a specific panel.
      // helpKey: 'afe.handlebar.data',
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
  drawer: {
    showLayoutToggle: true,
    actions: [
      { component: ToggleAFEButton,
        position: 'left',
      },
      { component: HandlebarGuide, position: 'right' },
      { component: ManageLookup,
        position: 'right', // default is right.
      },
    ],
  },
};
