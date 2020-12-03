import RulePanel from '../Editor/panels/Rule';
import JavaScriptPanel from '../Editor/panels/JavaScript';
import FormPreviewPanel from '../Editor/panels/formBuilder/FormPreview';
import OutputPanel from '../Editor/panels/formBuilder/Output';
import ToggleFormMode from '../Drawer/actions/ToggleFormMode';

export default {
  type: 'settingsForm',
  label: 'Settings Form builder',
  fieldId: 'settingsForm',
  description: 'Construct a form from metadata',
  layout: ({ mode }) => `${mode}FormBuilder`,
  panels: ({ mode }) => {
    const panels = [
      {
        title: ({ mode }) => mode === 'json' ? 'Form definition' : 'Script input',
        area: 'meta',
        Panel: RulePanel,
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

    if (mode === 'script') {
      panels.push(
        {
          area: 'hook',
          Panel: JavaScriptPanel,
          props: { insertStubKey: 'formInit' },
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
