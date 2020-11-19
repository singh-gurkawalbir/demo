import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';

export default function RulePanel({ editorId, mode, readOnly }) {
  const dispatch = useDispatch();
  const rule = useSelector(state => selectors._editorRule(state, editorId));
  const { errorLine, error} = useSelector(state => selectors._editorPreviewError(state, editorId));
  const handleChange = rule => {
    // dispatch(actions.editor.patchRule(value));
    // TODO: have separate patchrule which then can do version1/2 logic
    dispatch(actions._editor.patch(editorId, { rule }));
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
