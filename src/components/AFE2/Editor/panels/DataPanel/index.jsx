import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../CodePanel';

export default function DataPanel({ editorId, mode, readOnly }) {
  const dispatch = useDispatch();
  const value = useSelector(state => selectors.editor.data?.(state, editorId));
  const { errorLine, hasError} = useSelector(state => selectors.editor.dataErrors?.(state, editorId) || {});
  const handleChange = value => {
    dispatch(actions.editor.patchData(value));
  };

  return (
    <CodePanel
      value={value}
      mode={mode}
      readOnly={readOnly}
      onChange={handleChange}
      errorLine={errorLine}
      hasError={hasError}
    />
  );
}
