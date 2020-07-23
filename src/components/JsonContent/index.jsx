import React from 'react';
import JSONPretty from 'react-json-pretty';

const jsonTheme = {
  main: 'font-size:14px',
  // error: 'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
  key: 'color:#C82829;',
  string: 'color:#718C00;',
  value: 'color:#F5871F;',
  boolean: 'color:#F5871F;',
};

export default function JsonContent({json}) {
  return <JSONPretty data={json} theme={jsonTheme} />;
}
