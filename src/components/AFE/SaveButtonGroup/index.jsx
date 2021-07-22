import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../reducers';
import SaveAndCloseButtonGroupAuto from '../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import actions from '../../../actions';
import { getFormSaveStatusFromEditorStatus } from '../../../utils/editor';

export default function SaveButtonGroup({ editorId, onClose }) {
  const dispatch = useDispatch();
  const handleSave = useCallback(() => dispatch(actions.editor.saveRequest(editorId)), [dispatch, editorId]);
  const isEditorDirty = useSelector(state => selectors.isEditorDirty(state, editorId));
  const saveStatus = useSelector(state => selectors.editor(state, editorId).saveStatus);

  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const editorViolations = useSelector(state => selectors.editorViolations(state, editorId));
  const disable = !!editorViolations || disabled;

  return (
    <SaveAndCloseButtonGroupAuto
      asyncKey={editorId}
      isDirty={isEditorDirty}
      status={getFormSaveStatusFromEditorStatus(saveStatus)}
      onClose={onClose}
      onSave={handleSave}
      disabled={disable}
      shouldHandleCancel
    />
  );
}
