import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import CancelIcon from '../../../../icons/CancelIcon';

export default {
  label: 'Cancel transfer',
  icon: CancelIcon,
  component: function Cancel({ rowData: transfer }) {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const cancelTransfer = useCallback(() => {
      dispatch(actions.transfer.cancel(transfer._id));
    }, [dispatch, transfer._id]);
    const handleClick = useCallback(() => {
      confirmDialog({
        title: 'You’ve got unsaved changes',
        message: 'Are you sure you want to leave this page and lose your unsaved changes?',
        buttons: [
          {
            label: 'Save Changes',
            onClick: cancelTransfer,
          },
          {
            label: 'Discard Changes',
            color: 'secondary',
          },
        ],
      });
    }, [confirmDialog, cancelTransfer]);

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};
