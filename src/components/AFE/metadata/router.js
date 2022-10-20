import React from 'react';
import RouterPanel from '../Editor/panels/Router';
import JavaScriptPanel from '../Editor/panels/JavaScript';
import DataPanel from '../Editor/panels/Data';
import ToggleMode from '../Drawer/actions/ToggleMode';
import RouterMenu from '../Drawer/actions/RouterMenu';
import ResultPanel from '../Editor/panels/Result';
import InputOutputTitle from '../Editor/panels/Router/InputOutputTitle';

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
        title: () => <InputOutputTitle activeProcessor={activeProcessor} type="input" />,
        area: 'form',
        Panel: DataPanel,
        props: {mode: 'json'},
      },
      {
        title: () => <InputOutputTitle activeProcessor={activeProcessor} type="output" />,
        area: 'values',
        Panel: ResultPanel,
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
