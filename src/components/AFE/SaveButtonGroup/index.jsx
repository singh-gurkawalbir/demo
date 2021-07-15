import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import { AFE_SAVE_STATUS, FORM_SAVE_STATUS } from '../../../utils/constants';
import SaveAndCloseButtonGroup from '../../SaveAndCloseButtonGroup';
import useCancelConfirm from '../useCancelConfirm';

export default function SaveButtonGroup({ editorId, onClose }) {
  const { handleSave, handleCancelClick, saveInProgress, isEditorDirty, saveStatus} = useCancelConfirm(editorId, onClose);
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const editorViolations = useSelector(state => selectors.editorViolations(state, editorId));
  const disable = !!editorViolations || disabled || saveInProgress || !isEditorDirty;
  const getStatus = useMemo(() => {
    switch (saveStatus) {
      case AFE_SAVE_STATUS.SUCCESS: return FORM_SAVE_STATUS.COMPLETE;
      case AFE_SAVE_STATUS.REQUESTED: return FORM_SAVE_STATUS.LOADING;
      default: return undefined;
    }
  }, [saveStatus]);

  return (
    <SaveAndCloseButtonGroup
      isDirty={isEditorDirty}
      status={getStatus}
      onClose={handleCancelClick}
      onSave={handleSave}
      disabled={disable}
    />
  );
}
