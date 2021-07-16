import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import CloseIcon from '../../../icons/CloseIcon';
import { selectors } from '../../../../reducers';
import { AFE_SAVE_STATUS } from '../../../../utils/constants';
import useHandleCancelBasic from '../../../SaveAndCloseButtonGroup/hooks/useHandleCancelBasic';
import actions from '../../../../actions';

export default function EditorDrawerCloseIconButton({editorId, onClose}) {
  const dispatch = useDispatch();
  const saveStatus = useSelector(state => selectors.editor(state, editorId).saveStatus);
  const saveInProgress = saveStatus === AFE_SAVE_STATUS.REQUESTED;
  const isEditorDirty = useSelector(state => selectors.isEditorDirty(state, editorId));
  const handleSave = useCallback(() => dispatch(actions.editor.saveRequest(editorId)), [dispatch, editorId]);

  useHandleCancelBasic({isDirty: isEditorDirty, onClose, handleSave});

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
