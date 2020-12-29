import React from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import CloseIcon from '../../../icons/CloseIcon';
import useCancelConfirm from '../../useCancelConfirm';

export default function EditorDrawerCloseIconButton({editorId, onClose}) {
  const handleCloseClick = useCancelConfirm(editorId, onClose);
  const saveInProgress = useSelector(state => {
    const {saveStatus} = selectors._editor(state, editorId);

    return saveStatus === 'requested';
  });

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
