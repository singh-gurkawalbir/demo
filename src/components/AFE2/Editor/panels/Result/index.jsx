import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';

export default function ResultPanel({ editorId, mode }) {
  const result = useSelector(state => selectors.editor.result?.(state, editorId));

  return (
    <CodePanel
      value={result}
      mode={mode}
      readOnly
    />
  );
}
