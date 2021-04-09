import React from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '../../../icons/CloseIcon';
import useCancelConfirm from '../../useCancelConfirm';

export default function EditorDrawerCloseIconButton({editorId, onClose}) {
  const { handleCancelClick: handleCloseClick, saveInProgress } = useCancelConfirm(editorId, onClose);

  return (
    <IconButton
      size="small"
      data-test="closeRightDrawer"
      aria-label="Close"
      disabled={saveInProgress}
      onClick={handleCloseClick}>
      <CloseIcon />
    </IconButton>
  );
}
