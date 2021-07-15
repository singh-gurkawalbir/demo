import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useConfirmDialog from '../../ConfirmDialog';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { AFE_SAVE_STATUS } from '../../../utils/constants';

export default function useCancelConfirm(editorId, onClose) {
  const dispatch = useDispatch();
  const { saveDiscardDialog } = useConfirmDialog();
  const [closeTriggered, setCloseTriggered] = useState(false);
  const isEditorDirty = useSelector(state => selectors.isEditorDirty(state, editorId));
  const saveStatus = useSelector(state => selectors.editor(state, editorId).saveStatus);
  const saveSuccessful = saveStatus === AFE_SAVE_STATUS.SUCCESS;
  const saveInProgress = saveStatus === AFE_SAVE_STATUS.REQUESTED;

  const handleSave = useCallback(() => dispatch(actions.editor.saveRequest(editorId)), [dispatch, editorId]);
  const handleSaveAndClose = useCallback(() => {
    handleSave();
    setCloseTriggered(true);
  }, [handleSave]);

  const handleCancelClick = useCallback(() => {
    if (!isEditorDirty) return onClose();

    saveDiscardDialog({
      onSave: handleSaveAndClose,
      onDiscard: onClose,
    });
  }, [saveDiscardDialog, handleSaveAndClose, isEditorDirty, onClose]);

  useEffect(() => {
    if (closeTriggered && saveSuccessful) onClose();
  }, [closeTriggered, onClose, saveSuccessful]);

  return {
    saveStatus,
    handleSave,
    handleSaveAndClose,
    handleCancelClick,
    saveInProgress,
    isEditorDirty,
  };
}
