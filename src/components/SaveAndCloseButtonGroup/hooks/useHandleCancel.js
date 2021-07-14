import { useCallback } from 'react';
import useConfirmDialog from '../../ConfirmDialog';

export default function useHandleCancel({isDirty, onClose, handleSave}) {
  const { saveDiscardDialog } = useConfirmDialog();

  const handleCancelClick = useCallback(() => {
    if (!isDirty) return onClose();

    // console.log('confirm dialog, isDirty:', isDirty);

    saveDiscardDialog({
      onSave: handleSave,
      onDiscard: onClose,
    });
  }, [saveDiscardDialog, handleSave, isDirty, onClose]);

  return handleCancelClick;
}
