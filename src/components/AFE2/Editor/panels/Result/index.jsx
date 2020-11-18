import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';

export default function ResultPanel({ editorId, mode }) {
  const { data: result, warning } = useSelector(state => selectors._editorResult(state, editorId));

  return (
    <CodePanel
      value={result}
      mode={mode}
      readOnly
      hasWarning={!!warning}
    />
  );
}
