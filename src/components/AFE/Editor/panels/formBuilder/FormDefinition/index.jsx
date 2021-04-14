import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import CodePanel from '../../Code';

export default function FormDefinitionPanel({ editorId, mode }) {
  const dispatch = useDispatch();
  const {formData, autoPreview} = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return {formData: e.data, autoPreview: e.autoEvaluate};
  }, shallowEqual);
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const { errorLine, error} = useSelector(state => selectors.editorPreviewError(state, editorId));

  const handleChange = newFormData => {
    dispatch(actions.editor.patchFeatures(editorId, {data: newFormData}));
    // dispatch toggle preview action to trigger preview saga when the form data is updated
    dispatch(actions.editor.toggleAutoPreview(editorId, autoPreview));
  };

  return (
    <CodePanel
      name="data"
      value={formData}
      mode={mode}
      readOnly={disabled}
      onChange={handleChange}
      errorLine={errorLine}
      hasError={!!error}
    />
  );
}
