import React, { useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Editor, { useMonaco } from '@monaco-editor/react';
import { createProposals } from './handlebarHelpers';

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
      monaco.languages.registerCompletionItemProvider('sql', {
        provideCompletionItems(model, position) {
          // find out if we are completing a property in the 'dependencies' object.
          const textUntilPosition = model.getValueInRange({ startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });
          const match = textUntilPosition.match(/.*{{#?.*}*$/m);

          // console.log(textUntilPosition, '\nmatch', match);

          if (!match) {
            return { suggestions: [] };
          }

          const word = model.getWordUntilPosition(position);
          const surroundingText = model.getValueInRange({ startLineNumber: position.lineNumber, startColumn: word.startColumn - 2, endLineNumber: position.lineNumber, endColumn: word.endColumn + 2 });

          let replaceOffset = 0;

          if (surroundingText.endsWith('}}')) {
            replaceOffset = 2;
          }

          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn - 2, // we want to also replace the leading `{{` chars
            endColumn: word.endColumn + replaceOffset, // if present, replace the trailing '}}'
          };

          return {
            suggestions: createProposals(monaco, range),
          };
        },
      });
    }
  }, [monaco]);

  return (
    <div className={classes.container}>
      <Editor
        height="100%"
        {...args} />
    </div>
  );
};

const sample = `
SELECT 
  country.country_name_eng,
  SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls,
  AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
FROM country 
LEFT JOIN city ON city.country_id = country.id
LEFT JOIN customer ON city.id = customer.city_id
LEFT JOIN call ON call.customer_id = customer.id
GROUP BY 
  country.id,
  country.country_name_eng
HAVING AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) > (SELECT AVG(DATEDIFF(SECOND, call.start_time, call.end_time)) FROM call)
ORDER BY calls DESC, country.id ASC;
`;

export const customAutoComplete = Template.bind({});

customAutoComplete.args = {
  defaultLanguage: 'sql',
  defaultValue: sample,
};
