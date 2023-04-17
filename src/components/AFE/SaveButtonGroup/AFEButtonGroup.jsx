import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../reducers';
import SaveAndCloseButtonGroupAuto from '../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import actions from '../../../actions';
import { getFormSaveStatusFromEditorStatus } from '../../../utils/editor';

export default function SaveButtonGroup({ editorId, onClose }) {
  const dispatch = useDispatch();
  const activeProcessor = useSelector(state => selectors.editorActiveProcessor(state, editorId));
  const { entryFunction, scriptId} = useSelector(state => selectors.editorRule(state, editorId)) || {};
  const handleSave = useCallback(() => {
    if (activeProcessor === 'javascript') {
      if (!entryFunction || entryFunction === '' || !scriptId || scriptId === '') { return; }
    }
    dispatch(actions.editor.saveRequest(editorId));
  }, [activeProcessor, dispatch, editorId, entryFunction, scriptId]);
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
