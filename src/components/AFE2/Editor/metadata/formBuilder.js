import RulePanel from '../panels/Rule';
import JavaScriptPanel from '../panels/JavaScript';
import FormPreviewPanel from '../panels/formBuilder/FormPreview';
import OutputPanel from '../panels/formBuilder/Output';

export default {
  type: 'formBuilder',
  label: 'Form builder',
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
};
