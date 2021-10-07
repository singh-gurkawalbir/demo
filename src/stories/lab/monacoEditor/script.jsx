import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core';
import Editor, { useMonaco } from '@monaco-editor/react';

const useStyles = makeStyles({
  container: {
    height: '80vh',
    minHeight: '300px',
    overflow: 'hidden',
  },
});

// extra libraries
const libSource = `
  // simple JS suggestions
  const FindMe = ()=>{ return 0; };',

  // TS suggestions include types.
  declare class Facts {',
      /**',
       * Returns the next fact',
       */',
      static next():string',
  }'
`;
const libUri = 'ts:filename/facts.d.ts';

const Template = args => {
  const classes = useStyles();
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        // ...opts,
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        allowJs: true,
        allowNonTsExtensions: true,
        lib: ['es2015'],
      });

      // console.log(monaco, opts);

      monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
      // When resolving definitions and references, the editor will try to use created models.
      // Creating a model for the library allows "peek definition/references" commands to work with the library.
      const model = monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));

      // an editor can only have 1 model. we need to dispose of it so that the next
      // init will be able to create a new one.
      return () => {
        // console.log('disposing editor model', model);
        model.dispose();
      };
    }
  }, [monaco]);

  return (
    <div className={classes.container}>
      <Editor
        height="100%"
        options={{
          // minimap options: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorminimapoptions.html
          minimap: {
            enabled: false,
          },
        }}
        {...args} />
    </div>
  );
};

const sampleJS = `
// This is some sample code
const count = 10;
const data = {
  a: 123,
  b: true,
  c: 'some string',
  d: new Array(),
};
const list = ['dog', 'cat', 'pig'];

function add(a, b) {
    return a + b;
  }

for (let i=0; i<count; i++) {
  // do something!
  console.log(add(i, 5));
}
`;

export const scriptEditor = Template.bind({});

scriptEditor.args = {
  defaultLanguage: 'javascript',
  defaultValue: sampleJS,
};
