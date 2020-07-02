import React from 'react';
import CodeEditor from '../../CodeEditor';

const defaults = {
  global: {
    showGutter: true,
    enableLiveAutocompletion: true,
    useWorker: true,
  },
  handlebars: {
    showGutter: false,
  },
  text: {
    showGutter: false,
    showInvisibles: true,
  },
};

export default function CodePanel({
  name,
  value,
  mode,
  readOnly = false,
  height,
  width,
  onChange,
  enableAutocomplete,
  overrides,
  skipDelay,
}) {
  const config = {
    ...defaults.global,
    ...defaults[mode],
    ...overrides,
  };
  let safeValue = '';

  if (value) {
    if (typeof value === 'string') {
      safeValue = value;
    } else if (typeof value === 'object') {
      safeValue = JSON.stringify(value, null, 2);
    } else {
      safeValue = `${value}`;
    }
  }

  return (
    <CodeEditor
      name={name}
      value={safeValue}
      mode={mode}
      readOnly={readOnly}
      height={height}
      width={width}
      showGutter={config.showGutter}
      showInvisibles={config.showInvisibles}
      useWorker={config.useWorker}
      enableAutocomplete={enableAutocomplete}
      wrap={config.wrap}
      onChange={onChange}
      skipDelay={skipDelay}
    />
  );
}
