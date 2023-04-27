import React from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import CloseIcon from '../../../icons/CloseIcon';
import { selectors } from '../../../../reducers';
import useFormOnCancelContext from '../../../FormOnCancelContext';

export default function EditorDrawerCloseIconButton({editorId, onClose, hideSave}) {
  const saveInProgress = useSelector(state => selectors.isEditorSaveInProgress(state, editorId));

  const {setCancelTriggered} = useFormOnCancelContext(editorId);

  const handleClose = () => {
    // when save is hidden, use custom close handler
    if (hideSave && typeof onClose === 'function') {
      return onClose();
    }
    setCancelTriggered();
  };

  return (
    <IconButton
      size="small"
      date-test="close"
      data-test="closeRightDrawer"
      aria-label="Close"
      disabled={saveInProgress}
      onClick={handleClose}>
      <CloseIcon />
    </IconButton>
  );
}
