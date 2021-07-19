import { useCallback } from 'react';
import { CLOSE_AFTER_SAVE } from '..';
import useConfirmDialog from '../../ConfirmDialog';

export default function useHandleCancelBasic({ isDirty, onClose, handleSave}) {
  const { saveDiscardDialog } = useConfirmDialog();

  const closeAfterSave = useCallback(() => {
    handleSave(CLOSE_AFTER_SAVE);
  }, [handleSave]);
  const handleCancelClick = useCallback(shouldForceClose => {
    if (!isDirty || shouldForceClose === true) return onClose();
    saveDiscardDialog({
      onSave: closeAfterSave,
      onDiscard: onClose,
    });
  }, [isDirty, onClose, saveDiscardDialog, closeAfterSave]);

  return handleCancelClick;
}
