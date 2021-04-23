import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';

export default function RulePanel({ editorId, mode, attrName = 'rule' }) {
  const dispatch = useDispatch();
  const rule = useSelector(state => selectors.editorRule(state, editorId));
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const { errorLine, error} = useSelector(state => selectors.editorPreviewError(state, editorId));
  const handleChange = newRule => {
    dispatch(actions.editor.patchRule(editorId, newRule));
  };

  return (
    <CodePanel
      name={attrName}
      value={rule}
      mode={mode}
      readOnly={disabled}
      onChange={handleChange}
      errorLine={errorLine}
      hasError={!!error}
    />
  );
}
