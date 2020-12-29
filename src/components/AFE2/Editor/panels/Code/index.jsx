import React, { useMemo } from 'react';
import CodeEditor from '../../../../CodeEditor2';

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
  onChange,
  enableAutocomplete,
  overrides,
  errorLine,
  hasError,
  hasWarning,
  onLoad,
}) {
  const config = useMemo(() => ({
    ...defaults.global,
    ...defaults[mode],
    ...overrides,
  }), [mode, overrides]);

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
      showGutter={config.showGutter}
      showInvisibles={config.showInvisibles}
      useWorker={config.useWorker}
      enableAutocomplete={enableAutocomplete}
      wrap={config.wrap}
      onChange={onChange}
      errorLine={errorLine}
      hasError={hasError}
      hasWarning={hasWarning}
      onLoad={onLoad}
    />
  );
}
