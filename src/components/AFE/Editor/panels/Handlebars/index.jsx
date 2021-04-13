import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';

export default function HandlebarsPanel({ editorId, mode = 'handlebars', enableAutocomplete = true }) {
  const dispatch = useDispatch();
  const {rule, error, errorLine} = useSelector(state => {
    const e = selectors._editor(state, editorId);

    return {
      rule: e.rule,
      error: e.error,
      errorLine: e.errorLine,
    };
  }, shallowEqual);
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));

  const handleChange = useCallback(newRule => {
    dispatch(actions._editor.patchRule(editorId, newRule));
  }, [dispatch, editorId]);

  return (
    <CodePanel
      name="rule"
      value={rule}
      mode={mode}
      readOnly={disabled}
      onChange={handleChange}
      enableAutocomplete={enableAutocomplete}
      errorLine={errorLine}
      hasError={error}
    />
  );
}
