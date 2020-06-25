import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../../components/ConfirmDialog';

export default {
  label: 'Cancel transfer',
  component: function Cancel({ rowData: transfer }) {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const cancelTransfer = useCallback(() => {
      dispatch(actions.transfer.cancel(transfer._id));
    }, [dispatch, transfer._id]);
    const handleClick = useCallback(() => {
      confirmDialog({
        title: 'Confirm cancel',
        message: 'Are you sure you want to cancel? You have unsaved changes that will be lost if you proceed.',
        buttons: [
          {
            label: 'Yes, cancel',
            onClick: cancelTransfer,
          },
          {
            label: 'No, go back',
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
