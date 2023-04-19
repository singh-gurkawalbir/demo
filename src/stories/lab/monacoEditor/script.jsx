import React, { useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Editor, { useMonaco } from '@monaco-editor/react';

const useStyles = makeStyles({
  container: {
    height: '80vh',
    minHeight: '300px',
    overflow: 'hidden',
  },
});

// This is an example of how to use Celigo-created virtual files that the Monaco editor
// would parse and use for the Monaco auto-suggest feature. We can use this for 2 use-cases:
// 1) we should create a json file that represents the "sample data" json. This would then
//    instruct the Monaco auto-suggest to present the sample data object for a user to scan through.
// 2) Our users who write scripts have access to our JS runtime which supports access to
//    an IO API. (https://docs.google.com/document/d/1jJv0B0olZY7udyED_u__7_3hu6F5kA9qVGRgIlEA4B0/edit#)
//    we could create a static file added to all editor models so that auto-suggest could let our
//    users self-discover our API without needing to study the above help doc.
//    Here is an example of how Monaco's own language libraries are defined for built-in auto suggest.
//    https://github.com/microsoft/TypeScript/blob/main/lib/lib.es2015.core.d.ts
const celigoAPIsource = `
  // simple JS suggestions
  /**',
   * Comments here should appear in Monaco's auto suggest',
   */',
   function autoSuggestMe(a)  { 
     return Number(a) + 10; 
    };',

  // TS suggestions would allow us to include types.
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
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        allowJs: true,
        allowNonTsExtensions: true,
        lib: ['es2015'],
      });

      // console.log(monaco);

      monaco.languages.typescript.javascriptDefaults.addExtraLib(celigoAPIsource, libUri);
      // When resolving definitions and references, the editor will try to use created models.
      // Creating a model for the library allows "peek definition/references" commands to work with the library.
      const model = monaco.editor.createModel(celigoAPIsource, 'typescript', monaco.Uri.parse(libUri));

      // an editor can only have 1 model. we need to dispose of it so that the next
      // init will be able to create a new one, since we only have a single global Monaco
      // instance.
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
