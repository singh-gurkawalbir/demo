import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import CloseIcon from '../../../icons/CloseIcon';
import { selectors } from '../../../../reducers';
import { AFE_SAVE_STATUS } from '../../../../utils/constants';
import useFormOnCancel from '../../../FormOnCancelContext';

export default function EditorDrawerCloseIconButton({editorId}) {
  const saveStatus = useSelector(state => selectors.editor(state, editorId).saveStatus);
  const saveInProgress = saveStatus === AFE_SAVE_STATUS.REQUESTED;

  const {setCancelTriggered} = useFormOnCancel();
  const onClose = useCallback(() => {
    setCancelTriggered(editorId);
  }, [editorId, setCancelTriggered]);

  return (
    <IconButton
      size="small"
      date-test="close"
      data-test="closeRightDrawer"
      aria-label="Close"
      disabled={saveInProgress}
      onClick={onClose}>
      <CloseIcon />
    </IconButton>
  );
}
