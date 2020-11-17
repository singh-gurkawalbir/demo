import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';

export default function RulePanel({ editorId, mode, readOnly }) {
  const dispatch = useDispatch();
  const { rule } = useSelector(state => selectors.editor(state, editorId));
  const { errorLine, hasError} = useSelector(state => selectors.editor.dataErrors?.(state, editorId) || {});
  const handleChange = value => {
    dispatch(actions.editor.patchRule(value));
  };

  return (
    <CodePanel
      value={rule}
      mode={mode}
      readOnly={readOnly}
      onChange={handleChange}
      errorLine={errorLine}
      hasError={hasError}
    />
  );
}
