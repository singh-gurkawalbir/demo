import { useCallback } from 'react';
import { CLOSE_AFTER_SAVE, SHOULD_FORCE_CLOSE } from '..';
import useConfirmDialog from '../../ConfirmDialog';

export default function useHandleCancelBasic({ isDirty, onClose, handleSave}) {
  const { saveDiscardDialog } = useConfirmDialog();

  const closeAfterSave = useCallback(() => {
    handleSave(CLOSE_AFTER_SAVE);
  }, [handleSave]);
  const handleCancelClick = useCallback(shouldForceClose => {
    if (!isDirty || shouldForceClose === SHOULD_FORCE_CLOSE) return onClose();
    saveDiscardDialog({
      onSave: closeAfterSave,
      onDiscard: onClose,
    });
  }, [isDirty, onClose, saveDiscardDialog, closeAfterSave]);

  return handleCancelClick;
}
