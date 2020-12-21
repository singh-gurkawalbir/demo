import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import CodePanel from '../../Code';

export default function FormDefinitionPanel({ editorId, mode }) {
  const dispatch = useDispatch();
  const formData = useSelector(state => selectors._editor(state, editorId).data);
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const { errorLine, error} = useSelector(state => selectors._editorPreviewError(state, editorId));

  const handleChange = newFormData => {
    dispatch(actions._editor.patchFeatures(editorId, {data: newFormData}));
  };

  return (
    <CodePanel
      value={formData}
      mode={mode}
      readOnly={disabled}
      onChange={handleChange}
      errorLine={errorLine}
      hasError={!!error}
    />
  );
}
