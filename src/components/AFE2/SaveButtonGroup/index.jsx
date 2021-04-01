import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ButtonGroup from '../../ButtonGroup';
import useCancelConfirm from '../useCancelConfirm';

export default function SaveButtonGroup({ editorId, onClose }) {
  const dispatch = useDispatch();
  const [closeTriggered, setCloseTriggered] = useState(false);
  const { saveStatus, disabled } = useSelector(state => selectors._editor(state, editorId));
  const editorViolations = useSelector(state => selectors._editorViolations(state, editorId));
  const isEditorDirty = useSelector(state => selectors._isEditorDirty(state, editorId));
  const saveInProgress = saveStatus === 'requested';
  const saveSuccessful = saveStatus === 'success';
  const disable = !!editorViolations || disabled || saveInProgress || !isEditorDirty;

  const handleSave = () => dispatch(actions._editor.saveRequest(editorId));
  const handleSaveAndClose = () => {
    handleSave();
    setCloseTriggered(true);
  };
  const handleCancelClick = useCancelConfirm(editorId, onClose, handleSaveAndClose);

  useEffect(() => {
    if (closeTriggered && saveSuccessful) onClose();
  }, [closeTriggered, saveSuccessful, onClose]);

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
