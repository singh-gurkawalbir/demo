import FormDefinitionPanel from '../Editor/panels/formBuilder/FormDefinition';
import JavaScriptPanel from '../Editor/panels/JavaScript';
import FormPreviewPanel from '../Editor/panels/formBuilder/FormPreview';
import OutputPanel from '../Editor/panels/formBuilder/Output';
import ToggleMode from '../Drawer/actions/ToggleMode';
import ViewAliases from '../Drawer/actions/ViewAliases';

export default {
  type: 'settingsForm',
  label: 'Form builder',
  fieldId: 'settingsForm',
  description: 'Construct a form from metadata',
  panels: ({ activeProcessor = 'json' }) => {
    const panels = [
      {
        title: ({ activeProcessor = 'json' }) => activeProcessor === 'json' ? 'Form definition' : 'Script input',
        area: 'meta',
        Panel: FormDefinitionPanel,
        isLoggable: true,
        props: { mode: 'json' },
      },
      {
        title: 'Form preview',
        area: 'form',
        Panel: FormPreviewPanel,
      },
      {
        title: 'Form output',
        area: 'values',
        Panel: OutputPanel,
      },
    ];

    if (activeProcessor === 'script') {
      panels.push(
        {
          title: 'Script',
          area: 'hook',
          Panel: JavaScriptPanel,
        }
      );
    }

    return panels;
  },
  drawer: {
    actions: [
      { component: ViewAliases, position: 'right' },
      { component: ToggleMode, position: 'right', type: 'form' },
    ],
  },
};
