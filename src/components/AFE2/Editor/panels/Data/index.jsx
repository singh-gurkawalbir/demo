import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';

export default function DataPanel({ editorId, mode, readOnly }) {
  const dispatch = useDispatch();
  const editor = useSelector(state => selectors.editor(state, editorId));
  const { data } = editor;
  const { errorLine, hasError} = useSelector(state => selectors.editor.dataErrors?.(state, editorId) || {});
  const handleChange = value => {
    dispatch(actions.editor.patchData(value));
  };

  return (
    <CodePanel
      value={data}
      mode={mode}
      readOnly={readOnly}
      onChange={handleChange}
      errorLine={errorLine}
      hasError={hasError}
    />
  );
}
