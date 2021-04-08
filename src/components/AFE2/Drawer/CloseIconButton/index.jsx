import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import CloseIcon from '../../../icons/CloseIcon';
import useCancelConfirm from '../../useCancelConfirm';
import actions from '../../../../actions';

export default function EditorDrawerCloseIconButton({editorId, onClose}) {
  const dispatch = useDispatch();
  const [closeTriggered, setCloseTriggered] = useState(false);
  const { saveStatus } = useSelector(state => selectors._editor(state, editorId));
  const saveSuccessful = saveStatus === 'success';

  const handleSaveAndClose = useCallback(() => {
    dispatch(actions._editor.saveRequest(editorId));
    setCloseTriggered(true);
  }, [dispatch, editorId]);

  useEffect(() => {
    if (closeTriggered && saveSuccessful) onClose();
  }, [closeTriggered, onClose, saveSuccessful]);

  const handleCloseClick = useCancelConfirm(editorId, onClose, handleSaveAndClose);
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
