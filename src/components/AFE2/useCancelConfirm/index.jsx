import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useConfirmDialog from '../../ConfirmDialog';
import { selectors } from '../../../reducers';
import actions from '../../../actions';

export default function useCancelConfirm(editorId, onClose) {
  const dispatch = useDispatch();
  const { saveDiscardDialog } = useConfirmDialog();
  const [closeTriggered, setCloseTriggered] = useState(false);
  const isEditorDirty = useSelector(state => selectors._isEditorDirty(state, editorId));
  const { saveStatus } = useSelector(state => selectors._editor(state, editorId));
  const saveSuccessful = saveStatus === 'success';
  const saveInProgress = saveStatus === 'requested';

  const handleSave = useCallback(() => dispatch(actions._editor.saveRequest(editorId)), [dispatch, editorId]);
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
    handleSave,
    handleSaveAndClose,
    handleCancelClick,
    saveInProgress,
    isEditorDirty,
  };
}
