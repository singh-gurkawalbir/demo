import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useConfirmDialog from '../../ConfirmDialog';
import { selectors } from '../../../reducers';

export default function useCancelConfirm(editorId, onClose, handleSaveAndClose) {
  const { cancelDialog } = useConfirmDialog();
  const isEditorDirty = useSelector(state => selectors._isEditorDirty(state, editorId));

  const handleCancelClick = useCallback(() => {
    if (!isEditorDirty) return onClose();

    cancelDialog({
      onSave: handleSaveAndClose,
      onDiscard: onClose,
    });
  }, [cancelDialog, handleSaveAndClose, isEditorDirty, onClose]);

  return handleCancelClick;
}
