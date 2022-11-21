import RouterPanel from '../Editor/panels/Router';
import JavaScriptPanel from '../Editor/panels/JavaScript';
import DataPanel from '../Editor/panels/Data';
import ToggleMode from '../Drawer/actions/ToggleMode';
import RouterMenu from '../Drawer/actions/RouterMenu';
import ResultPanel from '../Editor/panels/Result';

export default {
  type: 'router',
  label: 'Add branching',
  fieldId: 'router',
  description: 'Configure branches and conditions',
  panels: ({ activeProcessor = 'filter' }) => {
    const panels = [
      {
        // title: 'Branch configuration', // no title = no PanelTitle render.
        area: 'meta',
        Panel: RouterPanel,
        isLoggable: true,
        props: { mode: 'json' },
      },
      {
        title: activeProcessor === 'javascript' ? 'Function input' : 'Input',
        area: 'form',
        Panel: DataPanel,
        helpKey: 'afe.router.input',
        props: {mode: 'json'},
      },
      {
        title: activeProcessor === 'javascript' ? 'Function output' : 'Output',
        area: 'values',
        Panel: ResultPanel,
        helpKey: 'afe.router.output',
      },
    ];

    if (activeProcessor === 'javascript') {
      panels.push(
        {
          title: 'Branch conditions script',
          area: 'hook',
          isLoggable: true,
          Panel: JavaScriptPanel,
        }
      );
    }

    return panels;
  },
  drawer: {
    actions: [
      { component: ToggleMode, position: 'right' },
      { component: RouterMenu, position: 'menu' },
    ],
  },
};
