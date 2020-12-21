import FormDefinitionPanel from '../Editor/panels/formBuilder/FromDefinition';
import JavaScriptPanel from '../Editor/panels/JavaScript';
import FormPreviewPanel from '../Editor/panels/formBuilder/FormPreview';
import OutputPanel from '../Editor/panels/formBuilder/Output';
import ToggleFormMode from '../Drawer/actions/ToggleFormMode';

export default {
  type: 'settingsForm',
  label: 'Settings Form builder',
  fieldId: 'settingsForm',
  description: 'Construct a form from metadata',
  panels: ({ activeProcessor = 'json' }) => {
    const panels = [
      {
        title: ({ activeProcessor = 'json' }) => activeProcessor === 'json' ? 'Form definition' : 'Script input',
        area: 'meta',
        Panel: FormDefinitionPanel,
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
    size: 'large',
    actions: [ToggleFormMode],
  },
};
