import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import useConfirmDialog from '../../ConfirmDialog';

export default function useHandleCancel({formKey, onClose, handleSave}) {
  const { saveDiscardDialog } = useConfirmDialog();
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

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
