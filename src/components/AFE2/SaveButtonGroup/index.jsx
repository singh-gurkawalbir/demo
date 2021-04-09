import React from 'react';
import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import ButtonGroup from '../../ButtonGroup';
import useCancelConfirm from '../useCancelConfirm';

export default function SaveButtonGroup({ editorId, onClose }) {
  const { handleSave, handleSaveAndClose, handleCancelClick, saveInProgress, isEditorDirty } = useCancelConfirm(editorId, onClose);
  const { disabled } = useSelector(state => selectors._editor(state, editorId));
  const editorViolations = useSelector(state => selectors._editorViolations(state, editorId));
  const disable = !!editorViolations || disabled || saveInProgress || !isEditorDirty;

  return (
    <ButtonGroup>
      <Button
        variant="outlined"
        data-test="saveEditor"
        disabled={disable}
        color="primary"
        onClick={handleSave}>
        Save
      </Button>
      <Button
        variant="outlined"
        data-test="saveAndCloseEditor"
        disabled={disable}
        color="secondary"
        onClick={handleSaveAndClose}>
        Save & close
      </Button>
      <Button
        variant="text"
        color="primary"
        data-test="closeEditor"
        disabled={saveInProgress}
        onClick={handleCancelClick}>
        Cancel
      </Button>
    </ButtonGroup>
  );
}
