import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import HandlebarsPanel from '../Editor/panels/Handlebars';
import ManageLookup from '../Drawer/actions/ManageLookup';
import ToggleAFEButton from '../Drawer/actions/ToggleAFEButton';
import ToggleLayout from '../Drawer/actions/ToggleLayout';

export default {
  type: 'handlebars',
  label: 'Handlebars editor',
  description: 'Constructs JSON or XML template against raw data',
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
  drawer: {
    size: 'large',
    actions: [ManageLookup, ToggleAFEButton, ToggleLayout],
  },
};
