import { useCallback } from 'react';
import useConfirmDialog from '../../ConfirmDialog';

export default function useHandleCancelBasic({ isDirty, onClose, handleSave}) {
  const { saveDiscardDialog } = useConfirmDialog();

  const handleCancelClick = useCallback(() => {
    if (!isDirty) return onClose();

    saveDiscardDialog({
      onSave: handleSave,
      onDiscard: onClose,
    });
  }, [saveDiscardDialog, handleSave, isDirty, onClose]);

  return handleCancelClick;
}
