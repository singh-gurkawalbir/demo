import React from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '../../../icons/CloseIcon';
import useCancelConfirm from '../../useCancelConfirm';

export default function EditorDrawerCloseIconButton({editorId, onClose}) {
  const handleCloseClick = useCancelConfirm(editorId, onClose);

  return (
    <IconButton
      size="small"
      data-test="closeRightDrawer"
      aria-label="Close"
      onClick={handleCloseClick}>
      <CloseIcon />
    </IconButton>
  );
}
