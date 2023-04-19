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

const Template = args => {
  const classes = useStyles();
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      // Note that we do not need to define a theme every time an instance of an editor is used.
      // We only need to do this once when our UI initializes... We could, in the final editor code,
      // check to see if the Celigo theme is already defined, and if so, skip the re-definition.
      // for this story, we will keep things simple and basically re-define the theme each time the story
      // is rendered.
      monaco.editor.defineTheme('CeligoTheme', {
        base: 'vs', // we should set the base theme to an exiting one tht matches closes to our desired colors
        inherit: true,

        // rules are language specific and used for syntax highlighting.
        // Syntax highlighting in Monaco is provided by another library called "Monarch".
        // search for Monarch examples if we want to create custom language specific highlighting rules.
        // This would be especially useful if we wanted to use say, graphQL language, but also allow
        // for {{handlebars}} notation as well (dual language support).
        // Refer to; https://microsoft.github.io/monaco-editor/monarch.html, and select the sample
        // language to see what existing tokens are available for customization. Note that each language
        // has a suffix (documented in the above link).
        rules: [
          { token: 'comment', foreground: 'ffa500', fontStyle: 'italic underline' },
          // built in language support uses suffixes to target tokens from that language.
          // in the case below, the above "comment" style will be overridden for javascript below
          { token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
          { token: 'string.js', foreground: '000088', fontStyle: 'bold' }, // javascript strings only.
        ],
        // these colors are non-language specific and set the base colors for the editor. (not syntax highlighting)
        // Refer to the link below for a complete list of possible color names.
        // https://github.com/microsoft/vscode/blob/main/src/vs/platform/theme/common/colorRegistry.ts#L187
        colors: {
          'editor.foreground': '#000000',
          'editor.background': '#FFCCDD',
          'editorCursor.foreground': '#8B0000',
          // using an 8 digit HEX value indicates an Alpha channel (first 6=color, last 2 bytes = alpha)
          'editor.lineHighlightBackground': '#0000FF20',
          'editorLineNumber.foreground': '#008800',
          'editor.selectionBackground': '#88000030',
          'editor.inactiveSelectionBackground': '#88000015',
        },
      });

      // I'm not sure why setting the editor theme here doesn't work...
      // Instead, i set the theme as a prop in the <Editor /> component directly.
      // possibly the editor's default theme prop is conflicting with the below setTheme() call.
      monaco.editor.setTheme('CeligoTheme');
    }
  }, [monaco]);

  return (
    <div className={classes.container}>
      <Editor
        height="100%"
        theme="CeligoTheme"
        options={{
          minimap: {
            enabled: false,
          },
        }}
        {...args} />
    </div>
  );
};

const sample = `
const abc = 123;
const def = "some string";
const xyz = true;
const yyz = new DateTime();

function $initHighlight(block, cls) {
  try {
    if (cls.search(/\\bno\\-highlight\\b/) != -1)
      return process(block, true, 0x0F) + \` class="\${cls}"\`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }

  return Math.sin($initHighlight(abc, xyz);
}
`;

export const customTheme = Template.bind({});

customTheme.args = {
  defaultLanguage: 'javascript',
  defaultValue: sample,
};
