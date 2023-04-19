
import React from 'react';
import JSONPretty from 'react-json-pretty';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  jsonPrettier: {
    '& > pre': {
      whiteSpace: 'pre-wrap',
      padding: [[0, 8]],
    },
  },
});
const jsonTheme = {
  main: 'font-size:14px',
  // error: 'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
  key: 'color:#C82829;',
  string: 'color:#718C00;',
  value: 'color:#F5871F;',
  boolean: 'color:#F5871F;',
};

export default function JsonContent({json}) {
  const classes = useStyles();

  return <JSONPretty data={json} theme={jsonTheme} className={classes.jsonPrettier} />;
}
