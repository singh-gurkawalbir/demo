import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useConfirmDialog from '../../ConfirmDialog';
import { selectors } from '../../../reducers';

export default function useCancelConfirm(editorId, onClose) {
  const { confirmDialog } = useConfirmDialog();
  const isEditorDirty = useSelector(state => selectors._isEditorDirty(state, editorId));

  const handleCancelClick = useCallback(() => {
    if (!isEditorDirty) return onClose();

    confirmDialog({
      title: 'Confirm cancel',
      message: 'Are you sure you want to cancel? You have unsaved changes that will be lost if you proceed.',
      buttons: [
        {
          label: 'Yes, cancel',
          onClick: onClose,
        },
        {
          label: 'No, go back',
          // color: 'secondary',
        },
      ],
    });
  }, [confirmDialog, isEditorDirty, onClose]);

  return handleCancelClick;
}
