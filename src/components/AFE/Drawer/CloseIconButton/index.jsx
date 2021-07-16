import React from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import CloseIcon from '../../../icons/CloseIcon';
import { selectors } from '../../../../reducers';
import { AFE_SAVE_STATUS } from '../../../../utils/constants';
// import useCancelConfirm from '../../useCancelConfirm';

export default function EditorDrawerCloseIconButton({editorId, onClose}) {
  // const { handleCancelClick, saveInProgress } = useCancelConfirm(editorId, onClose); // not sure whether to show confirmation dialog on close in AFE

  const saveStatus = useSelector(state => selectors.editor(state, editorId).saveStatus);
  const saveInProgress = saveStatus === AFE_SAVE_STATUS.REQUESTED;

  return (
    <IconButton
      size="small"
      data-test="closeRightDrawer"
      aria-label="Close"
      disabled={saveInProgress}
      onClick={onClose}>
      <CloseIcon />
    </IconButton>
  );
}
