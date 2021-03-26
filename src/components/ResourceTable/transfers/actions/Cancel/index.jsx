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
    const { cancelDialog } = useConfirmDialog();
    const cancelTransfer = useCallback(() => {
      dispatch(actions.transfer.cancel(transfer._id));
    }, [dispatch, transfer._id]);
    const handleClick = useCallback(() => {
      cancelDialog({onSave: cancelTransfer});
    }, [cancelDialog, cancelTransfer]);

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};
