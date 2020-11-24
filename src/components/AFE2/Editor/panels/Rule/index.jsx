import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';

export default function RulePanel({ editorId, mode, readOnly }) {
  const dispatch = useDispatch();
  const rule = useSelector(state => selectors._editorRule(state, editorId));
  const { errorLine, error} = useSelector(state => selectors._editorPreviewError(state, editorId));
  const handleChange = newRule => {
    dispatch(actions._editor.patchRule(editorId, newRule));
  };

  return (
    <CodePanel
      value={rule}
      mode={mode}
      readOnly={readOnly}
      onChange={handleChange}
      errorLine={errorLine}
      hasError={!!error}
    />
  );
}
