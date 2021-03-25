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
      title: 'You’ve got unsaved changes',
      message: 'Are you sure you want to leave this page and lose your unsaved changes?',
      buttons: [
        {
          label: 'Save Changes',
          onClick: onClose,
        },
        {
          label: 'Discard Changes',
          // color: 'secondary',
        },
      ],
    });
  }, [confirmDialog, isEditorDirty, onClose]);

  return handleCancelClick;
}
