import { useCallback } from 'react';
import { CLOSE_AFTER_SAVE } from '..';
import useConfirmDialog from '../../ConfirmDialog';

export default function useHandleCancelBasic({ isDirty, onClose, handleSave}) {
  const { saveDiscardDialog } = useConfirmDialog();

  const closeAfterSave = useCallback(() => {
    handleSave(CLOSE_AFTER_SAVE);
  }, [handleSave]);
  // In some cases like ConfigConnectionDebugger the form becomes dirty after saving due to the time difference
  // in this case we want the drawer to close without showing the confirm dialog, this 'shouldForceClose' prop
  // helps us in achieving the same.
  const handleCancelClick = useCallback(shouldForceClose => {
    if (!isDirty || shouldForceClose === true) return onClose();
    saveDiscardDialog({
      onSave: closeAfterSave,
      onDiscard: onClose,
    });
  }, [isDirty, onClose, saveDiscardDialog, closeAfterSave]);

  return handleCancelClick;
}
