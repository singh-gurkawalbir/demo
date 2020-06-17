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
        title: 'Are you sure you want to cancel?',
        message: 'You have unsaved changes that will be lost if you proceed.',
        buttons: [
          {
            label: 'No, go back',
          },
          {
            label: 'Yes, cancel',
            onClick: cancelTransfer,
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
